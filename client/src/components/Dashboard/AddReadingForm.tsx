import type { FormEvent } from "react";

type AddReadingFormProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  formError: string;
  saving: boolean;
};

function AddReadingForm({
  onSubmit,
  onClose,
  formError,
  saving,
}: AddReadingFormProps) {
  return (
    <section className="bg-white border border-[#E5E0D5] rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold">Add glucose reading</h3>
          <p className="text-sm text-[#77746D] mt-1">
            Record your latest measurement.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[#77746D] hover:text-[#C65D35] text-xl"
          aria-label="Close form"
        >
          ✕
        </button>
      </div>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        onSubmit={onSubmit}
      >
        <div>
          <label className="block text-sm font-semibold mb-2">
            Reading date
          </label>
          <input
            type="date"
            name="date"
            max={new Date().toLocaleDateString("en-CA")}
            required
            className="w-full border border-[#DCD7CB] rounded-lg px-4 py-3 outline-none focus:border-[#C65D35]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Reading slot
          </label>
          <select
            name="slot"
            required
            defaultValue=""
            className="w-full border border-[#DCD7CB] rounded-lg px-4 py-3 outline-none focus:border-[#C65D35] bg-white"
          >
            <option value="" disabled>
              Select reading slot
            </option>
            <option>Morning fasting</option>
            <option>After breakfast</option>
            <option>After lunch</option>
            <option>After dinner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Glucose value (mg/dL)
          </label>
          <input
            type="number"
            name="value"
            min="40"
            max="600"
            step="1"
            required
            placeholder="e.g. 110"
            className="w-full border border-[#DCD7CB] rounded-lg px-4 py-3 outline-none focus:border-[#C65D35]"
          />
        </div>

        {formError && (
          <p className="sm:col-span-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
            {formError}
          </p>
        )}

        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[#DCD7CB] rounded-lg py-3 font-semibold hover:bg-[#F4F1E8]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#C65D35] text-white rounded-lg py-3 font-semibold hover:bg-[#A94B2B] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save reading"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddReadingForm;
