import { useEffect, useState, type FormEvent } from "react";
import API_BASE_URL from "../lib/api";

function Dashboard() {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [readings, setReadings] = useState<any[]>([]);
  const [editingReading, setEditingReading] = useState<any>(null);
  const [editError, setEditError] = useState("");
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const token = localStorage.getItem("sweety_token");

        const response = await fetch(`${API_BASE_URL}/readings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch readings");
        }

        setReadings(data.readings);
      } catch (error) {
        console.error("Readings error:", error);
      }
    };

    fetchReadings();
  }, []);
  const today = new Date().toLocaleDateString("en-CA");

  const todayReadings = readings.filter(
    (reading) => new Date(reading.date).toLocaleDateString("en-CA") === today,
  );

  const average =
    todayReadings.length > 0
      ? (
          todayReadings.reduce((sum, reading) => sum + reading.value, 0) /
          todayReadings.length
        ).toFixed(1)
      : "—";

  const lowest =
    todayReadings.length > 0
      ? Math.min(...todayReadings.map((reading) => reading.value))
      : "—";

  const readingCount = todayReadings.length;
  const [userName, setUserName] = useState("Loading...");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("sweety_token");

        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUserName(data.user.name);
      } catch (error) {
        console.error("Profile error:", error);
        setUserName("User");
      }
    };

    fetchProfile();
  }, []);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddReading = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const token = localStorage.getItem("sweety_token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const payload = {
        date: String(formData.get("date")),
        slot: String(formData.get("slot")),
        value: Number(formData.get("value")),
      };

      const response = await fetch(`${API_BASE_URL}/readings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save reading.");
      }

      const refreshResponse = await fetch(`${API_BASE_URL}/readings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error("Reading saved, but refreshing the list failed.");
      }

      setReadings(refreshData.readings);
      form.reset();
      setShowAddForm(false);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReading = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reading?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("sweety_token");

      const response = await fetch(`${API_BASE_URL}/readings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete reading.");
      }

      setReadings((previousReadings) =>
        previousReadings.filter((reading) => reading.id !== id),
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  const handleUpdateReading = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReading) return;

    setUpdating(true);
    setEditError("");

    const formData = new FormData(e.currentTarget);

    try {
      const token = localStorage.getItem("sweety_token");

      const payload = {
        date: String(formData.get("date")),
        slot: String(formData.get("slot")),
        value: Number(formData.get("value")),
      };

      const response = await fetch(
        `${API_BASE_URL}/readings/${editingReading.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update reading.");
      }

      const refreshResponse = await fetch(`${API_BASE_URL}/readings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error("Reading updated, but refreshing the list failed.");
      }

      setReadings(refreshData.readings);
      setEditingReading(null);
    } catch (error) {
      setEditError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#292824] md:flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#292824] text-[#F4F1E8] p-7 flex-col">
        <h1 className="text-3xl font-bold">
          Sweety<span className="text-[#C65D35]">.</span>
        </h1>

        <p className="text-xs text-[#BDB9AF] mt-2">YOUR HEALTH COMPANION</p>

        <nav className="mt-14 space-y-3">
          <div className="bg-[#C65D35] text-white rounded-lg px-4 py-3">
            Overview
          </div>
          <div className="text-[#BDB9AF] px-4 py-3 hover:text-white cursor-pointer">
            My readings
          </div>
          <div className="text-[#BDB9AF] px-4 py-3 hover:text-white cursor-pointer">
            Reports
          </div>
        </nav>

        <div className="mt-auto border-t border-[#514F49] pt-5">
          <p className="text-sm text-[#BDB9AF]">Sweety v1.0</p>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="md:hidden bg-[#292824] text-[#F4F1E8] px-5 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Sweety<span className="text-[#C65D35]">.</span>
          </h1>
          <span className="text-xs text-[#BDB9AF]">YOUR HEALTH COMPANION</span>
        </div>

        <nav className="flex gap-2 mt-4 overflow-x-auto">
          <button
            type="button"
            className="bg-[#C65D35] text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            Overview
          </button>
          <button
            type="button"
            className="text-[#BDB9AF] px-4 py-2 text-sm whitespace-nowrap"
          >
            My readings
          </button>
          <button
            type="button"
            className="text-[#BDB9AF] px-4 py-2 text-sm whitespace-nowrap"
          >
            Reports
          </button>
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div>
            <p className="text-sm text-[#77746D]">YOUR HEALTH OVERVIEW</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              Good morning!
            </h2>
            <p className="text-sm text-[#77746D] mt-1">
              Here's your glucose summary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#292824] text-[#F4F1E8] flex items-center justify-center font-semibold">
              DU
            </div>
            <div>
              <p className="font-semibold text-sm">{userName}</p>
              <p className="text-xs text-[#77746D]">Personal account</p>
            </div>
          </div>
        </header>

        {/* Add Reading Form */}
        {showAddForm && (
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
                onClick={() => setShowAddForm(false)}
                className="text-[#77746D] hover:text-[#C65D35] text-xl"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              onSubmit={handleAddReading}
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
                  onClick={() => setShowAddForm(false)}
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
        )}
        {editingReading && (
  <div className="mb-6 rounded-2xl border border-[#DCD7CB] bg-white p-6">
    <h2 className="mb-4 text-lg font-semibold text-[#292824]">
      Edit Reading
    </h2>

    <form onSubmit={handleUpdateReading} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          defaultValue={new Date(editingReading.date).toISOString().slice(0, 10)}
          required
          className="w-full rounded-lg border border-[#DCD7CB] p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Reading Slot</label>
        <select
          name="slot"
          defaultValue={editingReading.slot}
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
          defaultValue={editingReading.value}
          required
          className="w-full rounded-lg border border-[#DCD7CB] p-3"
        />
      </div>

      {editError && (
        <p className="text-sm text-red-600">{editError}</p>
      )}

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
          onClick={() => {
            setEditingReading(null);
            setEditError("");
          }}
          className="rounded-lg border border-[#DCD7CB] px-5 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#292824] text-[#F4F1E8] rounded-2xl p-6">
            <p className="text-sm text-[#BDB9AF]">Today's average</p>
            <div className="flex items-end gap-2 mt-5">
              <h3 className="text-4xl font-bold">{average}</h3>
              <span className="text-sm text-[#BDB9AF] mb-1">mg/dL</span>
            </div>
            <p className="text-xs text-[#BDB9AF] mt-3">
              Based on today's readings
            </p>
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

        {/* Main dashboard grid */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Readings */}
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
                      <td
                        colSpan={4}
                        className="py-8 text-center text-[#77746D]"
                      >
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
                            onClick={() => setEditingReading(reading)}
                            className="mr-3 text-sm font-medium text-[#C65D35] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReading(reading.id)}
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

          {/* Quick action */}
          <div className="bg-[#E9E2D5] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs tracking-widest text-[#C65D35] font-bold">
                QUICK ACTION
              </p>
              <h3 className="text-2xl font-bold mt-4">Log a new reading.</h3>
              <p className="text-sm text-[#77746D] mt-3 leading-relaxed">
                Keep track of your glucose levels by recording your latest
                measurement.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-[#C65D35] hover:bg-[#A94B2B] text-white rounded-lg py-3 mt-8 font-semibold transition-colors"
            >
              + Add reading
            </button>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-[#77746D]">
          Sweety · Blood Glucose Tracker
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
