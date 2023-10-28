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
import OrderPreview from "@/components/PizzaPreview";
import PizzaPreview from "@/components/PizzaPreview";

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
    quantity: 1, // Initialize quantity to 1
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
    // Check if the topping is already selected, and toggle its selection.
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
    // Handle order submission if needed.
  };

const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newQuantity = parseInt(event.target.value, 10);
  if (!isNaN(newQuantity) && newQuantity >= 1) {
    setPizza((prevPizza) => ({
      ...prevPizza,
      quantity: newQuantity,
    }));
  }
};
const addPizzaToCart = () => {
  const pizzaToAdd = {
    ...pizza,
    quantity: pizza.quantity, // Use the selected quantity
  };
  cart.addItem(pizzaToAdd);
  setPizza({
    id: Math.floor(Math.random() * 1000000),
    size: "Small",
    toppings: [],
    price: 6.99,
    quantity: 1,
  });
};

  return (
    <div className="flex h-full flex-col gap-4 pl-4 pt-20 md:flex-row">
      <Card className="w-full md:w-[50%]">
        <CardHeader>
          <CardTitle>Customize Pizza</CardTitle>
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
            <label>Quantity:</label>
            <input
              type="number"
              value={pizza.quantity}
              onChange={handleQuantityChange}
              min="1"
            />
            <label>Price:</label>
            <span> £{(pizza.price * pizza.quantity).toFixed(2)}</span>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={addPizzaToCart}>
            Add Pizza to Cart
          </Button>
          <Button
            type="button"
            onClick={() => {
              addPizzaToCart();
              router.push("/cart");
            }}
          >
            Add Pizza to Cart and Checkout
          </Button>
        </CardFooter>
      </Card>
      <div className="flex w-full items-center justify-center md:w-[50%]">
        <PizzaPreview size={pizza.size} />
      </div>
    </div>
  );
};

export default OrderPage;
