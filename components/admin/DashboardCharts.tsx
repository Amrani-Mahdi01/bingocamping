"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDZD } from "@/lib/format";
import { cn } from "@/lib/utils";

const tickStyle = {
  fill: "#5b574b",
  fontSize: 11,
  fontFamily: "var(--font-mono)",
} as const;

function dayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-DZ", {
    day: "2-digit",
    month: "short",
  });
}

export function RevenueAreaChart({
  data,
  className,
}: {
  data: Array<{ date: string; revenue: number }>;
  className?: string;
}) {
  const formatted = React.useMemo(
    () => data.map((d) => ({ ...d, label: dayLabel(d.date) })),
    [data]
  );
  return (
    <div className={cn("h-72 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formatted}
          margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#215728" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#215728" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#d9d0bd" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" stroke="#5b574b" tick={tickStyle as never} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#5b574b"
            tick={tickStyle as never}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: "#faf6ef",
              border: "1px solid #d9d0bd",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#5b574b" }}
            formatter={(v) => [formatDZD(Number(v)), "CA"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#215728"
            strokeWidth={2}
            fill="url(#rev-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersBarChart({
  data,
  className,
}: {
  data: Array<{ date: string; orders: number }>;
  className?: string;
}) {
  const formatted = React.useMemo(
    () => data.map((d) => ({ ...d, label: dayLabel(d.date) })),
    [data]
  );
  return (
    <div className={cn("h-72 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatted}
          margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
        >
          <CartesianGrid stroke="#d9d0bd" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" stroke="#5b574b" tick={tickStyle as never} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#5b574b"
            tick={tickStyle as never}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "#faf6ef",
              border: "1px solid #d9d0bd",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#5b574b" }}
            formatter={(v) => [v, "commandes"]}
          />
          <Bar dataKey="orders" fill="#803e15" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Sparkline({
  data,
  color = "#215728",
  height = 36,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const formatted = data.map((v, i) => ({ i, v }));
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
