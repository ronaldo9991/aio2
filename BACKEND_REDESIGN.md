# Backend Redesign Summary - PETBottle AI Ops

## Overview
Complete backend redesign with ML-powered analytics, CSV processing, and advanced scheduling while preserving the existing UI.

## New Services Created

### 1. ML Models Service (`server/services/mlModels.ts`)
- **Forecasting**: Exponential smoothing for time series prediction
- **Failure Risk Classification**: Logistic regression-like model for machine failure prediction
- **Anomaly Detection**: Isolation Forest-like statistical anomaly detection
- **Feature Importance**: Correlation-based feature importance calculation

### 2. CSV Processor Service (`server/services/csvProcessor.ts`)
- **Auto-detection**: Automatically detects dataset type from column names
- **Schema Mapping**: Maps CSV columns to standardized internal schema
- **Validation**: Validates data types and required columns
- **Data Transformation**: Converts CSV data to standardized format

### 3. Scheduler Service (`server/services/scheduler.ts`)
- **Baseline Scheduler**: FIFO + due date priority scheduling
- **Risk-Aware Scheduler**: ML-optimized scheduling considering:
  - Machine failure risk predictions
  - Setup group minimization
  - Due date adherence
  - Urgent job prioritization
- **KPI Calculation**: Comprehensive metrics (makespan, lateness, utilization, risk cost, stability)

### 4. Data Generator Service (`server/services/dataGenerator.ts`)
- Generates realistic synthetic datasets:
  - Production data (output, throughput, cycle time, downtime)
  - Robotics data (utilization, idle time, pick rate, errors)
  - Maintenance data (failures, actions, downtime, costs)
  - Quality data (defects, reject rates, inspections)
  - Energy data (kWh, peak load, cost, efficiency)
  - Orders data (quantities, due dates, priorities)
  - Sensors data (vibration, temperature, power, pressure)

## New Database Schema

### Datasets Table
- Stores uploaded CSV files with metadata
- Column mappings and sample data
- Tags and descriptions

### ML Models Table
- Model versions and training status
- Metrics (accuracy, precision, recall, F1)
- Feature importance
- Training configuration

### Recommendations Table
- AI-generated recommendations
- Status tracking (pending, accepted, overridden)
- Confidence scores and impact estimates
- Override reasons for audit trail

## New API Endpoints

### CSV Upload & Datasets
- `POST /api/upload-csv` - Upload and process CSV files
- `POST /api/datasets/generate-demo` - Generate demo datasets
- `GET /api/datasets` - List all datasets
- `GET /api/datasets/:id` - Get dataset details
- `GET /api/datasets/:id/preview` - Preview dataset (columns + sample rows)
- `DELETE /api/datasets/:id` - Delete dataset

### ML Models
- `GET /api/models` - List all ML models
- `GET /api/models/:id` - Get model details
- `POST /api/models/train/:modelName` - Train a model
- `POST /api/models/predict/:modelName` - Make predictions

### Recommendations
- `GET /api/recommendations` - Get pending recommendations
- `POST /api/recommendations/accept` - Accept a recommendation
- `POST /api/recommendations/override` - Override a recommendation (requires reason)

### Scheduling
- `POST /api/schedule/baseline` - Generate baseline schedule
- `POST /api/schedule/risk-aware` - Generate risk-aware schedule

### Enhanced Endpoints
- `GET /api/dashboard/stats` - Now includes ML-powered metrics (OEE, bottles/hr, defect rate, energy, cost)
- `GET /api/dashboard/recommendations` - Get AI recommendations for dashboard
- `GET /api/machines` - Now includes ML risk predictions with 7-day forecasts
- `GET /api/schedule/latest` - Uses scheduler service for realistic schedules

## Key Features

### 1. ML-Powered Analytics
- Real-time failure risk predictions for all machines
- 7-day risk forecasts
- Feature importance explanations
- Anomaly detection on sensor readings

### 2. Intelligent Scheduling
- Baseline (FIFO) vs Risk-Aware comparison
- Considers machine failure risk windows
- Minimizes setup changeovers
- Optimizes for due date adherence

### 3. CSV Processing
- Auto-detects dataset type (production, robotics, maintenance, quality, energy, orders, sensors)
- Validates schema and data types
- Maps columns to standardized format
- Provides data quality reports

### 4. AI Recommendations
- Maintenance recommendations based on failure risk
- Schedule optimization suggestions
- Quality improvement recommendations
- Energy optimization insights
- Human-in-the-loop accept/override workflow

### 5. Comprehensive Metrics
- OEE (Overall Equipment Effectiveness)
- Bottles per hour throughput
- Defect rate percentage
- Energy per 1000 bottles
- Cost per bottle
- Machine utilization
- On-time delivery rate
- Average risk score

## Data Flow

1. **CSV Upload** → Auto-detect type → Validate → Map columns → Store dataset
2. **ML Training** → Use dataset → Train model → Store metrics → Activate model
3. **Predictions** → Read sensor data → Run ML models → Generate risk scores
4. **Scheduling** → Get jobs + machines → Calculate risks → Optimize schedule → Return KPIs
5. **Recommendations** → Analyze predictions → Generate recommendations → User accepts/overrides → Log action

## Technical Stack

- **Backend**: Express.js + TypeScript
- **ML Libraries**: simple-statistics, ml-matrix
- **CSV Processing**: csv-parse, csv-stringify
- **File Upload**: multer
- **Storage**: In-memory (Map-based) with full CRUD operations

## Next Steps (Optional Enhancements)

1. Add persistent database (PostgreSQL/SQLite)
2. Implement model versioning and A/B testing
3. Add real-time WebSocket updates for predictions
4. Implement model retraining pipeline
5. Add more sophisticated ML models (neural networks, ensemble methods)
6. Add data export functionality
7. Implement caching for expensive ML computations
8. Add batch prediction endpoints

## Notes

- All ML models are simplified but functional implementations
- Synthetic data is realistic and follows manufacturing patterns
- All endpoints maintain backward compatibility with existing UI
- Error handling and validation included throughout
- Audit logging for all critical actions
