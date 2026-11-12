import type { FormEvent } from "react";

type Reading = {
  id: number;
  date: string;
  slot: string;
  value: number;
};

type EditReadingFormProps = {
  reading: Reading;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  editError: string;
  updating: boolean;
};

function EditReadingForm({
  reading,
  onSubmit,
  onCancel,
  editError,
  updating,
}: EditReadingFormProps) {
  return (
    <div className="mb-6 rounded-2xl border border-[#DCD7CB] bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#292824]">
        Edit Reading
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={new Date(reading.date).toISOString().slice(0, 10)}
            required
            className="w-full rounded-lg border border-[#DCD7CB] p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Reading Slot</label>
          <select
            name="slot"
            defaultValue={reading.slot}
            required
            className="w-full rounded-lg border border-[#DCD7CB] p-3"
          >
            <option value="Morning fasting">Morning fasting</option>
            <option value="After breakfast">After breakfast</option>
            <option value="After lunch">After lunch</option>
            <option value="After dinner">After dinner</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Glucose Level (mg/dL)
          </label>
          <input
            type="number"
            name="value"
            min="40"
            max="600"
            defaultValue={reading.value}
            required
            className="w-full rounded-lg border border-[#DCD7CB] p-3"
          />
        </div>

        {editError && <p className="text-sm text-red-600">{editError}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={updating}
            className="rounded-lg bg-[#C65D35] px-5 py-2 text-white"
          >
            {updating ? "Updating..." : "Update Reading"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#DCD7CB] px-5 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditReadingForm;
