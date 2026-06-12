import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Convite Digital | Convites Interativos para seu Evento",
  description:
    "Crie convites digitais lindos e interativos para aniversarios, casamentos, cha de bebe e mais. Compartilhe por WhatsApp com confirmacao de presenca.",
  keywords: [
    "convite digital",
    "convite online",
    "convite whatsapp",
    "convite aniversario",
    "convite casamento",
    "convite cha de bebe",
    "rsvp online",
  ],
  openGraph: {
    title: "Convite Digital | Convites Interativos",
    description: "Crie convites digitais lindos para qualquer evento!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-poppins)]">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
