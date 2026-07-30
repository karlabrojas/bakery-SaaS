"use client";

import { usePathname } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { ProfileProvider } from "@/features/profile/context/ProfileContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/" || pathname.startsWith("/auth");

  return (
    <ProfileProvider>
      {hideSidebar ? (
        <main>{children}</main>
      ) : (
        <AppLayout>{children}</AppLayout>
      )}
    </ProfileProvider>
  );
}
