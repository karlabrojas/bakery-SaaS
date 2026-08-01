"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import { DashboardResponse } from "../types/dashboard.type";

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const data = await dashboardService.getDashboard();

      setDashboard(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    dashboard,
    loading,
    error,
    reload: loadDashboard,
  };
}
