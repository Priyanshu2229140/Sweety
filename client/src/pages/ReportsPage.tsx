import { useEffect, useState } from "react";
import API_BASE_URL from "../lib/api";
import MonthlyGlucoseChart from "../components/Reports/MonthlyGlucoseChart";

type Reading = {
  id: number;
  date: string;
  slot: string;
  value: number;
};

type ChartEntry = {
  date: string;
  average: number;
};

function ReportsPage() {
  const [dailyReport, setDailyReport] = useState<any>(null);
  const [monthlyReport, setMonthlyReport] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState<ChartEntry[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("sweety_token");

        if (!token) {
          throw new Error("Please log in again.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch daily, monthly and individual reading data
        const [dailyResponse, monthlyResponse, readingsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/reports/daily?date=${selectedDate}`, {
              headers,
            }),
            fetch(`${API_BASE_URL}/reports/monthly/current`, {
              headers,
            }),
            fetch(`${API_BASE_URL}/readings`, {
              headers,
            }),
          ]);

        const dailyData = await dailyResponse.json();
        const monthlyData = await monthlyResponse.json();
        const readingsData = await readingsResponse.json();

        // Check API responses
        if (!dailyResponse.ok) {
          throw new Error(dailyData.message || "Failed to load daily report.");
        }

        if (!monthlyResponse.ok) {
          throw new Error(
            monthlyData.message || "Failed to load monthly report.",
          );
        }

        if (!readingsResponse.ok) {
          throw new Error(readingsData.message || "Failed to load readings.");
        }

        setDailyReport(dailyData);
        setMonthlyReport(monthlyData);

        // Prepare monthly chart data
        const readings: Reading[] = readingsData.readings;

        const currentMonth = new Date().toLocaleDateString("en-CA").slice(0, 7);

        const monthlyReadings = readings.filter(
          (reading) => reading.date.slice(0, 7) === currentMonth,
        );

        // Group readings by date
        const groupedReadings = monthlyReadings.reduce(
          (groups, reading) => {
            const date = reading.date.slice(0, 10);

            if (!groups[date]) {
              groups[date] = {
                total: 0,
                count: 0,
              };
            }

            groups[date].total += reading.value;
            groups[date].count += 1;

            return groups;
          },
          {} as Record<string, { total: number; count: number }>,
        );

        // Calculate daily averages
        const chartValues = Object.entries(groupedReadings)
          .map(([date, values]) => ({
            date: date.slice(8, 10),
            average: Number((values.total / values.count).toFixed(1)),
          }))
          .sort((a, b) => Number(a.date) - Number(b.date));

        setChartData(chartValues);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#292824] p-5 sm:p-8 lg:p-10">
      {/* Page Header */}
      <header className="mb-8">
        <p className="text-sm text-[#77746D]">YOUR HEALTH OVERVIEW</p>

        <h1 className="text-3xl font-bold mt-1">Glucose Reports</h1>

        <p className="text-sm text-[#77746D] mt-2">
          Review your daily and monthly glucose measurements.
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Daily Report */}
      <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6 mb-8">
        <h2 className="text-xl font-bold mb-5">Daily Report</h2>

        <label className="block text-sm font-semibold mb-2">Select date</label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toLocaleDateString("en-CA")}
          className="w-full sm:w-64 border border-[#DCD7CB] rounded-lg px-4 py-3"
        />

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-[#77746D]">Loading report...</p>
          ) : dailyReport && dailyReport.count > 0 ? (
            <>
              {/* Daily Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#292824] text-white p-5">
                  <p className="text-sm text-[#BDB9AF]">Daily average</p>

                  <h3 className="text-3xl font-bold mt-3">
                    {dailyReport.average}{" "}
                    <span className="text-sm font-normal">mg/dL</span>
                  </h3>
                </div>

                <div className="rounded-xl border border-[#E5E0D5] p-5">
                  <p className="text-sm text-[#77746D]">Lowest reading</p>

                  <h3 className="text-3xl font-bold mt-3">
                    {dailyReport.min}{" "}
                    <span className="text-sm font-normal">mg/dL</span>
                  </h3>
                </div>

                <div className="rounded-xl border border-[#E5E0D5] p-5">
                  <p className="text-sm text-[#77746D]">Highest reading</p>

                  <h3 className="text-3xl font-bold mt-3">
                    {dailyReport.max}{" "}
                    <span className="text-sm font-normal">mg/dL</span>
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm text-[#77746D]">
                {dailyReport.count} readings recorded on this date.
              </p>

              {/* Reading Details */}
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-4">Reading details</h3>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[450px] text-sm text-left">
                    <thead>
                      <tr className="border-b border-[#E5E0D5] text-[#77746D]">
                        <th className="py-3">Reading slot</th>
                        <th className="py-3">Glucose level</th>
                        <th className="py-3">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dailyReport.readings.map((reading: Reading) => (
                        <tr
                          key={reading.id}
                          className="border-b border-[#F0EDE6] last:border-0"
                        >
                          <td className="py-4 font-medium">{reading.slot}</td>

                          <td className="py-4 font-semibold">
                            {reading.value} mg/dL
                          </td>

                          <td className="py-4">
                            {new Date(reading.date).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-5 text-sm text-[#77746D]">
              No readings recorded on this date.
            </p>
          )}
        </div>
      </section>

      {/* Monthly Report */}
      <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6">
        <h2 className="text-xl font-bold mb-2">Monthly Report</h2>

        <p className="text-sm text-[#77746D] mb-6">
          Your glucose summary for {monthlyReport?.month || "this month"}.
        </p>

        {loading ? (
          <p className="text-sm text-[#77746D]">Loading monthly report...</p>
        ) : monthlyReport && monthlyReport.count > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-[#292824] text-white p-5">
              <p className="text-sm text-[#BDB9AF]">Monthly average</p>

              <h3 className="text-2xl font-bold mt-3">
                {monthlyReport.average}{" "}
                <span className="text-sm font-normal">mg/dL</span>
              </h3>
            </div>

            <div className="rounded-xl border border-[#E5E0D5] p-5">
              <p className="text-sm text-[#77746D]">Lowest reading</p>

              <h3 className="text-2xl font-bold mt-3">
                {monthlyReport.min}{" "}
                <span className="text-sm font-normal">mg/dL</span>
              </h3>
            </div>

            <div className="rounded-xl border border-[#E5E0D5] p-5">
              <p className="text-sm text-[#77746D]">Highest reading</p>

              <h3 className="text-2xl font-bold mt-3">
                {monthlyReport.max}{" "}
                <span className="text-sm font-normal">mg/dL</span>
              </h3>
            </div>

            <div className="rounded-xl border border-[#E5E0D5] p-5">
              <p className="text-sm text-[#77746D]">Total readings</p>

              <h3 className="text-2xl font-bold mt-3">{monthlyReport.count}</h3>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#77746D]">
            No readings recorded this month.
          </p>
        )}
      </section>

      {/* Monthly Glucose Chart */}
      <MonthlyGlucoseChart data={chartData} />
    </div>
  );
}

export default ReportsPage;
