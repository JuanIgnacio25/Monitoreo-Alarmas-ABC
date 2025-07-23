"use client";

import { motion } from "framer-motion";

const words = [
  { text: "ALERTA", delay: 0.8 , style:"text-2xl font-medium leading-none"},
  { text: "SEGURIDAD", delay: 1 , style:"text-3xl font-semibold "},
  { text: "TRANQUILIDAD", delay: 1.2 , style:"text-3xl font-extrabold "},
];

export default function HeroWords() {
  return (
    <div className="absolute right-0 top-2/4 -translate-y-2/4 rounded-l-md py-6 px-8 gap-3.5 bg-black/30 text-end text-white flex flex-col">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: word.delay }}
          className={word.style}
        >
          {word.text}
        </motion.span>
      ))}
    </div>
  );
}