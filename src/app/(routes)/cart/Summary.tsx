import React, { useState } from "react";
import { useRouter} from "next/navigation";
import useCart from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Pizza, Order } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Response {
  order: Order;
  pizzas: Pizza[];
}

const Summary = () => {
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const router = useRouter();
  const cart = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const totalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    setIsLoading(true);

    if (!address) {
      toast.error("Address is required");
      setIsLoading(false);
      return;
    }

    const orderData = {
      items: items,
      total: totalPrice,
      address: address,
      notes: notes,
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data: Response = (await response.json()) as Response;
        cart.removeAll();
        router.push(`/orders/${data.order.id}?success=true`);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <form className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <div className="mt-6 space-y-4">
          {items.map((item: Pizza) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="text-base font-medium text-gray-900">
                {item.size} Pizza
              </div>
              <div className="text-base font-medium text-gray-900">
                £{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-base font-medium text-gray-900">Order total</div>
            <div className="text-base font-medium text-gray-900">
              £{totalPrice.toFixed(2)}
            </div>
          </div>
          <Input
            placeholder="Address"
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Textarea
            placeholder="Notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="mt-6 flex justify-center">
            <Loader2Icon className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Button
            disabled={items.length === 0}
            className="mt-6 w-full"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        )}
      </form>
    </div>
  );
};

export default Summary;
