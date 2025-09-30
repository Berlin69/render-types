import React from "react";
import type {Metadata} from "next"
import "./globals.css"
import {ThemeProvider} from "@/components/theme/theme-provider"
import {Toaster} from "@/components/ui/sonner"
import {Navbar} from "@/components/navbar"
import {NavbarSheet} from "@/components/navbar-sheet";

export const metadata: Metadata = {
  title: "Next Test | shadcn",
  description: "Тестовое задание: рендеринг, модалка, POST, API",
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
    <body>
    <ThemeProvider>
      <div className="min-h-dvh flex bg-plt-grey">
        <Navbar/>
        <main className="flex-1 m-5 ml-0 bg-background rounded-xl p-5 shadow max-[900px]:m-2">
          <NavbarSheet/>
          {children}
        </main>
      </div>
      <Toaster richColors closeButton/>
    </ThemeProvider>
    </body>
    </html>
  )
}