"use client";
import React, { useState, useCallback, useEffect } from "react";
import useCart from "@/hooks/useCart";
import calculatePizzaPrice from "@/utils/calculatePrice";
import { useRouter } from "next/navigation";
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

const OrderPage = () => {
  const router = useRouter();
  const [pizza, setPizza] = useState<Pizza>({
    id: Math.floor(Math.random() * 1000000),
    size: "Small",
    toppings: [],
    price: 6.99,
    quantity: 1,
  });
  const cart = useCart();

  const handlePizzaChange = useCallback((size: string, price: number) => {
    setPizza((prevPizza) => ({
      ...prevPizza,
      size,
      price: calculatePizzaPrice(size, prevPizza.toppings),
    }));
  }, []);

  useEffect(() => {
    console.log("cart", cart.items);
  }, [cart]);

  const handleToppingToggle = (topping: string) => {
    if (pizza.toppings.includes(topping)) {
      setPizza((prevPizza) => ({
        ...prevPizza,
        toppings: prevPizza.toppings.filter(
          (selectedTopping) => selectedTopping !== topping,
        ),
        price: calculatePizzaPrice(
          prevPizza.size,
          prevPizza.toppings.filter(
            (selectedTopping) => selectedTopping !== topping,
          ),
        ),
      }));
    } else {
      setPizza((prevPizza) => ({
        ...prevPizza,
        toppings: [...prevPizza.toppings, topping],
        price: calculatePizzaPrice(prevPizza.size, [
          ...prevPizza.toppings,
          topping,
        ]),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const addPizzaToCart = () => {
    cart.addItem(pizza);
    setPizza({
      id: Math.floor(Math.random() * 1000000),
      size: "Small",
      toppings: [],
      price: 6.99,
      quantity: 1,
    });
  };

  return (
    <div className="flex h-full flex-col gap-4 px-4 pt-20 md:flex-row">
      <Card className="w-full md:w-[50%]">
        <CardHeader>
          <CardTitle>Customise Pizza</CardTitle>
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
                    <div className="text-md">£{pizzaSize.price.toFixed(2)}</div>
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
            <span> £{pizza.price.toFixed(2)}</span>
          </form>
        </CardContent>
        <CardFooter className="flex w-full flex-col items-center gap-2">
          <Button className="w-full" type="button" onClick={addPizzaToCart}>
            Add to Cart
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => {
              addPizzaToCart();
              router.push("/cart");
            }}
          >
            Add To Cart & Checkout
          </Button>
        </CardFooter>
      </Card>
      <div className="flex w-full items-center justify-center md:w-[50%]"></div>
    </div>
  );
};

export default OrderPage;
