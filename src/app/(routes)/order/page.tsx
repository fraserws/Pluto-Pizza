"use client";
import React, { useState, useCallback, useEffect } from "react";
import useCart from "@/hooks/useCart";
import calculatePizzaPrice from "@/utils/calculatePrice";
import { useRouter } from "next/navigation";
import { Pizza } from "@/types";
import { Button } from "@/components/ui/button";

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
        toppings: prevPizza.toppings.filter((selectedTopping) => selectedTopping !== topping),
        price: calculatePizzaPrice(prevPizza.size, prevPizza.toppings.filter((selectedTopping) => selectedTopping !== topping)),
      }));
    } else {
      setPizza((prevPizza) => ({
        ...prevPizza,
        toppings: [...prevPizza.toppings, topping],
        price: calculatePizzaPrice(prevPizza.size, [...prevPizza.toppings, topping]),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle order submission if needed.
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
    <div>
      <div>
        {pizzaSizes.map((pizzaSize) => (
          <div
            key={pizzaSize.size}
            onClick={() => handlePizzaChange(pizzaSize.size, pizzaSize.price)}
          >
            {pizzaSize.size}
          </div>
        ))}
      </div>
      <div>
        {pizzaToppings.map((topping) => (
          <div onClick={() => handleToppingToggle(topping)}>
            {topping}
          </div>
        ))}
      </div>
      <div>£{pizza.price.toFixed(2)}</div>
      <Button onClick={addPizzaToCart}>Add Pizza to Cart</Button>
      <Button onClick={() => {
        addPizzaToCart();
        router.push("/cart");
      }}>Add Pizza to Cart and Checkout</Button>
    </div>
  );
};

export default OrderPage;
