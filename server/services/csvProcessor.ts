/**
 * CSV Processing Service
 * Handles CSV upload, validation, auto-detection, and schema mapping
 */

import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export type DatasetType = 
  | 'production' 
  | 'robotics' 
  | 'maintenance' 
  | 'quality' 
  | 'energy' 
  | 'inventory' 
  | 'orders' 
  | 'sensors' 
  | 'unknown';

export interface ColumnMapping {
  originalName: string;
  standardName: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
}

export interface DatasetSchema {
  type: DatasetType;
  columns: ColumnMapping[];
  rowCount: number;
  sampleRows: any[];
  errors: string[];
  warnings: string[];
}

// Standard column names for each dataset type
const STANDARD_SCHEMAS: Record<DatasetType, string[]> = {
  production: ['timestamp', 'line_id', 'output', 'throughput', 'cycle_time', 'downtime_min'],
  robotics: ['timestamp', 'robot_id', 'utilization', 'idle_time', 'pick_rate', 'error_count'],
  maintenance: ['timestamp', 'machine_id', 'failure_type', 'maintenance_action', 'downtime_min', 'cost'],
  quality: ['timestamp', 'machine_id', 'defect_type', 'defect_count', 'reject_rate', 'inspection_count'],
  energy: ['timestamp', 'line_id', 'kwh', 'peak_load', 'cost', 'efficiency'],
  inventory: ['timestamp', 'material_id', 'quantity', 'location', 'supplier'],
  orders: ['order_id', 'product_size', 'quantity', 'due_date', 'priority', 'processing_time_min', 'required_machine_type'],
  sensors: ['timestamp', 'machine_id', 'vibration', 'temperature', 'power_draw', 'air_pressure', 'cycle_time'],
  unknown: [],
};

// Column synonyms for auto-detection
const COLUMN_SYNONYMS: Record<string, string[]> = {
  timestamp: ['timestamp', 'ts', 'date', 'time', 'datetime', 'created_at', 'recorded_at'],
  machine_id: ['machine_id', 'machine', 'machine_name', 'asset_id', 'equipment_id'],
  robot_id: ['robot_id', 'robot', 'robot_name', 'automation_id'],
  line_id: ['line_id', 'line', 'production_line', 'line_name'],
  output: ['output', 'production', 'bottles_produced', 'units', 'quantity_produced'],
  throughput: ['throughput', 'bottles_per_hour', 'units_per_hour', 'production_rate'],
  cycle_time: ['cycle_time', 'cycle_time_sec', 'cycle_time_min', 'processing_time'],
  downtime_min: ['downtime_min', 'downtime', 'downtime_seconds', 'downtime_hours'],
  utilization: ['utilization', 'utilization_percent', 'uptime', 'availability'],
  defect_type: ['defect_type', 'defect', 'defect_name', 'quality_issue'],
  defect_count: ['defect_count', 'defects', 'reject_count', 'rejects'],
  reject_rate: ['reject_rate', 'rejection_rate', 'defect_rate', 'quality_rate'],
  kwh: ['kwh', 'energy', 'power_consumption', 'energy_kwh', 'power_kwh'],
  vibration: ['vibration', 'vib', 'vibration_mm_s', 'vibration_level'],
  temperature: ['temperature', 'temp', 'temp_c', 'temperature_c'],
  power_draw: ['power_draw', 'power', 'current', 'motor_current'],
  due_date: ['due_date', 'deadline', 'delivery_date', 'target_date'],
  priority: ['priority', 'urgent', 'priority_level', 'importance'],
  quantity: ['quantity', 'qty', 'amount', 'volume', 'order_quantity'],
  product_size: ['product_size', 'size', 'bottle_size', 'volume_ml'],
};

/**
 * Auto-detect dataset type based on column names
 */
export function detectDatasetType(columns: string[]): DatasetType {
  const columnLower = columns.map(c => c.toLowerCase().trim());
  
  // Score each dataset type
  const scores: Record<DatasetType, number> = {
    production: 0,
    robotics: 0,
    maintenance: 0,
    quality: 0,
    energy: 0,
    inventory: 0,
    orders: 0,
    sensors: 0,
    unknown: 0,
  };

  for (const col of columnLower) {
    // Check for timestamp (common to all)
    if (COLUMN_SYNONYMS.timestamp.some(s => col.includes(s))) {
      Object.keys(scores).forEach(k => scores[k as DatasetType]++);
    }

    // Production indicators
    if (COLUMN_SYNONYMS.output.some(s => col.includes(s)) || 
        COLUMN_SYNONYMS.throughput.some(s => col.includes(s))) {
      scores.production += 2;
    }

    // Robotics indicators
    if (COLUMN_SYNONYMS.robot_id.some(s => col.includes(s)) ||
        COLUMN_SYNONYMS.utilization.some(s => col.includes(s))) {
      scores.robotics += 2;
    }

    // Maintenance indicators
    if (col.includes('failure') || col.includes('maintenance') || col.includes('repair')) {
      scores.maintenance += 2;
    }

    // Quality indicators
    if (COLUMN_SYNONYMS.defect_type.some(s => col.includes(s)) ||
        COLUMN_SYNONYMS.reject_rate.some(s => col.includes(s))) {
      scores.quality += 2;
    }

    // Energy indicators
    if (COLUMN_SYNONYMS.kwh.some(s => col.includes(s)) || col.includes('energy') || col.includes('power')) {
      scores.energy += 2;
    }

    // Orders indicators
    if (COLUMN_SYNONYMS.due_date.some(s => col.includes(s)) ||
        COLUMN_SYNONYMS.product_size.some(s => col.includes(s))) {
      scores.orders += 2;
    }

    // Sensors indicators
    if (COLUMN_SYNONYMS.vibration.some(s => col.includes(s)) ||
        COLUMN_SYNONYMS.temperature.some(s => col.includes(s))) {
      scores.sensors += 2;
    }
  }

  // Find type with highest score
  let maxScore = 0;
  let detectedType: DatasetType = 'unknown';
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore && type !== 'unknown') {
      maxScore = score;
      detectedType = type as DatasetType;
    }
  }

  return maxScore > 0 ? detectedType : 'unknown';
}

/**
 * Map columns to standard schema
 */
export function mapColumnsToSchema(
  originalColumns: string[],
  datasetType: DatasetType
): ColumnMapping[] {
  const standardColumns = STANDARD_SCHEMAS[datasetType] || [];
  const mappings: ColumnMapping[] = [];

  for (const originalCol of originalColumns) {
    const colLower = originalCol.toLowerCase().trim();
    let mapped = false;

    // Try to find matching standard column
    for (const standardCol of standardColumns) {
      const synonyms = COLUMN_SYNONYMS[standardCol] || [standardCol];
      if (synonyms.some(s => colLower.includes(s) || s.includes(colLower))) {
        mappings.push({
          originalName: originalCol,
          standardName: standardCol,
          dataType: inferDataType(originalCol),
          required: ['timestamp', 'machine_id', 'robot_id', 'line_id'].includes(standardCol),
        });
        mapped = true;
        break;
      }
    }

    // If no match, keep original name
    if (!mapped) {
      mappings.push({
        originalName: originalCol,
        standardName: originalCol,
        dataType: inferDataType(originalCol),
        required: false,
      });
    }
  }

  return mappings;
}

/**
 * Infer data type from column name and sample values
 */
function inferDataType(columnName: string, sampleValues?: any[]): 'string' | 'number' | 'date' | 'boolean' {
  const colLower = columnName.toLowerCase();
  
  // Date indicators
  if (colLower.includes('date') || colLower.includes('time') || colLower.includes('timestamp')) {
    return 'date';
  }

  // Boolean indicators
  if (colLower.includes('is_') || colLower.includes('has_') || colLower.includes('flag')) {
    return 'boolean';
  }

  // Number indicators
  if (colLower.includes('count') || colLower.includes('rate') || colLower.includes('percent') ||
      colLower.includes('min') || colLower.includes('max') || colLower.includes('avg') ||
      colLower.includes('quantity') || colLower.includes('amount') || colLower.includes('cost')) {
    return 'number';
  }

  // Check sample values if provided
  if (sampleValues && sampleValues.length > 0) {
    const firstValue = sampleValues[0];
    if (typeof firstValue === 'number') return 'number';
    if (typeof firstValue === 'boolean') return 'boolean';
    if (firstValue instanceof Date || (typeof firstValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(firstValue))) {
      return 'date';
    }
  }

  return 'string';
}

/**
 * Parse and validate CSV file
 */
export function processCSV(
  csvContent: string,
  datasetType?: DatasetType
): DatasetSchema {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      errors.push('CSV file is empty or has no data rows');
      return {
        type: 'unknown',
        columns: [],
        rowCount: 0,
        sampleRows: [],
        errors,
        warnings,
      };
    }

    // Get columns from first record
    const originalColumns = Object.keys(records[0]);

    // Auto-detect type if not provided
    const detectedType = datasetType || detectDatasetType(originalColumns);
    if (!datasetType) {
      warnings.push(`Auto-detected dataset type: ${detectedType}`);
    }

    // Map columns to standard schema
    const columnMappings = mapColumnsToSchema(originalColumns, detectedType);

    // Validate required columns
    const requiredMappings = columnMappings.filter(m => m.required);
    for (const mapping of requiredMappings) {
      const hasData = records.some(r => r[mapping.originalName] != null && r[mapping.originalName] !== '');
      if (!hasData) {
        errors.push(`Required column "${mapping.originalName}" has no data`);
      }
    }

    // Sample rows (first 50)
    const sampleRows = records.slice(0, 50);

    // Data type validation
    for (const mapping of columnMappings) {
      const sampleValues = sampleRows.map(r => r[mapping.originalName]).filter(v => v != null);
      if (sampleValues.length > 0) {
        const inferredType = inferDataType(mapping.originalName, sampleValues);
        if (mapping.dataType !== inferredType && mapping.dataType !== 'string') {
          warnings.push(`Column "${mapping.originalName}" may have incorrect data type. Expected ${mapping.dataType}, inferred ${inferredType}`);
        }
      }
    }

    return {
      type: detectedType,
      columns: columnMappings,
      rowCount: records.length,
      sampleRows,
      errors,
      warnings,
    };
  } catch (error: any) {
    errors.push(`Failed to parse CSV: ${error.message}`);
    return {
      type: 'unknown',
      columns: [],
      rowCount: 0,
      sampleRows: [],
      errors,
      warnings,
    };
  }
}

/**
 * Convert records to standard format
 */
export function transformToStandardFormat(
  records: any[],
  columnMappings: ColumnMapping[]
): any[] {
  return records.map(record => {
    const transformed: any = {};
    for (const mapping of columnMappings) {
      const value = record[mapping.originalName];
      transformed[mapping.standardName] = transformValue(value, mapping.dataType);
    }
    return transformed;
  });
}

function transformValue(value: any, dataType: 'string' | 'number' | 'date' | 'boolean'): any {
  if (value == null || value === '') return null;

  switch (dataType) {
    case 'number':
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    case 'date':
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date.toISOString();
    case 'boolean':
      if (typeof value === 'boolean') return value;
      const str = String(value).toLowerCase();
      return str === 'true' || str === '1' || str === 'yes';
    default:
      return String(value);
  }
}

/**
 * Export dataset to CSV
 */
export function exportToCSV(records: any[], columns: string[]): string {
  return stringify(records, {
    header: true,
    columns,
  });
}
