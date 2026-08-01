interface DashboardHeaderProps {
  bakeryName?: string;
}

export default function DashboardHeader({ bakeryName }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#EAD9B6]">
      <div>
        <h1 className="text-3xl font-extrabold text-[#472D20]">Dashboard</h1>
        <p className="text-[#5A2E1F] font-medium mt-1">
          {bakeryName ?? "Mi Panadería"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-[#8C6D53] capitalize">
          {today}
        </p>
      </div>
    </div>
  );
}
