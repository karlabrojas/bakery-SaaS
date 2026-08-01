"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { SalesChartItem } from "../types/dashboard.type";

interface Props {
  data: SalesChartItem[];
}

export default function SalesChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#B8926B] shadow-md p-6">
      <h2 className="font-bold text-lg text-[#472D20] mb-5">
        Ventas últimos 7 días
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-[#8C6D53] italic py-16 text-center">
          No hay datos de ventas registrados para los últimos días.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAD9B6" />
            <XAxis dataKey="date" stroke="#5A2E1F" tick={{ fill: "#5A2E1F" }} />
            <YAxis stroke="#5A2E1F" tick={{ fill: "#5A2E1F" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF8E0",
                borderColor: "#B8926B",
                borderRadius: "0.5rem",
                color: "#472D20",
                fontWeight: "bold",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#472D20"
              strokeWidth={3}
              dot={{ fill: "#B8926B", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#472D20" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
