import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1
        className="text-center text-4xl font-bold
      text-primary"
      >
        Welcome to Plutos Pizza!
      </h1>
      <Button className="mt-4">
        <Link href="/purchase">Order Now</Link>
      </Button>
    </main>
  );
}
