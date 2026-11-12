type QuickActionProps = {
  onAddReading: () => void;
};

function QuickAction({ onAddReading }: QuickActionProps) {
  return (
    <div className="bg-[#E9E2D5] rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <p className="text-xs tracking-widest text-[#C65D35] font-bold">
          QUICK ACTION
        </p>
        <h3 className="text-2xl font-bold mt-4">
          Log a new reading.
        </h3>
        <p className="text-sm text-[#77746D] mt-3 leading-relaxed">
          Keep track of your glucose levels by recording your latest
          measurement.
        </p>
      </div>

      <button
        onClick={onAddReading}
        className="w-full bg-[#C65D35] hover:bg-[#A94B2B] text-white rounded-lg py-3 mt-8 font-semibold transition-colors"
      >
        + Add reading
      </button>
    </div>
  );
}

export default QuickAction;