"use client";


import TypewriterComponent from "typewriter-effect";

import Link from "next/link";
import { Button } from "../ui/button";

export const LandingHero = () => {
  
  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The Template Management Tool</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypewriterComponent
            options={{
              strings: [
                "Template Management",
                "Real-time Analytics",
                "Real-time Tracking",
                "Intuitive Interface",
                "Dynamic Reporting"
                
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Manage your App's Templates 10x faster⚡.
      </div>
      <div>
        <Link href={"/sign-in"}>
          <Button
            variant="premium"
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            Start Managing
          </Button>
        </Link>
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
      "Manage templates 10x faster—get started now!"
      </div>
    </div>
  );
};