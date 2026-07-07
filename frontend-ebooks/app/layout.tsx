import type { Metadata } from "next";
import "./globals.css"; // <-- ¡Aquí es donde ocurre la magia del CSS!

export const metadata: Metadata = {
  title: "MyEbooks",
  description: "El archivo de tus lecturas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}