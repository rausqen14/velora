from flask import Flask, request, jsonify
from flask_cors import CORS
from model_loader import CarPricePredictor
import os

app = Flask(__name__)

# CORS configuration - allow Vercel and localhost
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://*.vercel.app",
            "https://your-app-name.vercel.app"  # Replace with your actual Vercel URL
        ]
    }
})

# Initialize predictor - use paths that work both locally and on Render
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'veri_seti', 'car_price_model_gpu61.json')
ARTIFACTS_PATH = os.path.join(BASE_DIR, '..', 'veri_seti', 'car_price_preproc_artifacts.pkl')

print("Initializing Car Price Predictor...")
predictor = CarPricePredictor(MODEL_PATH, ARTIFACTS_PATH)
print("Predictor ready!")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "features_count": len(predictor.feature_columns)
    })

@app.route('/predict', methods=['POST'])
def predict_price():
    """
    Predict car price endpoint.
    
    Expected JSON body:
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
    """
    try:
        # Get input data
        input_data = request.get_json()
        
        # Validate required fields
        required_fields = ['brand', 'model', 'age', 'mileage', 'fuelType', 'transmission', 'power', 'torque']
        missing_fields = [field for field in required_fields if field not in input_data]
        
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Make prediction
        result = predictor.predict(input_data)
        
        # Add input data to response for reference
        result['input'] = input_data
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "type": type(e).__name__
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information."""
    return jsonify({
        "features_count": len(predictor.feature_columns),
        "features": predictor.feature_columns,
        "supported_brands": sorted([col.replace('make_name_', '') for col in predictor.feature_columns if col.startswith('make_name_')]),
        "supported_models_count": len(predictor.te_mapping),
        "log_transformed": predictor.was_price_logged,
        "te_global_mean": predictor.te_global_mean
    })

if __name__ == '__main__':
    # Run on port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

