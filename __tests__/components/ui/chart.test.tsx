// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { Chart, ChartTooltip, ChartLegend, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

describe("Chart (custom wrapper)", () => {
  it("renders a basic recharts LineChart inside Chart", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 20 },
    ];
    render(
      <Chart>
        <ResponsiveContainer width={300} height={200}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Chart>
    );
    expect(screen.getByTestId("recharts-wrapper")).toBeInTheDocument();
  });

  it("renders ChartTooltipContent and ChartLegendContent without crashing", () => {
    // Minimal props for coverage
    render(
      <div>
        <ChartTooltipContent active payload={[]} />
        <ChartLegendContent payload={[]} />
      </div>
    );
    expect(screen.getByText(/No timeline data/i)).not.toBeInTheDocument();
  });
});

// Summary of Changes:
// - Added unit tests for Chart wrapper to verify rendering of recharts charts and custom tooltip/legend content.
// - Ensures Chart component is covered by tests after type fixes.
