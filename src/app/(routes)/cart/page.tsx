"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useCart from "@/hooks/useCart";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Cart() {
  const cart = useCart();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold text-primary">
        Cart
      </h1>
      <Button className="mt-4">
        <Link href="/order">Order Now</Link>
      </Button>
      <div>
        <h2>Cart</h2>
        <ul>
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }} // Define the exit animation
                transition={{ type: "spring", stiffness: 900, damping: 40 }}
              >
                {item.quantity} {item.size} {item.toppings.join(", ")} - £{" "}
                {item.price.toFixed(2)}
                <Button
                  onClick={() => {
                    cart.removeItem(item.id.toString());
                  }}
                >
                  <XIcon />
                </Button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </main>
  );
}
