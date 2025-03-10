// src/components/ui/input.tsx
 import { InputHTMLAttributes } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Add any custom props here if needed
};

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`border p-2 rounded-lg focus:ring focus:ring-blue-300 outline-none transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;