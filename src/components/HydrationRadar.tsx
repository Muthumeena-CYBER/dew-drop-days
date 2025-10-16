import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Card } from "@/components/ui/card";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface HydrationRadarProps {
  todayTotal: number;
  dailyGoal: number;
  activityBreaks?: number;
}

export const HydrationRadar = ({ todayTotal, dailyGoal, activityBreaks = 0 }: HydrationRadarProps) => {
  const goalAdherence = Math.min((todayTotal / dailyGoal) * 100, 100);
  
  // Calculate eco-savings (assuming 500ml plastic bottle equivalent)
  const bottlesSaved = Math.floor(todayTotal / 500);
  const ecoScore = Math.min((bottlesSaved / 5) * 100, 100); // Max 5 bottles per day
  
  // Activity breaks normalized to 100 scale (assuming 8 breaks per week is excellent)
  const activityScore = Math.min((activityBreaks / 8) * 100, 100);

  const data = {
    labels: [
      "Intake Volume",
      "Activity Breaks",
      "Eco-Savings",
      "Goal Adherence",
    ],
    datasets: [
      {
        label: "Hydration Wellness",
        data: [
          goalAdherence,
          activityScore,
          ecoScore,
          goalAdherence,
        ],
        backgroundColor: "rgba(34, 211, 238, 0.2)",
        borderColor: "rgba(34, 211, 238, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 211, 238, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 211, 238, 1)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          font: {
            family: "JetBrains Mono",
          },
        },
        pointLabels: {
          font: {
            family: "JetBrains Mono",
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: "JetBrains Mono",
          },
        },
      },
      tooltip: {
        titleFont: {
          family: "JetBrains Mono",
        },
        bodyFont: {
          family: "JetBrains Mono",
        },
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${Math.round(context.parsed.r)}%`;
          },
        },
      },
    },
  };

  return (
    <Card className="p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Hydration Wellness Radar</h2>
      <div className="max-w-md mx-auto">
        <Radar data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-lg bg-accent/5">
          <div className="font-semibold">Bottles Saved</div>
          <div className="text-2xl font-bold text-accent">{bottlesSaved}</div>
        </div>
        <div className="p-3 rounded-lg bg-accent/5">
          <div className="font-semibold">Activity Breaks</div>
          <div className="text-2xl font-bold text-accent">{activityBreaks}</div>
        </div>
      </div>
    </Card>
  );
};
