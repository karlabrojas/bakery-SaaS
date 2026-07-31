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
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="text-gray-500 mt-1">{bakeryName ?? "Mi Panadería"}</p>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-500">{today}</p>
      </div>
    </div>
  );
}
