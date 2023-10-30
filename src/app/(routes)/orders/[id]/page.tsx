"use client";
import React, { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Pizza, Order } from "@/types";

interface Response {
  order: Order;
  pizzas: Pizza[];
}

export default function Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Response | null>(null);
  const searchParams = useSearchParams();
  const creationStatus = searchParams.get("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/order/${params.id}`);

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
    };
    fetchData();
  }, [params.id]);

  return (
    <div className="flex h-[80vh] w-screen flex-col items-center justify-center gap-4 pt-10">
      {creationStatus === "true" && (
        <>
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-center text-6xl font-bold">
              Thank you for your order!
            </h1>
            <h2 className="text-center text-5xl font-bold">
              Your order is being processed.
            </h2>
          </div>
        </>
      )}

      {data ? (
        <div className="border-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-6xl font-bold">#ORD{params.id}</h1>
          <h2 className="text-3xl">Status: {data.order.status}</h2>

          <h3 className="text-2xl">Total: £{data.order.totalPrice}</h3>
          <p className="text-xl">Driver ID {data.order.driverId}</p>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}
    </div>
  );
}
