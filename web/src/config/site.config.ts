export const siteConfig = {
  url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3001',
  name: "Monitoreo Alarmas ABC",
  description: "Un sitio web increíble construido con Next.js y Shadcn UI.",
  ogImage: "https://tu-increible-sitio.com/og.png",
  keywords: ["nextjs", "react", "shadcn ui", "web development"],
  author: {
    name: "Juan Ignacio Colli",
    url: "https://juanignaciocolli.netlify.app/",
  },
  links: {
    twitter: "https://twitter.com/tunick",
    github: "https://github.com/tu-usuario/tu-repo",
  },
  mainNav: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Servicios",
      href: "/#servicios",
    },
    {
      label: "Beneficios",
      href: "/#beneficios",
    },
    {
      label: "Contacto",
      href: "/#contacto",
    },
  ],
  footerNav: [
    {
      label: "Términos y Condiciones",
      href: "/terms",
    },
    {
      label: "Política de Privacidad",
      href: "/privacy",
    },
  ],
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
};
