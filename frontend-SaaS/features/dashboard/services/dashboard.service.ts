import { DashboardResponse } from "../types/dashboard.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class DashboardService {
  private getHeaders() {
    const token = localStorage.getItem("accessToken");

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getDashboard(): Promise<DashboardResponse> {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: this.getHeaders(),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
}

export const dashboardService = new DashboardService();
