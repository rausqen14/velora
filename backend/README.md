# Car Price Prediction Backend

Python Flask backend for real-time car price prediction using XGBoost model.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "features_count": 67
}
```

### 2. Predict Price
```
POST /predict
Content-Type: application/json
```

Request Body:
```json
{
  "brand": "Toyota",
  "model": "Camry",
  "isNew": false,
  "age": 5,
  "mileage": 50000,
  "fuelType": "Gasoline",
  "transmission": "A",
  "power": 200,
  "torque": 250
}
```

Response:
```json
{
  "predicted_price": 25000.50,
  "min_price": 22500.45,
  "max_price": 27500.55,
  "confidence": "high",
  "currency": "USD"
}
```

### 3. Model Info
```
GET /model-info
```

Returns model metadata and supported brands/models.

## Model Details

- **Algorithm**: XGBoost
- **Features**: 67 total (numeric + one-hot encoded)
- **Performance**: R² = 0.9388, MAPE = 8.94%
- **Price Range**: $4,000 - $129,535
- **Currency**: USD

## Preprocessing

1. **Mileage**: Log transformed
2. **Model Name**: Target encoded (958 models)
3. **Brand**: One-hot encoded (67 brands)
4. **Fuel Type**: One-hot encoded
5. **Transmission**: One-hot encoded
6. **Price**: Log transformed (inverse applied in prediction)

