declare module 'react-chartjs-2' {
  import type React from 'react'
  export type ChartProps<T extends string = any, D = any, L = any> = React.ComponentProps<'div'> & { data?: D; options?: any }
  export const Line: React.FC<ChartProps<'line', any, any>>
  export default {} as any
}
