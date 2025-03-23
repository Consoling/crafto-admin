"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-4">
          <Image 
          fill
          alt='logo'
          src='/favicon.ico'
          />
        </div>
        <h1 className={cn('text-2xl font-bold text-white', font.className)}>
             DZ Group
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link
        href={isSignedIn?'/onboarding' : '/sign-in'}
        >
            <Button variant='outline' className="rounded-full cursor-pointer">Get Started</Button>
        </Link>

      </div>
    </nav>
  );
};