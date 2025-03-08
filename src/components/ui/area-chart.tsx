import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Type for the data item (each object in the data array)
interface DataItem {
  [key: string]: number; // Dynamic asset type fields as numbers, no month field
}

// Type for the component props
interface StackedAreaChartProps {
  data: DataItem[];
}

// Function to convert decimal values to percentage
const toPercent = (decimal: number, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

// Function to get percentage for each value
const getPercent = (value: number, total: number) => {
  const ratio = total > 0 ? value / total : 0;
  return toPercent(ratio, 2);
};

// Custom tooltip content rendering
const renderTooltipContent = (o: any) => {
  const { payload, label } = o;
  const total = payload.reduce((result: number, entry: any) => result + entry.value, 0);

  return (
    <div className="customized-tooltip-content">
      <p className="total">{`${label} (Total: ${total})`}</p>
      <ul className="list">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

// StackedAreaChart Component
const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ data }) => {
  // Extract the keys (asset types) for AreaChart components
  const keys = Object.keys(data[0]);

  // Create a new data array with added labels (index as a label)
  const labeledData = data.map((item, index) => ({
    ...item,
    label: `Data ${index + 1}`, // Generate a label for each entry based on its index
  }));

  return (
    <ResponsiveContainer className={"w-[80%]"} height={400}>
      <AreaChart
        width={500}
        height={400}
        data={labeledData}
        stackOffset="expand"
        title='Stacked Area Chart'
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis tickFormatter={(value) => toPercent(value, 0)} />
        <Tooltip content={renderTooltipContent} />
        {keys.map((key, index) => (
          key !== 'label' && ( // Exclude the label field from Area rendering
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
              fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
            />
          )
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StackedAreaChart;
