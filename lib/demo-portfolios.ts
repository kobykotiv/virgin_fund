import { PORTFOLIO_SCENARIOS } from "./portfolio-scenarios"

export const portfolios = Object.values(PORTFOLIO_SCENARIOS).map(scenario => ({
  id: scenario.id,
  name: scenario.name,
  focus: scenario.focus,
  icon: scenario.icon,
  tags: scenario.tags,
  risk: scenario.risk,
  value: scenario.value,
  return: scenario.return,
  returnClass: scenario.returnClass,
  chartVariant: scenario.chartVariant,
  allocation: scenario.allocation
}))


