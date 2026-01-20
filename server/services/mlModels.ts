/**
 * ML Models Service
 * Implements forecasting, classification, and anomaly detection for PETBottle AI Ops
 */

import { mean, standardDeviation, linearRegression } from 'simple-statistics';
import { trainLogisticRegression, predictWithLogisticRegression, getFeatureImportance, type TrainedModel } from './logisticRegression';

export interface ForecastResult {
  predictions: Array<{ date: string; value: number; lower: number; upper: number }>;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export interface FailureRiskPrediction {
  machineId: string;
  riskScore: number; // 0-1
  next7Days: Array<{ date: string; risk: number }>;
  topFeatures: Array<{ feature: string; contribution: number }>;
  explanation: string;
}

export interface AnomalyDetection {
  machineId: string;
  timestamp: string;
  anomalyScore: number; // 0-1, higher = more anomalous
  features: Record<string, number>;
  isAnomaly: boolean;
  explanation: string;
}

/**
 * Exponential Smoothing Forecast
 * Simple forecasting using exponential smoothing
 */
export function forecastExponentialSmoothing(
  historicalData: Array<{ date: string; value: number }>,
  periods: number = 7,
  alpha: number = 0.3
): ForecastResult {
  if (historicalData.length < 2) {
    // Not enough data, return flat forecast
    const lastValue = historicalData[historicalData.length - 1]?.value || 0;
    const predictions = [];
    for (let i = 1; i <= periods; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      predictions.push({
        date: date.toISOString().split('T')[0],
        value: lastValue,
        lower: lastValue * 0.9,
        upper: lastValue * 1.1,
      });
    }
    return { predictions, trend: 'stable', confidence: 0.5 };
  }

  // Extract values
  const values = historicalData.map(d => d.value);
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  // Calculate exponential smoothing
  let smoothed = values[0];
  const smoothedValues = [smoothed];
  
  for (let i = 1; i < values.length; i++) {
    smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    smoothedValues.push(smoothed);
  }

  // Calculate trend using linear regression on recent values
  const recentWindow = Math.min(7, smoothedValues.length);
  const recentValues = smoothedValues.slice(-recentWindow);
  const x = recentValues.map((_, i) => i);
  const regression = linearRegression(x.map((xi, i) => [xi, recentValues[i]]));
  const trendSlope = regression.m;
  
  // Generate forecasts
  const predictions = [];
  const stdDev = standardDeviation(values) || 0;
  const meanValue = mean(values);
  
  for (let i = 1; i <= periods; i++) {
    const forecastValue = smoothed + trendSlope * i;
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, forecastValue),
      lower: Math.max(0, forecastValue - 1.96 * stdDev),
      upper: forecastValue + 1.96 * stdDev,
    });
  }

  const trend: 'up' | 'down' | 'stable' = 
    trendSlope > 0.01 ? 'up' : trendSlope < -0.01 ? 'down' : 'stable';
  const confidence = Math.min(0.95, Math.max(0.5, 1 - (stdDev / (meanValue || 1))));

  return { predictions, trend, confidence };
}

// Global trained model storage
let trainedFailureModel: TrainedModel | null = null;

/**
 * Train failure prediction model from dataset
 */
export function trainFailureModel(trainingData: Array<{
  vibration: number;
  temperature: number;
  powerDraw: number;
  cycleTime: number;
  motorCurrent: number;
  daysSinceMaintenance: number;
  utilization: number;
  failureOccurred: number;
}>): TrainedModel {
  const featureNames = [
    'vibration',
    'temperature',
    'powerDraw',
    'cycleTime',
    'motorCurrent',
    'daysSinceMaintenance',
    'utilization',
  ];

  // Normalize features
  const normalizedFeatures: number[][] = [];
  const labels: number[] = [];

  // Calculate normalization parameters
  const maxValues = {
    vibration: 6,
    temperature: 220,
    powerDraw: 100,
    cycleTime: 40,
    motorCurrent: 20,
    daysSinceMaintenance: 14,
    utilization: 1,
  };

  const minValues = {
    vibration: 1.5,
    temperature: 150,
    powerDraw: 50,
    cycleTime: 20,
    motorCurrent: 10,
    daysSinceMaintenance: 0,
    utilization: 0.7,
  };

  for (const sample of trainingData) {
    const normalized = [
      (sample.vibration - minValues.vibration) / (maxValues.vibration - minValues.vibration),
      (sample.temperature - minValues.temperature) / (maxValues.temperature - minValues.temperature),
      (sample.powerDraw - minValues.powerDraw) / (maxValues.powerDraw - minValues.powerDraw),
      (sample.cycleTime - minValues.cycleTime) / (maxValues.cycleTime - minValues.cycleTime),
      (sample.motorCurrent - minValues.motorCurrent) / (maxValues.motorCurrent - minValues.motorCurrent),
      sample.daysSinceMaintenance / maxValues.daysSinceMaintenance,
      (sample.utilization - minValues.utilization) / (maxValues.utilization - minValues.utilization),
    ];
    normalizedFeatures.push(normalized);
    labels.push(sample.failureOccurred);
  }

  // Train logistic regression
  const model = trainLogisticRegression(
    { features: normalizedFeatures, labels },
    0.01, // learning rate
    1000, // iterations
    featureNames
  );

  trainedFailureModel = model;
  return model;
}

/**
 * Failure Risk Classification using trained logistic regression
 */
export function predictFailureRisk(
  machineId: string,
  features: {
    vibration?: number;
    temperature?: number;
    powerDraw?: number;
    cycleTime?: number;
    motorCurrent?: number;
    daysSinceMaintenance?: number;
    utilization?: number;
  }
): FailureRiskPrediction {
  // Use trained model if available, otherwise use fallback
  if (!trainedFailureModel) {
    // Fallback to simple model if not trained
    return predictFailureRiskFallback(machineId, features);
  }

  // Normalize features
  const maxValues = { vibration: 6, temperature: 220, powerDraw: 100, cycleTime: 40, motorCurrent: 20, daysSinceMaintenance: 14, utilization: 1 };
  const minValues = { vibration: 1.5, temperature: 150, powerDraw: 50, cycleTime: 20, motorCurrent: 10, daysSinceMaintenance: 0, utilization: 0.7 };

  const normalizedFeatures = [
    ((features.vibration || 2.5) - minValues.vibration) / (maxValues.vibration - minValues.vibration),
    ((features.temperature || 180) - minValues.temperature) / (maxValues.temperature - minValues.temperature),
    ((features.powerDraw || 50) - minValues.powerDraw) / (maxValues.powerDraw - minValues.powerDraw),
    ((features.cycleTime || 30) - minValues.cycleTime) / (maxValues.cycleTime - minValues.cycleTime),
    ((features.motorCurrent || 10) - minValues.motorCurrent) / (maxValues.motorCurrent - minValues.motorCurrent),
    (features.daysSinceMaintenance || 0) / maxValues.daysSinceMaintenance,
    ((features.utilization || 0.8) - minValues.utilization) / (maxValues.utilization - minValues.utilization),
  ];

  // Predict using trained model
  const prediction = predictWithLogisticRegression(normalizedFeatures, trainedFailureModel);
  const riskScore = prediction.probability;

  // Get feature importance
  const featureImportance = getFeatureImportance(trainedFailureModel);
  const topFeatures = featureImportance.slice(0, 5).map(f => ({
    feature: f.feature,
    contribution: f.importance,
  }));

  // Generate 7-day forecast
  const next7Days = [];
  const baseDate = new Date();
  for (let i = 1; i <= 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const futureRisk = Math.min(1, riskScore + ((features.daysSinceMaintenance || 0) / 14 * 0.02 * i));
    next7Days.push({
      date: date.toISOString().split('T')[0],
      risk: Math.round(futureRisk * 100) / 100,
    });
  }

  return {
    machineId,
    riskScore: Math.round(riskScore * 100) / 100,
    next7Days,
    topFeatures,
    explanation: prediction.explanation,
  };
}

/**
 * Fallback prediction when model not trained
 */
function predictFailureRiskFallback(
  machineId: string,
  features: {
    vibration?: number;
    temperature?: number;
    powerDraw?: number;
    cycleTime?: number;
    motorCurrent?: number;
    daysSinceMaintenance?: number;
    utilization?: number;
  }
): FailureRiskPrediction {
  const normalized = {
    vibration: Math.min(1, (features.vibration || 0) / 6),
    temperature: Math.min(1, Math.max(0, ((features.temperature || 180) - 150) / 70)),
    powerDraw: Math.min(1, (features.powerDraw || 50) / 100),
    cycleTime: Math.min(1, Math.max(0, ((features.cycleTime || 30) - 20) / 20)),
    motorCurrent: Math.min(1, (features.motorCurrent || 10) / 20),
    daysSinceMaintenance: Math.min(1, (features.daysSinceMaintenance || 0) / 14),
    utilization: features.utilization || 0.8,
  };

  const weights = { vibration: 0.25, temperature: 0.20, powerDraw: 0.15, cycleTime: 0.10, motorCurrent: 0.15, daysSinceMaintenance: 0.10, utilization: 0.05 };
  let riskScore = 0;
  const contributions: Array<{ feature: string; contribution: number }> = [];

  for (const [feature, value] of Object.entries(normalized)) {
    const contribution = value * weights[feature as keyof typeof weights];
    riskScore += contribution;
    contributions.push({
      feature: feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      contribution: Math.round(contribution * 100) / 100,
    });
  }

  riskScore = 1 / (1 + Math.exp(-5 * (riskScore - 0.5)));

  const next7Days = [];
  const baseDate = new Date();
  for (let i = 1; i <= 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    next7Days.push({
      date: date.toISOString().split('T')[0],
      risk: Math.round(Math.min(1, riskScore + (normalized.daysSinceMaintenance * 0.02 * i)) * 100) / 100,
    });
  }

  contributions.sort((a, b) => b.contribution - a.contribution);
  const topFeature = contributions[0];
  const explanation = `High ${topFeature.feature} is the primary risk factor. Current risk level: ${riskScore < 0.3 ? 'Low' : riskScore < 0.6 ? 'Medium' : 'High'}`;

  return {
    machineId,
    riskScore: Math.round(riskScore * 100) / 100,
    next7Days,
    topFeatures: contributions.slice(0, 5),
    explanation,
  };
}

/**
 * Isolation Forest-like Anomaly Detection
 * Simplified version using statistical methods
 */
export function detectAnomalies(
  machineId: string,
  currentReading: Record<string, number>,
  historicalReadings: Array<Record<string, number>>
): AnomalyDetection {
  if (historicalReadings.length < 10) {
    // Not enough data
    return {
      machineId,
      timestamp: new Date().toISOString(),
      anomalyScore: 0,
      features: currentReading,
      isAnomaly: false,
      explanation: 'Insufficient historical data for anomaly detection',
    };
  }

  // Calculate statistics for each feature
  const featureStats: Record<string, { mean: number; std: number }> = {};
  const features = Object.keys(currentReading);

  for (const feature of features) {
    const values = historicalReadings.map(r => r[feature] || 0).filter(v => !isNaN(v));
    if (values.length > 0) {
      featureStats[feature] = {
        mean: mean(values),
        std: standardDeviation(values) || 0.01,
      };
    }
  }

  // Calculate anomaly score for each feature
  let totalAnomalyScore = 0;
  const featureScores: Record<string, number> = {};

  for (const feature of features) {
    const stats = featureStats[feature];
    if (!stats) continue;

    const currentValue = currentReading[feature] || 0;
    const zScore = Math.abs((currentValue - stats.mean) / (stats.std || 0.01));
    
    // Anomaly score: higher z-score = more anomalous
    // Use exponential decay: score = 1 - exp(-zScore/2)
    const anomalyScore = 1 - Math.exp(-zScore / 2);
    featureScores[feature] = anomalyScore;
    totalAnomalyScore += anomalyScore;
  }

  const avgAnomalyScore = totalAnomalyScore / features.length;
  const isAnomaly = avgAnomalyScore > 0.7; // Threshold

  // Find most anomalous feature
  const sortedFeatures = Object.entries(featureScores).sort((a, b) => b[1] - a[1]);
  const topAnomalousFeature = sortedFeatures[0];
  
  const explanation = isAnomaly
    ? `Anomaly detected: ${topAnomalousFeature[0]} is ${((topAnomalousFeature[1] * 100).toFixed(0))}% outside normal range. ` +
      `Current value: ${currentReading[topAnomalousFeature[0]].toFixed(2)}, ` +
      `Expected range: ${(featureStats[topAnomalousFeature[0]].mean - 2 * featureStats[topAnomalousFeature[0]].std).toFixed(2)} - ${(featureStats[topAnomalousFeature[0]].mean + 2 * featureStats[topAnomalousFeature[0]].std).toFixed(2)}`
    : 'All readings within normal parameters';

  return {
    machineId,
    timestamp: new Date().toISOString(),
    anomalyScore: Math.round(avgAnomalyScore * 100) / 100,
    features: currentReading,
    isAnomaly,
    explanation,
  };
}

/**
 * Feature Importance Calculation
 * Simple correlation-based feature importance
 */
export function calculateFeatureImportance(
  features: string[],
  target: number[],
  featureData: Record<string, number[]>
): Array<{ feature: string; importance: number }> {
  const importances: Array<{ feature: string; importance: number }> = [];

  for (const feature of features) {
    const featureValues = featureData[feature] || [];
    if (featureValues.length !== target.length) continue;

    // Calculate correlation coefficient (simplified)
    const featureMean = mean(featureValues);
    const targetMean = mean(target);
    
    let numerator = 0;
    let featureVariance = 0;
    let targetVariance = 0;

    for (let i = 0; i < featureValues.length; i++) {
      const fDiff = featureValues[i] - featureMean;
      const tDiff = target[i] - targetMean;
      numerator += fDiff * tDiff;
      featureVariance += fDiff * fDiff;
      targetVariance += tDiff * tDiff;
    }

    const correlation = numerator / Math.sqrt(featureVariance * targetVariance || 1);
    const importance = Math.abs(correlation);

    importances.push({ feature, importance: Math.round(importance * 100) / 100 });
  }

  return importances.sort((a, b) => b.importance - a.importance);
}
