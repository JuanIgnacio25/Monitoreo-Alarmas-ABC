"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="w-2/3 text-center md:text-left">
      {/* Solo el título entra animado */}
      <motion.h1
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-bold mb-4"
      >
        Protegé tu hogar o negocio las 24 hs
      </motion.h1>

      {/* Subtítulo sin animación */}
      <p className="text-lg md:text-xl mb-6">
        Servicio profesional de monitoreo de alarmas con respuesta inmediata.
      </p>

      {/* Botones sin animación */}
      <div className="flex flex-col sm:flex-row gap-3 justify-start">
        <Button size="lg" variant="main" asChild>
          <Link href="/#contacto">Monitorear mi alarma</Link>
        </Button>
        <Button size="lg" variant="main" asChild>
          <Link href="/#servicios">Nuestros Servicios</Link>
        </Button>
      </div>
    </div>
  );
}
