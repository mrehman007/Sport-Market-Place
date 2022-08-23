import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { v4 as uuid } from "uuid";

const Chart = ({ data, color }) => {
  let id = uuid();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={200} height={100} data={data}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="pv"
          stroke={color}
          strokeWidth={4}
          fillOpacity={1}
          fill={`url(#${id})`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: `${color}`,
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            fontSize: "0.8rem",
          }}
          itemStyle={{
            color: "#fff",
            fontSize: "0.9rem",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
