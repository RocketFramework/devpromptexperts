"use client";
import { Providers } from "@/components/Providers"; 

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
