import { OrderStatus } from "@/features/orders/types/order.type";

export interface DashboardSummary {
  todaySales: number;

  monthlySales: number;

  pendingOrders: number;

  totalProducts: number;
}

export interface SalesChartItem {
  date: string;

  total: number;
}

export interface RecentOrder {
  id: string;

  folio: string;

  customer: {
    id: string;
    name: string;
  } | null;

  total: number;

  status: OrderStatus;

  deliveryDate: string;

  deliveryTime: string;
}

export interface InventoryAlert {
  id: number;

  name: string;

  quantity: number;

  minimumStock: number;

  unit: string;
}

export interface TodayDelivery {
  id: string;

  orderId: string;

  recipientName: string;

  address: string;

  estimatedDelivery: string;

  status: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;

  salesChart: SalesChartItem[];

  recentOrders: RecentOrder[];

  lowStock: InventoryAlert[];

  todayDeliveries: TodayDelivery[];
}
