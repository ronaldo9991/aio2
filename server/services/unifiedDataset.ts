/**
 * Unified Dataset Generator
 * Creates a single comprehensive dataset with all features for ML training
 */

import { stringify } from 'csv-stringify/sync';

export interface GeneratedDataset {
  filename: string;
  csvContent: string;
  rowCount: number;
  description: string;
}

/**
 * Generate unified dataset with all machine features and failure labels
 * This dataset includes all features needed for logistic regression training
 */
export function generateUnifiedDataset(rowCount: number = 2000): GeneratedDataset {
  const machines = ['M-001', 'M-002', 'M-003', 'M-004', 'M-005', 'M-006', 'M-007', 'M-008', 'M-009', 'M-010'];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - (rowCount - i) / 2); // Every 30 minutes
    
    const machine = machines[Math.floor(Math.random() * machines.length)];
    
    // Generate realistic sensor readings
    const vibration = 1.5 + Math.random() * 4.5; // 1.5-6.0 mm/s
    const temperature = 170 + Math.random() * 50; // 170-220°C
    const powerDraw = 50 + Math.random() * 40; // 50-90 kW
    const airPressure = 6 + Math.random() * 2; // 6-8 bar
    const cycleTime = 28 + Math.random() * 8; // 28-36 seconds
    const motorCurrent = 10 + Math.random() * 10; // 10-20A
    const daysSinceMaintenance = Math.random() * 14; // 0-14 days
    const utilization = 0.7 + Math.random() * 0.25; // 70-95%
    
    // Calculate failure risk based on features (for training labels)
    // Higher vibration, temperature, days since maintenance = higher risk
    const riskScore = 
      (vibration / 6) * 0.25 +
      ((temperature - 150) / 70) * 0.20 +
      (daysSinceMaintenance / 14) * 0.15 +
      (powerDraw / 100) * 0.15 +
      ((cycleTime - 20) / 20) * 0.10 +
      (motorCurrent / 20) * 0.10 +
      (1 - utilization) * 0.05;
    
    // Apply sigmoid to get probability
    const failureProbability = 1 / (1 + Math.exp(-5 * (riskScore - 0.5)));
    
    // Generate binary label (failure occurred in next 72 hours)
    // Higher probability = more likely to fail
    const failureOccurred = Math.random() < failureProbability ? 1 : 0;
    
    // If failure occurred, add some quality issues
    const defectCount = failureOccurred ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 3);
    const rejectRate = failureOccurred ? 0.05 + Math.random() * 0.15 : Math.random() * 0.05;
    
    // Production metrics
    const output = 5000 + Math.floor(Math.random() * 2000);
    const throughput = output / (8 + Math.random() * 2);
    const downtime = failureOccurred ? 60 + Math.floor(Math.random() * 240) : (Math.random() < 0.1 ? Math.floor(Math.random() * 30) : 0);
    
    // Energy metrics
    const kwh = 60 + Math.random() * 40;
    const efficiency = 0.75 + Math.random() * 0.15;

    records.push({
      timestamp: timestamp.toISOString(),
      machine_id: machine,
      vibration: Math.round(vibration * 10) / 10,
      temperature: Math.round(temperature),
      power_draw: Math.round(powerDraw * 10) / 10,
      air_pressure: Math.round(airPressure * 10) / 10,
      cycle_time: Math.round(cycleTime * 10) / 10,
      motor_current: Math.round(motorCurrent * 10) / 10,
      days_since_maintenance: Math.round(daysSinceMaintenance * 10) / 10,
      utilization: Math.round(utilization * 100) / 100,
      output: output,
      throughput: Math.round(throughput),
      downtime_min: downtime,
      defect_count: defectCount,
      reject_rate: Math.round(rejectRate * 1000) / 1000,
      kwh: Math.round(kwh * 10) / 10,
      efficiency: Math.round(efficiency * 100) / 100,
      failure_occurred: failureOccurred, // Binary label for logistic regression
      failure_risk_score: Math.round(failureProbability * 1000) / 1000,
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    filename: 'unified_machine_data.csv',
    csvContent,
    rowCount,
    description: 'Comprehensive unified dataset with machine sensors, production metrics, quality data, energy consumption, and failure labels for ML training',
  };
}
