"use client";
import React, { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Order, Pizza } from "@/types";

interface Response {
  order: Order[];
  pizzas: Pizza[];
}
export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Response | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/order`);
        if (response.ok) {
          const result: Response = await response.json();
          setData(result);
        } else {
          console.error(
            "Error fetching data:",
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [params.id]);

  return (
    <div className="flex h-screen w-screen flex-col items-center gap-4 pt-10">
      <h1 className="text-center text-6xl font-bold">Orders</h1>
      {data ? (
        <div className="border-1 flex flex-col items-center justify-center gap-4">
          {data.order.map((order: Order, index: number) => (
            <div key={index}>
              <h2 className="text-center text-5xl font-bold">
                Order #{order.orderNumber}
              </h2>
              <p>Ordered at: {order.createdAt.toString()}</p>
              <p>Status: {order.status}</p>
              <p>Total: £{order.totalPrice}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </div>
  );
}
