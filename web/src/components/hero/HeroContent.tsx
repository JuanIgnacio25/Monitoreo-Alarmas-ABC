"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { HeroProps } from "./Hero";

type HeroContentProps = Pick<HeroProps, "title" | "subtitle" | "ctas">;

export default function HeroContent({
  title,
  subtitle,
  ctas,
}: HeroContentProps) {
  return (
    <div className="w-2/3 text-center md:text-left">
      {/* Solo el título entra animado */}
      <motion.h1
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-bold mb-4"
      >
        {title}
      </motion.h1>

      {/* Subtítulo sin animación */}
      <p className="text-lg md:text-xl mb-6">{subtitle}</p>

      {/* Botones sin animación */}
      <div className="flex flex-col sm:flex-row gap-3 justify-start">
        {ctas.map((cta, index) => {
          return (
            <Button
              key={index}
              size="lg"
              variant={index == 0 ? "primaryBlue" : "main"}
              asChild
            >
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
