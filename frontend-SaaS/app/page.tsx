import LandingPage from "@/features/landing/components/LandingPage";
import SeccionInfo from "@/features/landing/components/SeccionInfo";

export default function Home() {
  return (
    <main className="bg-[#F5E6D3] min-h-screen">
      <LandingPage />
      <SeccionInfo/>
    </main>
  );
}