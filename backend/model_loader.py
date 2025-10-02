import json
import pickle
import numpy as np
import xgboost as xgb
from typing import Dict, Any

class CarPricePredictor:
    def __init__(self, model_path: str, artifacts_path: str):
        """Initialize the predictor with model and preprocessing artifacts."""
        print("Loading model and artifacts...")
        
        # Load preprocessing artifacts
        with open(artifacts_path, 'rb') as f:
            self.artifacts = pickle.load(f)
        
        # Load XGBoost model from JSON
        self.model = xgb.Booster()
        self.model.load_model(model_path)
        
        # Extract artifact components
        self.feature_columns = self.artifacts['feature_columns']
        self.log_inputs = self.artifacts['log_inputs']
        self.was_price_logged = self.artifacts['was_price_logged']
        self.ohe_cols = self.artifacts['ohe_cols']
        self.ohe_drop_first = self.artifacts['ohe_drop_first']
        self.te_mapping = self.artifacts['te_mapping']
        self.te_global_mean = self.artifacts['te_global_mean']
        
        print(f"Model loaded successfully!")
        print(f"Features: {len(self.feature_columns)}")
        print(f"Log transform applied: {self.was_price_logged}")
    
    def preprocess_input(self, input_data: Dict[str, Any]) -> np.ndarray:
        """
        Preprocess input data according to training pipeline.
        
        Expected input_data keys:
        - brand: str (make_name)
        - model: str (model_name)
        - isNew: bool
        - age: int
        - mileage: float
        - fuelType: str
        - transmission: str
        - power: float
        - torque: float
        """
        
        # Initialize feature dict
        features = {}
        
        # 1. Numeric features
        features['is_new'] = 1 if input_data.get('isNew', False) else 0
        features['age'] = float(input_data.get('age', 0))
        features['power'] = float(input_data.get('power', 150))
        features['torque'] = float(input_data.get('torque', 200))
        
        # 2. Log transform mileage
        mileage = float(input_data.get('mileage', 1))
        if mileage <= 0:
            mileage = 1  # Avoid log(0)
        features['mileage'] = np.log(mileage)
        
        print(f"[DEBUG] Input: brand={input_data.get('brand')}, model={input_data.get('model')}, isNew={input_data.get('isNew')}, age={input_data.get('age')}, km={mileage}")
        print(f"[DEBUG] Features: is_new={features['is_new']}, age={features['age']}, log(mileage)={features['mileage']:.2f}")
        
        # 3. Target encoding for model_name
        model_name = input_data.get('model', '')
        if model_name in self.te_mapping:
            features['model_name_te'] = self.te_mapping[model_name]
        else:
            # Use global mean for unknown models
            features['model_name_te'] = self.te_global_mean
        
        # 4. One-hot encoding for fuel_type
        # Map Turkish labels to English values if needed
        fuel_map = {
            'Benzin': 'Gasoline',
            'Dizel': 'Diesel',
            'Hibrit': 'Hybrid',
            'Flex Fuel (Çoklu Yakıt)': 'Flex Fuel Vehicle',
            'CNG (Doğalgaz)': 'Compressed Natural Gas',
            'Biyodizel': 'Biodiesel'
        }
        fuel_type_raw = input_data.get('fuelType', 'Gasoline')
        fuel_type = fuel_map.get(fuel_type_raw, fuel_type_raw)  # Use mapping or original value
        fuel_categories = ['Compressed Natural Gas', 'Diesel', 'Flex Fuel Vehicle', 'Gasoline', 'Hybrid']
        
        print(f"[DEBUG] Fuel Type: {fuel_type_raw} -> {fuel_type}")
        
        if self.ohe_drop_first:
            # Drop first category (implicit)
            for cat in fuel_categories:
                features[f'fuel_type_{cat}'] = 1 if fuel_type == cat else 0
        else:
            for cat in fuel_categories:
                features[f'fuel_type_{cat}'] = 1 if fuel_type == cat else 0
        
        # 5. One-hot encoding for transmission
        # Map Turkish labels to English values if needed
        trans_label_map = {
            'Otomatik': 'A',
            'Manuel': 'M',
            'CVT (Sürekli Değişken)': 'CVT',
            'Çift Kavramalı (DSG)': 'Dual Clutch'
        }
        transmission_raw = input_data.get('transmission', 'A')
        transmission_code = trans_label_map.get(transmission_raw, transmission_raw)
        
        # Map frontend values to model values
        trans_map = {
            'A': 'Dual Clutch',  # Auto -> Dual Clutch
            'M': 'M',  # Manual -> M
            'CVT': 'CVT',
            'Dual Clutch': 'Dual Clutch'
        }
        transmission_value = trans_map.get(transmission_code, 'Dual Clutch')
        
        print(f"[DEBUG] Transmission: {transmission_raw} -> {transmission_code} -> {transmission_value}")
        
        transmission_categories = ['CVT', 'Dual Clutch', 'M']
        if self.ohe_drop_first:
            for cat in transmission_categories:
                features[f'transmission_{cat}'] = 1 if transmission_value == cat else 0
        else:
            for cat in transmission_categories:
                features[f'transmission_{cat}'] = 1 if transmission_value == cat else 0
        
        # 6. One-hot encoding for make_name (brand)
        brand = input_data.get('brand', 'Toyota')
        # Get all make_name features from feature_columns
        make_features = [col for col in self.feature_columns if col.startswith('make_name_')]
        
        for make_col in make_features:
            make_name = make_col.replace('make_name_', '')
            features[make_col] = 1 if brand == make_name else 0
        
        # 7. Build feature vector in correct order
        feature_vector = []
        for col in self.feature_columns:
            if col in features:
                feature_vector.append(features[col])
            else:
                # Missing feature (shouldn't happen if preprocessing is correct)
                feature_vector.append(0)
        
        return np.array(feature_vector).reshape(1, -1)
    
    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make prediction and return result.
        
        Returns:
        - predicted_price: float (in USD)
        - confidence: str
        - min_price: float
        - max_price: float
        """
        
        # Preprocess input
        X = self.preprocess_input(input_data)
        
        # Convert to DMatrix for XGBoost
        dmatrix = xgb.DMatrix(X, feature_names=self.feature_columns)
        
        # Make prediction (log-transformed)
        log_price = self.model.predict(dmatrix)[0]
        
        # Inverse log transform
        if self.was_price_logged:
            predicted_price = np.exp(log_price)
        else:
            predicted_price = log_price
        
        # Calculate confidence interval (±10% based on MAPE ~8.94%)
        margin = predicted_price * 0.10
        min_price = predicted_price - margin
        max_price = predicted_price + margin
        
        # Determine confidence level based on features
        confidence = "high"
        if input_data.get('model', '') not in self.te_mapping:
            confidence = "medium"
        
        return {
            "predicted_price": float(predicted_price),
            "min_price": float(min_price),
            "max_price": float(max_price),
            "confidence": confidence,
            "currency": "USD"
        }

# Test function
if __name__ == "__main__":
    predictor = CarPricePredictor(
        model_path="../veri_seti/car_price_model_gpu61.json",
        artifacts_path="../veri_seti/car_price_preproc_artifacts.pkl"
    )
    
    # Test prediction
    test_input = {
        "brand": "Toyota",
        "model": "Camry",
        "isNew": False,
        "age": 5,
        "mileage": 50000,
        "fuelType": "Gasoline",
        "transmission": "A",
        "power": 200,
        "torque": 250
    }
    
    result = predictor.predict(test_input)
    print(f"\nTest Prediction:")
    print(f"Price: ${result['predicted_price']:,.2f}")
    print(f"Range: ${result['min_price']:,.2f} - ${result['max_price']:,.2f}")
    print(f"Confidence: {result['confidence']}")

