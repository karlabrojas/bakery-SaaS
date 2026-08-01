import { DashboardSummary } from "./dashboard.interface";
import { InventoryAlert } from "./inventory-alert.interface";
import { RecentOrder } from "./recent-order.interface";
import { SalesChartItem } from "./sales-chart.interface";
import { TodayDelivery } from "./today-delivery.interface";

export interface DashboardResponse {
  summary: DashboardSummary;

  salesChart: SalesChartItem[];

  recentOrders: RecentOrder[];

  lowStock: InventoryAlert[];

  todayDeliveries: TodayDelivery[];
}
