"use client";

import { TrendingUp, DollarSign, AlertTriangle, LucideIcon } from "lucide-react";

// Diccionario de iconos
const iconMap: Record<string, LucideIcon> = {
  trendingup: TrendingUp,
  dollarsign: DollarSign,
  alerttriangle: AlertTriangle,
};

// Diccionario de estilos visuales (ahora incluye "info")
const colorStyles: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  success: { bg: "bg-green-500/10", text: "text-green-500" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-500" },
  danger: { bg: "bg-red-500/10", text: "text-red-500" },
  info: { bg: "bg-blue-500/10", text: "text-blue-500" },         // 👈 nueva variante
  default: { bg: "bg-muted", text: "text-muted-foreground" },
};

interface KpiCardProps {
  title: string;
  value: string | number;
  iconName: string;
  // Incluimos "info" en la unión de tipos
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "default";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KpiCard({
  title,
  value,
  iconName,
  variant = "primary",
  trend,
}: KpiCardProps) {
  const Icon = iconMap[iconName.toLowerCase()];
  const styles = colorStyles[variant] || colorStyles.default;

  if (!Icon) {
    console.warn(`Icono '${iconName}' no encontrado en iconMap`);
    return null;
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${styles.bg} ${styles.text}`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-foreground mt-0.5">
          {value}
        </h3>
        {trend && (
          <p
            className={`text-xs mt-1 font-medium flex items-center gap-1 ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </div>
  );
}