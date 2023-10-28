import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1
        className="text-4xl font-bold
      text-primary"
      >
        Welcome to Pluto's Pizza!
      </h1>
      <p className="text-xl">
        <Link href="/menu">View our menu</Link>
      </p>
    </main>
  );
}
