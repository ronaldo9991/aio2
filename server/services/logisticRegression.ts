/**
 * Logistic Regression Implementation
 * Proper gradient descent-based logistic regression for binary classification
 */

export interface TrainingData {
  features: number[][]; // Each row is a feature vector
  labels: number[];     // Binary labels (0 or 1)
}

export interface TrainedModel {
  weights: number[];
  bias: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  featureNames: string[];
}

/**
 * Sigmoid function
 */
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z)))); // Clamp to prevent overflow
}

/**
 * Predict probability using logistic regression
 */
function predictProbability(features: number[], weights: number[], bias: number): number {
  let z = bias;
  for (let i = 0; i < features.length; i++) {
    z += features[i] * weights[i];
  }
  return sigmoid(z);
}

/**
 * Train logistic regression using gradient descent
 */
export function trainLogisticRegression(
  data: TrainingData,
  learningRate: number = 0.01,
  iterations: number = 1000,
  featureNames: string[] = []
): TrainedModel {
  const numFeatures = data.features[0].length;
  const numSamples = data.features.length;

  // Initialize weights and bias
  let weights = new Array(numFeatures).fill(0);
  let bias = 0;

  // Gradient descent
  for (let iter = 0; iter < iterations; iter++) {
    let dw = new Array(numFeatures).fill(0);
    let db = 0;

    // Calculate gradients
    for (let i = 0; i < numSamples; i++) {
      const prediction = predictProbability(data.features[i], weights, bias);
      const error = prediction - data.labels[i];

      for (let j = 0; j < numFeatures; j++) {
        dw[j] += error * data.features[i][j];
      }
      db += error;
    }

    // Update weights and bias
    for (let j = 0; j < numFeatures; j++) {
      weights[j] -= (learningRate / numSamples) * dw[j];
    }
    bias -= (learningRate / numSamples) * db;
  }

  // Calculate metrics
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let trueNegatives = 0;

  for (let i = 0; i < numSamples; i++) {
    const prediction = predictProbability(data.features[i], weights, bias);
    const predictedLabel = prediction >= 0.5 ? 1 : 0;
    const actualLabel = data.labels[i];

    if (predictedLabel === 1 && actualLabel === 1) truePositives++;
    else if (predictedLabel === 1 && actualLabel === 0) falsePositives++;
    else if (predictedLabel === 0 && actualLabel === 1) falseNegatives++;
    else trueNegatives++;
  }

  const accuracy = (truePositives + trueNegatives) / numSamples;
  const precision = truePositives + falsePositives > 0 
    ? truePositives / (truePositives + falsePositives) 
    : 0;
  const recall = truePositives + falseNegatives > 0
    ? truePositives / (truePositives + falseNegatives)
    : 0;
  const f1 = precision + recall > 0
    ? (2 * precision * recall) / (precision + recall)
    : 0;

  return {
    weights,
    bias,
    accuracy,
    precision,
    recall,
    f1,
    featureNames: featureNames.length > 0 ? featureNames : data.features[0].map((_, i) => `feature_${i}`),
  };
}

/**
 * Predict using trained model
 */
export function predictWithLogisticRegression(
  features: number[],
  model: TrainedModel
): { probability: number; prediction: number; explanation: string } {
  const probability = predictProbability(features, model.weights, model.bias);
  const prediction = probability >= 0.5 ? 1 : 0;

  // Calculate feature contributions
  const contributions = features.map((value, i) => ({
    feature: model.featureNames[i] || `feature_${i}`,
    weight: model.weights[i],
    value,
    contribution: value * model.weights[i],
  }));

  // Sort by absolute contribution
  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const topFeatures = contributions.slice(0, 5);
  const explanation = `Prediction: ${prediction === 1 ? 'HIGH RISK' : 'LOW RISK'} (${(probability * 100).toFixed(1)}% probability). ` +
    `Top contributing factors: ${topFeatures.map(f => `${f.feature} (${f.contribution > 0 ? '+' : ''}${f.contribution.toFixed(3)})`).join(', ')}`;

  return {
    probability,
    prediction,
    explanation,
  };
}

/**
 * Calculate feature importance from trained model
 */
export function getFeatureImportance(model: TrainedModel): Array<{ feature: string; importance: number }> {
  const importances = model.weights.map((weight, i) => ({
    feature: model.featureNames[i] || `feature_${i}`,
    importance: Math.abs(weight),
  }));

  // Normalize to 0-1 scale
  const maxImportance = Math.max(...importances.map(i => i.importance));
  if (maxImportance > 0) {
    importances.forEach(imp => {
      imp.importance = imp.importance / maxImportance;
    });
  }

  return importances.sort((a, b) => b.importance - a.importance);
}
