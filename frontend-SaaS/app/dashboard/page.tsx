"use client";

import { DollarSign, ShoppingBag, ClipboardList, Package } from "lucide-react";

import DashboardHeader from "../../features/dashboard/components/DashboarHeader";
import SummaryCard from "../../features/dashboard/components/SummaryCard";
import SalesChart from "../../features/dashboard/components/SalesChart";
import RecentOrdersTable from "../../features/dashboard/components/RecentOrdersTable";
import LowStockCard from "../../features/dashboard/components/LowSatockCard";
import TodayDeliveries from "../../features/dashboard/components/TodayDeliveries";
import QuickActions from "../../features/dashboard/components/QuickActions";

import { useDashboard } from "../../features/dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const { dashboard, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <QuickActions />

      {/* Tarjetas */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard
          title="Ventas de hoy"
          value={`$${dashboard.summary.todaySales.toLocaleString()}`}
          icon={<DollarSign size={30} />}
        />

        <SummaryCard
          title="Ventas del mes"
          value={`$${dashboard.summary.monthlySales.toLocaleString()}`}
          icon={<ShoppingBag size={30} />}
        />

        <SummaryCard
          title="Pedidos pendientes"
          value={dashboard.summary.pendingOrders}
          icon={<ClipboardList size={30} />}
        />

        <SummaryCard
          title="Productos"
          value={dashboard.summary.totalProducts}
          icon={<Package size={30} />}
        />
      </div>

      {/* Gráfica */}

      <SalesChart data={dashboard.salesChart} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentOrdersTable orders={dashboard.recentOrders} />
        </div>

        <div className="space-y-6">
          <LowStockCard items={dashboard.lowStock} />

          <TodayDeliveries deliveries={dashboard.todayDeliveries} />
        </div>
      </div>
    </div>
  );
}
