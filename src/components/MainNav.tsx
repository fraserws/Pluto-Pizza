import Link from "next/link";

import { cn } from "@/lib/utils";
import { currentUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import CartButton from "./CartButton";

export async function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const user = await currentUser();
  return (
    <div className=" flex  h-16 flex-col justify-center gap-12 border-b">
      <nav
        className={cn(
          "flex items-center space-x-4 px-3 lg:space-x-6 ",
          className,
        )}
        {...props}
      >
        {user ? (
          <UserButton />
        ) : (
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        )}
        <Link href="/">
          <h3 className="text-xl font-bold text-primary">Plutos Pizza</h3>
        </Link>
        <Link
          href="/purchase"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Order
        </Link>
        <Link
          href="/orders"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          History
        </Link>
        <CartButton />
      </nav>
    </div>
  );
}
