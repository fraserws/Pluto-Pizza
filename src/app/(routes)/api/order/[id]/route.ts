import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs";

const prisma = new PrismaClient();
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = parseInt(params.id);

  if (isNaN(id) || id <= 0) {
    return new Response("Invalid ID", { status: 400 });
  }

  try {
    // Fetch the order by its ID
    const order = await prisma.order.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!order) {
      return new Response("Order not found", { status: 404 });
    }

    const pizzas = await prisma.pizza.findMany({
      where: {
        orderId: id,
      },
    });

    return NextResponse.json({ order, pizzas });
  } catch (error) {
    console.error("Error fetching order:", error);
    return new Response("Error fetching order", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
