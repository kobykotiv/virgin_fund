import React from 'react';

interface ResultTableProps {
  data: Array<{ label: string; value: string | number }>;
}

export default function ResultTable({ data }: ResultTableProps) {
  return (
    <table className="w-full mt-4">
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            <td className="py-2 font-medium text-muted-foreground">{row.label}</td>
            <td className="py-2">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
