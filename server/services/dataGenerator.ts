/**
 * Synthetic Data Generator
 * Generates realistic demo datasets for PETBottle AI Ops
 */

import { stringify } from 'csv-stringify/sync';
import type { DatasetType } from './csvProcessor';

export interface GeneratedDataset {
  type: DatasetType;
  filename: string;
  csvContent: string;
  rowCount: number;
  description: string;
}

/**
 * Generate production dataset
 */
export function generateProductionData(rowCount: number = 500): GeneratedDataset {
  const lines = ['Line A', 'Line B', 'Line C'];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - (rowCount - i));
    
    const line = lines[Math.floor(Math.random() * lines.length)];
    const output = 5000 + Math.floor(Math.random() * 2000); // 5000-7000 bottles
    const throughput = output / (8 + Math.random() * 2); // bottles per hour
    const cycleTime = 25 + Math.random() * 10; // 25-35 seconds
    const downtime = Math.random() < 0.1 ? Math.floor(Math.random() * 60) : 0; // 10% chance of downtime

    records.push({
      timestamp: timestamp.toISOString(),
      line_id: line,
      output,
      throughput: Math.round(throughput),
      cycle_time: Math.round(cycleTime * 10) / 10,
      downtime_min: downtime,
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    type: 'production',
    filename: 'production_demo.csv',
    csvContent,
    rowCount,
    description: 'Production output, throughput, cycle time, and downtime by production line',
  };
}

/**
 * Generate robotics dataset
 */
export function generateRoboticsData(rowCount: number = 300): GeneratedDataset {
  const robots = ['Robot-001', 'Robot-002', 'Robot-003', 'Robot-004', 'Robot-005'];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - (rowCount - i) / 2);
    
    const robot = robots[Math.floor(Math.random() * robots.length)];
    const utilization = 0.7 + Math.random() * 0.25; // 70-95%
    const idleTime = (1 - utilization) * 480; // minutes in 8-hour shift
    const pickRate = 120 + Math.random() * 40; // picks per hour
    const errorCount = Math.random() < 0.15 ? Math.floor(Math.random() * 3) : 0; // 15% chance of errors

    records.push({
      timestamp: timestamp.toISOString(),
      robot_id: robot,
      utilization: Math.round(utilization * 100) / 100,
      idle_time: Math.round(idleTime),
      pick_rate: Math.round(pickRate),
      error_count: errorCount,
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    type: 'robotics',
    filename: 'robotics_demo.csv',
    csvContent,
    rowCount,
    description: 'Robot utilization, idle time, pick rate, and error counts',
  };
}

/**
 * Generate maintenance dataset
 */
export function generateMaintenanceData(rowCount: number = 200): GeneratedDataset {
  const machines = ['M-001', 'M-002', 'M-003', 'M-004', 'M-005', 'M-006'];
  const failureTypes = ['Bearing Failure', 'Motor Overheat', 'Sensor Malfunction', 'Hydraulic Leak', 'Electrical Fault'];
  const actions = ['Replaced Bearing', 'Cleaned Motor', 'Calibrated Sensor', 'Fixed Leak', 'Replaced Component', 'Preventive Maintenance'];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
    
    const machine = machines[Math.floor(Math.random() * machines.length)];
    const isFailure = Math.random() < 0.3; // 30% failures, 70% maintenance
    const failureType = isFailure ? failureTypes[Math.floor(Math.random() * failureTypes.length)] : null;
    const action = actions[Math.floor(Math.random() * actions.length)];
    const downtime = isFailure ? 60 + Math.floor(Math.random() * 240) : 30 + Math.floor(Math.random() * 90);
    const cost = isFailure ? 500 + Math.random() * 2000 : 100 + Math.random() * 400;

    records.push({
      timestamp: timestamp.toISOString(),
      machine_id: machine,
      failure_type: failureType,
      maintenance_action: action,
      downtime_min: downtime,
      cost: Math.round(cost),
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    type: 'maintenance',
    filename: 'maintenance_demo.csv',
    csvContent,
    rowCount,
    description: 'Machine failures, maintenance actions, downtime, and costs',
  };
}

/**
 * Generate quality dataset
 */
export function generateQualityData(rowCount: number = 400): GeneratedDataset {
  const machines = ['M-001', 'M-002', 'M-003', 'M-004'];
  const defectTypes = ['thin_wall', 'thick_wall', 'neck_deformity', 'weight_variance', null];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - (rowCount - i) / 4);
    
    const machine = machines[Math.floor(Math.random() * machines.length)];
    const hasDefect = Math.random() < 0.15; // 15% defect rate
    const defectType = hasDefect ? defectTypes[Math.floor(Math.random() * (defectTypes.length - 1))] : null;
    const defectCount = hasDefect ? Math.floor(Math.random() * 10) + 1 : 0;
    const inspectionCount = 50 + Math.floor(Math.random() * 50);
    const rejectRate = defectCount / inspectionCount;

    records.push({
      timestamp: timestamp.toISOString(),
      machine_id: machine,
      defect_type: defectType,
      defect_count: defectCount,
      reject_rate: Math.round(rejectRate * 1000) / 1000,
      inspection_count: inspectionCount,
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    type: 'quality',
    filename: 'quality_demo.csv',
    csvContent,
    rowCount,
    description: 'Defect types, counts, reject rates, and inspection counts by machine',
  };
}

/**
 * Generate energy dataset
 */
export function generateEnergyData(rowCount: number = 350): GeneratedDataset {
  const lines = ['Line A', 'Line B', 'Line C'];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - (rowCount - i) / 2);
    
    const line = lines[Math.floor(Math.random() * lines.length)];
    const hour = timestamp.getHours();
    const isPeak = hour >= 8 && hour <= 18;
    const kwh = isPeak ? 80 + Math.random() * 40 : 40 + Math.random() * 20;
    const peakLoad = isPeak ? kwh * 1.2 : kwh * 0.8;
    const cost = kwh * 0.12; // $0.12 per kWh
    const efficiency = 0.75 + Math.random() * 0.15; // 75-90%

    records.push({
      timestamp: timestamp.toISOString(),
      line_id: line,
      kwh: Math.round(kwh * 10) / 10,
      peak_load: Math.round(peakLoad * 10) / 10,
      cost: Math.round(cost * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    type: 'energy',
    filename: 'energy_demo.csv',
    csvContent,
    rowCount,
    description: 'Energy consumption (kWh), peak load, cost, and efficiency by production line',
  };
}

/**
 * Generate orders dataset
 */
export function generateOrdersData(rowCount: number = 100): GeneratedDataset {
  const productSizes = ['250ml', '500ml', '750ml', '1L', '2L'];
  const machineTypes = ['blow_mold', 'injection', 'preform'];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const orderId = `ORD-${String(i + 1).padStart(4, '0')}`;
    const productSize = productSizes[Math.floor(Math.random() * productSizes.length)];
    const quantity = 1000 + Math.floor(Math.random() * 9000);
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-15 days from now
    const priority = Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1;
    const processingTime = quantity * (0.03 + Math.random() * 0.02); // minutes
    const machineType = machineTypes[Math.floor(Math.random() * machineTypes.length)];
    const isUrgent = Math.random() < 0.1;

    records.push({
      order_id: orderId,
      product_size: productSize,
      quantity,
      due_date: dueDate.toISOString().split('T')[0],
      priority,
      processing_time_min: Math.round(processingTime),
      required_machine_type: machineType,
      is_urgent: isUrgent,
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    type: 'orders',
    filename: 'orders_demo.csv',
    csvContent,
    rowCount,
    description: 'Production orders with quantities, due dates, priorities, and processing requirements',
  };
}

/**
 * Generate sensors dataset
 */
export function generateSensorsData(rowCount: number = 1000): GeneratedDataset {
  const machines = ['M-001', 'M-002', 'M-003', 'M-004', 'M-005', 'M-006'];
  const records: any[] = [];
  const now = new Date();

  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(now);
    timestamp.setMinutes(timestamp.getMinutes() - (rowCount - i) * 5); // Every 5 minutes
    
    const machine = machines[Math.floor(Math.random() * machines.length)];
    const vibration = 1.5 + Math.random() * 4; // 1.5-5.5 mm/s
    const temperature = 170 + Math.random() * 50; // 170-220°C
    const powerDraw = 50 + Math.random() * 40; // 50-90 kW
    const airPressure = 6 + Math.random() * 2; // 6-8 bar
    const cycleTime = 28 + Math.random() * 8; // 28-36 seconds

    records.push({
      timestamp: timestamp.toISOString(),
      machine_id: machine,
      vibration: Math.round(vibration * 10) / 10,
      temperature: Math.round(temperature),
      power_draw: Math.round(powerDraw * 10) / 10,
      air_pressure: Math.round(airPressure * 10) / 10,
      cycle_time: Math.round(cycleTime * 10) / 10,
    });
  }

  const csvContent = stringify(records, { header: true });
  return {
    type: 'sensors',
    filename: 'sensors_demo.csv',
    csvContent,
    rowCount,
    description: 'Sensor readings: vibration, temperature, power draw, air pressure, cycle time',
  };
}

/**
 * Generate unified dataset (single comprehensive dataset)
 * Re-exported from unifiedDataset.ts
 */
export { generateUnifiedDataset, type GeneratedDataset } from './unifiedDataset';

/**
 * Generate all demo datasets (legacy - kept for backward compatibility)
 */
export function generateAllDemoData(): GeneratedDataset[] {
  // Return only unified dataset
  return [generateUnifiedDataset(2000)];
}
