import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vigilante CONAHCYT",
  description: "Vigilante no-oficial que monitorea la lista de becarios CONAHCYT publicada por el Consulado de México en La Habana.",
  keywords: ["CONAHCYT", "CONACYT", "becarios", "monitoreo", "Cuba", "Consulado México", "Havana", "La Habana", "becas", "visa", "estudiantes", " Mexico", "vigilante", "alerta", "notificaciones"],
  authors: [{ name: "José Ernesto Carreño Bueno", email: "jec.bueno.dev@gmail.com" }],
  contact: {
    email: "jec.bueno.dev@gmail.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
      <footer className="text-center text-sm text-slate-500 py-4">
        ¿Tienes dudas o sugerencias? <a href="mailto:jec.bueno.dev@gmail.com" className="text-blue-600 hover:underline">Contacta al desarrollador</a>
      </footer>
    </body>
    </html>
  );
}
