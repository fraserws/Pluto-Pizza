"use client";
import React, { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";
import calculatePizzaPrice from "@/utils/calculatePrice";
import { Pizza } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { useRouter } from "next/navigation";
import OrderPreview from "@/components/PizzaPreview";

const pizzaSizes = [
  { size: "Small", price: 6.99 },
  { size: "Medium", price: 8.99 },
  { size: "Large", price: 11.99 },
];
const pizzaToppings = [
  "Pepperoni",
  "Sausage",
  "Onions",
  "Green Peppers",
  "Mushrooms",
  "Olives",
  "Bacon",
  "Pineapple",
  "Spinach",
  "Ham",
  "Chicken",
  "Beef",
];

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const cart = useCart();
  const [pizza, setPizza] = useState<Pizza | null>(null);

  useEffect(() => {
    const cartItem = cart.items.find((item) => item.id === Number(params.id));
    setPizza(cartItem || null);
  }, [cart, params.id]);

  const handlePizzaChange = (size: string, price: number) => {
    if (pizza) {
      setPizza({
        ...pizza,
        size,
        price: calculatePizzaPrice(size, pizza.toppings),
      });
    }
  };

  const handleToppingToggle = (topping: string) => {
    if (pizza) {
      if (pizza.toppings.includes(topping)) {
        setPizza((prevPizza) => ({
          ...prevPizza!,
          toppings: prevPizza!.toppings.filter(
            (selectedTopping) => selectedTopping !== topping,
          ),
          price: calculatePizzaPrice(
            prevPizza!.size,
            prevPizza!.toppings.filter(
              (selectedTopping) => selectedTopping !== topping,
            ),
          ),
        }));
      } else {
        setPizza((prevPizza) => ({
          ...prevPizza!,
          toppings: [...prevPizza!.toppings, topping],
          price: calculatePizzaPrice(prevPizza!.size, [
            ...prevPizza!.toppings,
            topping,
          ]),
        }));
      }
    }
  };

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (pizza) {
      if (action === "increase") {
        setPizza((prevPizza) => ({
          ...prevPizza!,
          quantity: prevPizza!.quantity + 1,
        }));
      } else if (action === "decrease" && pizza.quantity > 1) {
        setPizza((prevPizza) => ({
          ...prevPizza!,
          quantity: prevPizza!.quantity - 1,
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pizza) {
      const updatedPizza = {
        ...pizza,
        price: calculatePizzaPrice(pizza.size, pizza.toppings),
      };
      cart.updateItem(updatedPizza);

      router.push("/cart");
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 pt-20 md:flex-row md:pl-4">
      {pizza ? (
        <Card className="w-full md:w-[50%]">
          <CardHeader>
            <CardTitle>Edit Pizza</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex w-full flex-col">
              <div className="flex flex-col items-center gap-4 py-10">
                {pizzaSizes.map((pizzaSize) => (
                  <div
                    key={pizzaSize.size}
                    className={`flex w-full items-center rounded-lg border-2 p-6 text-xl shadow-sm ${
                      pizza.size === pizzaSize.size
                        ? "border-2 border-primary"
                        : ""
                    }`}
                    onClick={() =>
                      handlePizzaChange(pizzaSize.size, pizzaSize.price)
                    }
                  >
                    <div className="flex flex-col items-center">
                      <label className="mx-auto flex justify-center text-center text-3xl font-bold">
                        {pizzaSize.size}
                      </label>
                      <div className="text-md">
                        £{pizzaSize.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <label>Select Toppings (multiple allowed):</label>
              <div className="flex flex-wrap">
                {pizzaToppings.map((topping) => (
                  <Toggle
                    key={topping}
                    className="topping-toggle"
                    aria-label={topping}
                    onClick={() => handleToppingToggle(topping)}
                    pressed={pizza.toppings.includes(topping)}
                  >
                    {topping}
                  </Toggle>
                ))}
              </div>
              <label>Price:</label>
              <span>£{(pizza.price * pizza.quantity).toFixed(2)}</span>
              <Button type="submit">Update Pizza</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full md:w-[50%]">
          <h3>Pizza not found with ID: {params.id}</h3>
        </div>
      )}
      <div className="flex w-full items-center justify-center md:w-[50%]">
        {pizza && <OrderPreview size={pizza.size} />}
      </div>
    </div>
  );
}
