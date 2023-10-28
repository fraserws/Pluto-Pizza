"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useCart from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      removeAll();
    }

    if (searchParams.get("canceled")) {
      // Handle canceled order
    }
  }, [searchParams, removeAll]);

  // Calculate the total price
  const totalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const onCheckout = async () => {
    // Perform checkout logic here
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="text-base font-medium text-gray-900">{item.size} Pizza</div>
            <div className="text-base font-medium text-gray-900">
              £{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <div className="text-base font-medium text-gray-900">
            £{totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
      <form>
        {/* Other form fields go here */}
      </form>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="mt-6 w-full"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
