
export interface CarDetails {
  brand: string;
  model: string;
  isNew: boolean;
  age: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  power: number;
  torque: number;
}

export interface PredictionResult {
  estimatedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: string;
  factors: string[];
}
