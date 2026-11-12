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
    <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6 mt-8">
      <h2 className="text-xl font-bold mb-2">Monthly Glucose Trend</h2>

      <p className="text-sm text-[#77746D] mb-6">
        Daily average glucose readings throughout the month.
      </p>

      {data.length === 0 ? (
        <p className="text-sm text-[#77746D] py-10 text-center">
          No readings available to display the chart.
        </p>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 140, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />

              <XAxis dataKey="date" tick={{ fill: "#77746D", fontSize: 12 }} />

              <YAxis tick={{ fill: "#77746D", fontSize: 12 }} width={45} />

              <Tooltip />

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
