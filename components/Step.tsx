
import React from 'react';

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="mb-6 text-6xl font-thin text-gray-300 transition-colors duration-300 group-hover:text-blue-500">
        {number}
      </div>
      <h3 className="mb-3 text-xl font-light text-gray-900 tracking-tight">{title}</h3>
      <p className="text-gray-500 font-light leading-relaxed">{description}</p>
    </div>
  );
};

export default Step;
