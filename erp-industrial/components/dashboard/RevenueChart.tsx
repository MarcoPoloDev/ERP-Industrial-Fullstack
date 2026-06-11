"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "next-themes";

const data = [
  { month: "Ene", ingresos: 4000, gastos: 2400 },
  { month: "Feb", ingresos: 3000, gastos: 1398 },
  { month: "Mar", ingresos: 2000, gastos: 9800 },
  { month: "Abr", ingresos: 2780, gastos: 3908 },
  { month: "May", ingresos: 1890, gastos: 4800 },
  { month: "Jun", ingresos: 2390, gastos: 3800 },
];

export function RevenueChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colorIngresos = isDark ? "hsl(217, 91%, 60%)" : "hsl(217, 91%, 45%)";
  const colorGastos = isDark ? "hsl(0, 84%, 60%)" : "hsl(0, 84%, 45%)";

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-full flex flex-col min-w-0">
      <h3 className="text-lg font-bold mb-4 tracking-tight text-foreground">
        Análisis de Flujo de Caja
      </h3>

      <div className="h-[320px] w-full min-w-0">
        <ResponsiveBar
          data={data}
          keys={["ingresos", "gastos"]}
          indexBy="month"
          margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={[colorIngresos, colorGastos]}
          borderRadius={4}
          
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: (value) => `$${value}`,
          }}
          
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          animate={true}
          motionConfig="gentle"
          
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: isDark ? "hsl(210, 20%, 90%)" : "hsl(210, 20%, 30%)",
                  fontSize: 12,
                },
              },
            },
            grid: {
              line: {
                stroke: isDark ? "hsl(210, 10%, 40%)" : "hsl(210, 10%, 80%)",
                strokeDasharray: "4 4",
              },
            },
          }}
          
          // Tooltip de alto contraste
          tooltip={({ id, value, color }) => (
            <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border border-border text-sm font-medium">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize">{id}</span>
                <span className="font-bold" style={{ color }}>
                  ${value?.toLocaleString()}
                </span>
              </div>
            </div>
          )}
          
          role="application"
          ariaLabel="Gráfico de barras de ingresos y gastos"
        />
      </div>
    </div>
  );
}