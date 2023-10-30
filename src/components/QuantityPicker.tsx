import React from "react";

interface QuantityControlProps {
  quantity: number;
  updateQuantity: (newQuantity: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  updateQuantity,
}) => {
  return (
    <div className="quantity-control">
      <button onClick={() => updateQuantity(quantity - 1)}>-</button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value, 10);
          updateQuantity(newQuantity);
        }}
      />
      <button onClick={() => updateQuantity(quantity + 1)}>+</button>
    </div>
  );
};

export default QuantityControl;
