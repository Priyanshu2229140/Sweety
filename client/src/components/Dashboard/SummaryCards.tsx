type SummaryCardsProps = {
  average: string;
  lowest: number | string;
  readingCount: number;
};

function SummaryCards({ average, lowest, readingCount }: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
      <div className="bg-[#292824] text-[#F4F1E8] rounded-2xl p-6">
        <p className="text-sm text-[#BDB9AF]">Today's average</p>
        <div className="flex items-end gap-2 mt-5">
          <h3 className="text-4xl font-bold">{average}</h3>
          <span className="text-sm text-[#BDB9AF] mb-1">mg/dL</span>
        </div>
        <p className="text-xs text-[#BDB9AF] mt-3">Based on today's readings</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E5E0D5]">
        <p className="text-sm text-[#77746D]">Lowest reading</p>
        <div className="flex items-end gap-2 mt-5">
          <h3 className="text-4xl font-bold">{lowest}</h3>
          <span className="text-sm text-[#77746D] mb-1">mg/dL</span>
        </div>
        <p className="text-xs text-[#77746D] mt-3">Today's minimum</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E5E0D5] sm:col-span-2 xl:col-span-1">
        <p className="text-sm text-[#77746D]">Readings recorded</p>
        <div className="flex items-end gap-2 mt-5">
          <h3 className="text-4xl font-bold">{readingCount}</h3>
          <span className="text-sm text-[#77746D] mb-1">today</span>
        </div>
        <p className="text-xs text-[#77746D] mt-3">Recorded today</p>
      </div>
    </section>
  );
}

export default SummaryCards;
