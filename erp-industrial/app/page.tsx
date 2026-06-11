// app/page.tsx
import { KpiCard } from "../components/dashboard/KpiCard";
import { RevenueChart } from "../components/dashboard/RevenueChart";

const dashboardData = {
  rentabilidad: 32.5,
  gastosMes: 1240.0,
  alertasSSOMA: 2,
};

export default function Home() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Panel{" "}
          <span className="text-primary text-2xl font-light">
            de Control Operativo
          </span>
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">
          Métricas clave de rentabilidad y gestión de recursos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Rentabilidad"
          value={`+ ${dashboardData.rentabilidad}%`}
          iconName="trendingup"
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />

        {/* Gastos del Mes → info (azul semántico) */}
        <KpiCard
          title="Gastos del Mes"
          value={`$ ${dashboardData.gastosMes.toLocaleString()}`}
          iconName="dollarsign"
          variant="info"             
        />

        <KpiCard
          title="Alertas SSOMA"
          value={dashboardData.alertasSSOMA}
          iconName="alerttriangle"
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RevenueChart />
      </div>
    </div>
  );
}