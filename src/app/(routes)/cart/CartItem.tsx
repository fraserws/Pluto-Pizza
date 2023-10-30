import useCart from "@/hooks/useCart";
import { Pizza } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CartItemProps {
  data: Pizza;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.id.toString());
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          {data.quantity}x {data.size} Pizza
        </CardTitle>
        <CardDescription>
          Toppings: {data?.toppings?.join(", ")}
        </CardDescription>
      </CardHeader>
      <h1></h1>

      <CardContent>
        <p> £{data.price?.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/purchase/${data.id}?`}>
          <Button variant="secondary" className="mr-2">
            Edit
          </Button>
        </Link>
        <Button variant="destructive" onClick={onRemove}>
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartItem;
