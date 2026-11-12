import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type MonthlyGlucoseChartProps = {
  data: {
    date: string;
    average: number;
  }[];
};

function MonthlyGlucoseChart({ data }: MonthlyGlucoseChartProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E0D5] p-4 sm:p-6 mt-8">
      <h2 className="text-xl font-bold mb-2">Monthly Glucose Trend</h2>

      <p className="text-sm text-[#77746D] mb-6">
        Daily average glucose readings throughout the month.
      </p>

      {data.length === 0 ? (
        <p className="text-sm text-[#77746D] py-10 text-center">
          No readings available to display the chart.
        </p>
      ) : (
        <div className="w-full h-72 sm:h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />

              <XAxis
                dataKey="date"
                tick={{ fill: "#77746D", fontSize: 11 }}
                tickMargin={8}
                minTickGap={15}
                axisLine={{ stroke: "#DCD7CB" }}
                tickLine={{ stroke: "#DCD7CB" }}
              />

              <YAxis
                tick={{ fill: "#77746D", fontSize: 11 }}
                width={38}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E5E0D5",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value} mg/dL`, "Daily average"]}
              />

              <Line
                type="linear"
                dataKey="average"
                name="Daily average"
                stroke="#C65D35"
                strokeWidth={3}
                dot={{ r: 4, fill: "#C65D35" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default MonthlyGlucoseChart;
