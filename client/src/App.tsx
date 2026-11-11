
import { useState, type FormEvent } from "react";
import Dashboard from "./components/Dashboard";
import API_BASE_URL from "./lib/api";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("sweety_token"))
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isRegister
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      localStorage.setItem("sweety_token", data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-[#F4F1E8] flex items-center justify-center p-5">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#FAF9F5] rounded-2xl overflow-hidden shadow-2xl">

        <div className="hidden md:flex flex-col justify-between bg-[#292824] text-[#F4F1E8] p-12">
          <div>
            <h1 className="text-3xl font-bold">
              Sweety<span className="text-[#C65D35]">.</span>
            </h1>
            <p className="text-[#BDB9AF] mt-2 text-sm">
              Your health, one reading at a time.
            </p>
          </div>

          <div>
            <div className="text-5xl text-[#C65D35] mb-7">♡</div>
            <h2 className="text-4xl font-semibold leading-tight">
              Take control of your health journey.
            </h2>
            <p className="text-[#BDB9AF] mt-5 leading-relaxed">
              Track your glucose levels, understand your patterns,
              and stay informed with simple daily insights.
            </p>
          </div>

          <p className="text-sm text-[#BDB9AF]">
            Small steps. Healthier habits.
          </p>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="md:hidden mb-10">
            <h1 className="text-3xl font-bold text-[#292824]">
              Sweety<span className="text-[#C65D35]">.</span>
            </h1>
          </div>

          <div className="max-w-sm w-full mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] text-[#C65D35] mb-4">
              SWEETY / {isRegister ? "02" : "01"}
            </p>

            <h2 className="text-3xl font-bold text-[#292824]">
              {isRegister ? "Create your account" : "Welcome back"}
            </h2>

            <p className="text-[#77746D] mt-3 mb-8">
              {isRegister
                ? "Start your health journey with Sweety."
                : "Sign in to continue your health journey."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white rounded-lg border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#C65D35]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white rounded-lg border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#C65D35]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={isRegister ? 8 : 1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white rounded-lg border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#C65D35]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C65D35] hover:bg-[#A94B2B] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading
                  ? "Please wait..."
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>

            <p className="text-center text-sm text-[#77746D] mt-8">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="ml-1 text-[#C65D35] font-bold hover:underline"
              >
                {isRegister ? "Sign in" : "Register"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
