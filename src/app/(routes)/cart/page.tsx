"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useCart from "@/hooks/useCart";

export default function Cart() {
  const cart = useCart();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1
        className="text-center text-4xl font-bold
        text-primary"
      >
        Cart
      </h1>
      <Button className="mt-4">
        <Link href="/order">Order Now</Link>
      </Button>
      <div>
        <h2>Cart</h2>
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.quantity} {item.size} {item.toppings.join(", ")} - £{" "}
              {item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
