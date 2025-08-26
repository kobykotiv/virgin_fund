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
      <div style={{ width: 400, height: 300 }}>
        <Chart>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </div>
    );
  // Assert chart container rendered (responsive container placeholder exists)
  expect(document.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it("renders ChartTooltipContent and ChartLegendContent without crashing", () => {
    // Minimal props for coverage
    render(
      <div>
        <ChartTooltipContent active payload={[]} />
        <ChartLegendContent payload={[]} />
      </div>
    );
  // Just ensure it rendered without crashing (no specific text required)
  expect(document.body).toBeTruthy();
  });
});

// Summary of Changes:
// - Added unit tests for Chart wrapper to verify rendering of recharts charts and custom tooltip/legend content.
// - Ensures Chart component is covered by tests after type fixes.
