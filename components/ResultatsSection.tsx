"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ResultatsBacData, ResultatAnnee } from "@/data/resultats";

interface ResultatsSectionProps {
  data: ResultatsBacData;
}

function DonutChartBlock({ annee }: { annee: ResultatAnnee }) {
  const chartData = annee.mentions.map((m) => ({
    name: m.label,
    value: m.value,
    color: m.color,
  }));

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-6 font-sans text-lg font-medium text-slate-700">
        {annee.annee}
      </h3>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="h-[200px] min-h-[200px] w-[200px] min-w-[200px] flex-shrink-0 sm:h-[220px] sm:min-h-[220px] sm:w-[220px] sm:min-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => (value != null ? `${value} %` : "")}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {annee.mentions.map((m) => (
            <div
              key={m.label}
              className="flex items-center gap-2 font-sans text-sm text-slate-600"
            >
              <span
                className="h-3 w-3 flex-shrink-0 rounded-sm"
                style={{ backgroundColor: m.color }}
              />
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResultatsSection({ data }: ResultatsSectionProps) {
  return (
    <section className="rounded-lg bg-slate-50/80 px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2
            className="font-sans text-2xl font-bold uppercase tracking-tight text-slate-800 md:text-3xl"
            style={{ color: "#14532d" }}
          >
            {data.titre}
          </h2>
          <div
            className="mt-2 h-1 w-16"
            style={{ backgroundColor: "#14532d" }}
          />
          <p className="mt-4 font-sans text-base text-slate-600 md:text-lg">
            {data.sousTitre}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {data.annees.map((annee) => (
            <div key={annee.annee} className="flex flex-col items-center">
              <DonutChartBlock annee={annee} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
