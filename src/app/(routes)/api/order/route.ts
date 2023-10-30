import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { Pizza } from "@/types";

const prisma = new PrismaClient();

interface OrderData {
  userId: string;
  items: Pizza[];
  address: string;
  notes?: string;
  totalPrice: number;
}

function calculateOrderTotal(items: Pizza[]): number {
  return items.reduce((total, pizza) => {
    return total + pizza.price * pizza.quantity;
  }, 0);
}

export async function POST(request: Request) {
  const user = await currentUser();
  const orderNumber = Math.floor(Math.random() * 1000000).toString();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const formData: OrderData = (await request.json()) as OrderData;

    const total = calculateOrderTotal(formData.items);

    const orderData: OrderData = {
      userId: user.id,
      items: formData.items,
      address: formData.address,
      notes: formData.notes,
      totalPrice: total,
    };

    const validatedPrice = calculateOrderTotal(orderData.items);

    const order = await prisma.order.create({
      data: {
        userId: orderData.userId,
        orderNumber: orderNumber,
        totalPrice: validatedPrice,
        notes: orderData.notes,
        address: orderData.address,
        pizzas: {
          create: orderData.items.map((pizzaData) => ({
            size: pizzaData.size,
            toppings: pizzaData.toppings.join(", "),
            price: pizzaData.price,
            quantity: pizzaData.quantity,
          })),
        },
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({ order: order });
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response("Error creating order", { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!orders) {
      return new Response("Order not found", { status: 404 });
    }
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response("Error fetching orders", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
