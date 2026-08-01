import { SaleService } from "../../sales/services/saleService";
import { ProductService } from "../../products/services/productService";
import { OrderService } from "../../orders/services/orderService";
import { InventoryService } from "../../inventory/services/inventoryService";
import { DeliveryService } from "../../orders/services/deliveryService";
import { DashboardResponse } from "../interfaces/dashboard-response.interface";

export class DashboardService {
  static async getDashboard(bakeryId: string): Promise<DashboardResponse> {
    const [
      todaySales,

      monthlySales,

      pendingOrders,

      totalProducts,

      salesChart,

      recentOrders,

      lowStock,

      todayDeliveries,
    ] = await Promise.all([
      SaleService.getTodaySales(bakeryId),

      SaleService.getMonthlySales(bakeryId),

      OrderService.countPendingOrders(bakeryId),

      ProductService.countProducts(bakeryId),

      SaleService.getLast7DaysSales(bakeryId),

      OrderService.getRecentOrders(bakeryId),

      InventoryService.getLowStockProducts(bakeryId),

      DeliveryService.getTodayDeliveries(bakeryId),
    ]);

    return {
      summary: {
        todaySales,

        monthlySales,

        pendingOrders,

        totalProducts,
      },

      salesChart,

      recentOrders,

      lowStock,

      todayDeliveries,
    };
  }
}
