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
    <div className=" flex  flex-col justify-center h-16 gap-12 border-b">
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
          <h3 className="text-xl font-bold text-primary">Pluto's Pizza</h3>
        </Link>
        <Link
          href="/order"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Order
        </Link>
        <Link
          href="/account"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Account
          
        </Link>
        <CartButton />
      </nav>
    </div>
  );
}
