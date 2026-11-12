type Reading = {
  id: number;
  date: string;
  slot: string;
  value: number;
};

type RecentReadingsProps = {
  readings: Reading[];
  onEdit: (reading: Reading) => void;
  onDelete: (id: number) => void;
};

function RecentReadings({ readings, onEdit, onDelete }: RecentReadingsProps) {
  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E0D5] p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold">Recent readings</h3>
          <p className="text-sm text-[#77746D] mt-1">
            Your latest glucose measurements
          </p>
        </div>

        <button className="text-sm font-semibold text-[#C65D35]">
          View all →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-[#E5E0D5] text-[#77746D]">
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Reading slot</th>
              <th className="py-3 font-medium text-right">Value</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {readings.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#77746D]">
                  No readings recorded yet.
                </td>
              </tr>
            ) : (
              readings.map((reading) => (
                <tr
                  key={reading.id}
                  className="border-b border-[#F0EDE5] last:border-0"
                >
                  <td className="py-4 whitespace-nowrap">
                    {new Date(reading.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="py-4">{reading.slot}</td>

                  <td className="py-4 text-right font-bold">
                    {reading.value}
                    <span className="text-xs font-normal text-[#77746D]">
                      {" "}
                      mg/dL
                    </span>
                  </td>

                  <td className="py-4 text-right">
                    <button
                      onClick={() => onEdit(reading)}
                      className="mr-3 text-sm font-medium text-[#C65D35] hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(reading.id)}
                      className="text-sm text-[#C65D35] hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentReadings;
