import { useEffect, useState, type FormEvent } from "react";
import API_BASE_URL from "../lib/api";
import DashboardHeader from "./Dashboard/DashboardHeader";
import SummaryCards from "./Dashboard/SummaryCards";
import RecentReadings from "./Dashboard/RecentReadings";
import AddReadingForm from "./Dashboard/AddReadingForm";
import EditReadingForm from "./Dashboard/EditReadingForm";
import QuickAction from "./Dashboard/QuickAction";
import DashboardNavigation from "./Dashboard/DashboardNavigation";
type Reading = {
  id: number;
  date: string;
  slot: string;
  value: number;
};
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [readings, setReadings] = useState<Reading[]>([]);
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
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
      <DashboardNavigation />

      {/* Main content */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10">
        {/* Header */}
        <DashboardHeader userName={userName} onLogout={onLogout} />

        {/* Add Reading Form */}
        {showAddForm && (
          <AddReadingForm
            onSubmit={handleAddReading}
            onClose={() => setShowAddForm(false)}
            formError={formError}
            saving={saving}
          />
        )}
        {editingReading && (
          <EditReadingForm
            reading={editingReading}
            onSubmit={handleUpdateReading}
            onCancel={() => {
              setEditingReading(null);
              setEditError("");
            }}
            editError={editError}
            updating={updating}
          />
        )}
        {/* Summary cards */}
        <SummaryCards
          average={average}
          lowest={lowest}
          readingCount={readingCount}
        />
        {/* Main dashboard grid */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Readings */}
          <RecentReadings
            readings={readings}
            onEdit={setEditingReading}
            onDelete={handleDeleteReading}
          />

          {/* Quick action */}
          <QuickAction onAddReading={() => setShowAddForm(true)} />
        </section>

        <footer className="mt-10 text-center text-xs text-[#77746D]">
          Sweety · Blood Glucose Tracker
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
