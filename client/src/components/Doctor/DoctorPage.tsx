import { useEffect, useState } from "react";

type DoctorDetails = {
  name: string;
  specialization: string;
  clinic: string;
  address: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
};

const initialDetails: DoctorDetails = {
  name: "",
  specialization: "",
  clinic: "",
  address: "",
  phone: "",
  appointmentDate: "",
  appointmentTime: "",
  notes: "",
};

function DoctorPage() {
  const [details, setDetails] = useState<DoctorDetails>(initialDetails);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedDetails = localStorage.getItem("sweety_doctor");

    if (storedDetails) {
      try {
        setDetails({
          ...initialDetails,
          ...JSON.parse(storedDetails),
        });
        setSaved(true);
      } catch {
        localStorage.removeItem("sweety_doctor");
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("sweety_doctor", JSON.stringify(details));
    setSaved(true);
    setEditing(false);
  };
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your doctor details?",
    );

    if (!confirmed) return;

    localStorage.removeItem("sweety_doctor");
    setDetails(initialDetails);
    setSaved(false);
    setEditing(false);
  };
  const inputClass =
    "w-full border border-[#DCD7CB] rounded-lg px-4 py-3 outline-none focus:border-[#C65D35]";

  const appointmentDate = details.appointmentDate
    ? new Date(`${details.appointmentDate}T00:00:00`).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : "Not scheduled";

  const appointmentTime = details.appointmentTime
    ? new Date(`2000-01-01T${details.appointmentTime}`).toLocaleTimeString(
        "en-IN",
        { hour: "numeric", minute: "2-digit" },
      )
    : "";

  // Saved doctor overview
  if (saved && !editing) {
    return (
      <div className="min-h-screen bg-[#F4F1E8] text-[#292824] p-5 sm:p-8 lg:p-10">
        <header className="mb-8">
          <p className="text-sm text-[#77746D]">YOUR HEALTH COMPANION</p>
          <h1 className="text-3xl font-bold mt-1">Doctor's Corner</h1>
          <p className="text-sm text-[#77746D] mt-2">
            Your healthcare contact and appointment information.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor profile */}
          <section className="bg-[#292824] text-white rounded-2xl p-6 lg:col-span-2">
            <p className="text-sm text-[#DCD7CB] mb-5">YOUR DOCTOR</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#C65D35] flex items-center justify-center text-2xl font-bold">
                {details.name.trim().charAt(0).toUpperCase() || "D"}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {details.name || "Doctor name not added"}
                </h2>
                <p className="text-[#DCD7CB] mt-1">
                  {details.specialization || "Specialization not added"}
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-5 space-y-3">
              <div>
                <p className="text-sm text-[#DCD7CB]">Clinic</p>
                <p className="font-semibold">{details.clinic || "Not added"}</p>
              </div>

              <div>
                <p className="text-sm text-[#DCD7CB]">Address</p>
                <p className="font-semibold">
                  {details.address || "Not added"}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#DCD7CB]">Contact number</p>
                <p className="font-semibold">{details.phone || "Not added"}</p>
              </div>
            </div>
          </section>

          {/* Appointment */}
          <section className="bg-[#E9E2D4] rounded-2xl p-6 flex flex-col">
            <p className="text-sm font-semibold text-[#C65D35] mb-5">
              NEXT APPOINTMENT
            </p>

            <h2 className="text-2xl font-bold mb-3">{appointmentDate}</h2>

            <p className="text-[#77746D]">
              {appointmentTime || "Time not scheduled"}
            </p>

            <div className="mt-6 pt-5 border-t border-[#DCD7CB]">
              <p className="text-sm text-[#77746D] mb-1">Appointment status</p>
              <p className="font-semibold">
                {details.appointmentDate
                  ? "Scheduled"
                  : "No appointment scheduled"}
              </p>
            </div>
          </section>

          {/* Consultation notes */}
          <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-3">Notes & Questions</h2>
            <p className="text-sm text-[#77746D] whitespace-pre-wrap">
              {details.notes || "No consultation notes added yet."}
            </p>
          </section>

          {/* Quick action */}
          <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-[#C65D35] mb-3">
                QUICK ACTION
              </p>
              <h2 className="text-xl font-bold">Update your doctor details.</h2>
              <p className="text-sm text-[#77746D] mt-2">
                Keep your healthcare information up to date.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full bg-[#C65D35] hover:bg-[#A94B2B] text-white font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                Edit details
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                Delete details
              </button>
            </div>
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-[#77746D]">
          Sweety · Blood Glucose Tracker
        </footer>
      </div>
    );
  }

  // Doctor information form
  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#292824] p-5 sm:p-8 lg:p-10">
      <header className="mb-8">
        <p className="text-sm text-[#77746D]">YOUR HEALTH COMPANION</p>

        <h1 className="text-3xl font-bold mt-1">
          {saved ? "Edit Doctor Details" : "Doctor's Corner"}
        </h1>

        <p className="text-sm text-[#77746D] mt-2">
          Manage your healthcare information and consultation notes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6">
          <h2 className="text-xl font-bold mb-5">Doctor Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Doctor's name
              </label>
              <input
                name="name"
                value={details.name}
                onChange={handleChange}
                placeholder="Enter doctor's name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Specialization
              </label>
              <input
                name="specialization"
                value={details.specialization}
                onChange={handleChange}
                placeholder="e.g. General Physician"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6">
          <h2 className="text-xl font-bold mb-5">Clinic Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Clinic name
              </label>
              <input
                name="clinic"
                value={details.clinic}
                onChange={handleChange}
                placeholder="Enter clinic name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={details.address}
                onChange={handleChange}
                placeholder="Enter clinic address"
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Contact number
              </label>
              <input
                name="phone"
                type="tel"
                value={details.phone}
                onChange={handleChange}
                placeholder="Enter contact number"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6">
          <h2 className="text-xl font-bold mb-5">Next Appointment</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Appointment date
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={details.appointmentDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Appointment time
              </label>
              <input
                type="time"
                name="appointmentTime"
                value={details.appointmentTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6">
          <h2 className="text-xl font-bold mb-5">Notes & Questions</h2>

          <textarea
            name="notes"
            value={details.notes}
            onChange={handleChange}
            placeholder="Write questions or notes for your next consultation..."
            rows={5}
            className={inputClass}
          />
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="bg-[#C65D35] hover:bg-[#A94B2B] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Save details
        </button>

        {saved && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="border border-[#DCD7CB] hover:bg-[#E9E2D4] font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <footer className="mt-10 text-center text-xs text-[#77746D]">
        Sweety · Blood Glucose Tracker
      </footer>
    </div>
  );
}

export default DoctorPage;
