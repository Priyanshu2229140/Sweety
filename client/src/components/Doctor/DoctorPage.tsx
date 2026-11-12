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

  useEffect(() => {
    const storedDetails = localStorage.getItem("sweety_doctor");

    if (storedDetails) {
      try {
        setDetails({
          ...initialDetails,
          ...JSON.parse(storedDetails),
        });
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

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("sweety_doctor", JSON.stringify(details));
    setSaved(true);
  };

  const inputClass =
    "w-full border border-[#DCD7CB] rounded-lg px-4 py-3 outline-none focus:border-[#C65D35]";

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#292824] p-5 sm:p-8 lg:p-10">
      <header className="mb-8">
        <p className="text-sm text-[#77746D]">YOUR HEALTH COMPANION</p>

        <h1 className="text-3xl font-bold mt-1">Doctor's Corner</h1>

        <p className="text-sm text-[#77746D] mt-2">
          Manage your healthcare information and consultation notes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Profile */}
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

        {/* Clinic Details */}
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

        {/* Appointment */}
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

        {/* Consultation Notes */}
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

      {/* Save Button */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="bg-[#C65D35] hover:bg-[#A94B2B] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Save details
        </button>

        {saved && (
          <p className="text-sm text-green-700">Details saved successfully!</p>
        )}
      </div>

      <footer className="mt-10 text-center text-xs text-[#77746D]">
        Sweety · Blood Glucose Tracker
      </footer>
    </div>
  );
}

export default DoctorPage;
