"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <div className="container flex flex-col justify-center items-center">
      <h1>Home Page</h1>
      <Link href="/auth/login"><Button>Login</Button></Link>
    </div>
  );
}
