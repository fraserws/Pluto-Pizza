import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import calculatePizzaPrice from "@/utils/calculatePrice";
const prisma = new PrismaClient();
import { currentUser } from '@clerk/nextjs';

type PizzaData = {
  size: string;
  toppings: string[];
  price: string;
};

type OrderData = {
  userId: string;
  pizzas: PizzaData[];
  totalPrice: number; 
};

function generateOrderNumber() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${randomSuffix}`;
}

function calculateTotalPrice(pizzas: PizzaData[]) {
  return pizzas.reduce((total, pizza) => {
    return (
      Math.round(
        (total + calculatePizzaPrice(pizza.size, pizza.toppings)) * 100,
      ) / 100
    );
  }, 0);
}

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }


  try {
    const mockPizzaData: PizzaData[] = [
      {
        size: "Medium",
        toppings: ["pepperoni", "mushrooms"],
        price: "12.99",
      },
      {
        size: "Large",
        toppings: ["sausage", "onions", "green peppers"],
        price: "16.99",
      },
    ];

    const orderData: OrderData = {
      userId : user.id,
      pizzas: mockPizzaData,
      totalPrice: calculateTotalPrice(mockPizzaData),
    };

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        userId: orderData.userId,
        totalPrice: orderData.totalPrice,
        orderNumber: orderNumber,
        address: "123 Main St",
      },
    });

    const pizzas = await Promise.all(
      orderData.pizzas.map(async (pizzaData) => {
        const pizza = await prisma.pizza.create({
          data: {
            size: pizzaData.size,
            toppings: pizzaData.toppings.join(","),
            price: parseFloat(pizzaData.price),
            orderId: order.id,
            quantity: 1,
          },
        });
        return pizza;
      }),
    );

    await prisma.$disconnect();

    return NextResponse.json({ order, pizzas });
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response("Error creating order", { status: 500 });
  }
}
