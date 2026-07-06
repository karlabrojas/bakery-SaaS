import LandingPage from "@/features/landing/components/LandingPage";
import SeccionInfo from "@/features/landing/components/SeccionInfo";
import SalesPage from "./sales/page";
import Login from "./auth/page";

export default function Home() {
  return (
    <main className="bg-[#F5E6D3] min-h-screen">
      <Login />
      {/* <SalesPage /> */}
    </main>
  );
}
