"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import useCart from "@/hooks/useCart";

const CartButton = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  const totalQuantity = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <ShoppingBag size={20} color="white" />
        {totalQuantity > 0 && (
          <span className="ml-2 text-sm font-medium text-white">
            {totalQuantity}
          </span>
        )}
      </Button>
    </div>
  );
};

export default CartButton;
