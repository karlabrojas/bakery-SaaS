"use client";

import { usePathname } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/" || pathname.startsWith("/auth");

  return hideSidebar ? (
    <main>{children}</main>
  ) : (
    <AppLayout>{children}</AppLayout>
  );
}
