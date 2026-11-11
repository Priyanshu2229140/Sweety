
import { useState } from "react";

function App() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F1E8] flex items-center justify-center p-5">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#FAF9F5] rounded-2xl overflow-hidden shadow-2xl">

        {/* Branding panel */}
        <div className="hidden md:flex flex-col justify-between bg-[#292824] text-[#F4F1E8] p-12">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
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

          <div>
            <div className="w-10 h-1 bg-[#C65D35] mb-4"></div>
            <p className="text-sm text-[#BDB9AF]">
              Small steps. Healthier habits.
            </p>
          </div>

        </div>

        {/* Authentication panel */}
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

            <p className="text-[#77746D] mt-3 mb-9">
              {isRegister
                ? "Start your health journey with Sweety."
                : "Sign in to continue your health journey."}
            </p>

            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >

              {isRegister && (
                <div>
                  <label className="block text-sm font-semibold text-[#292824] mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-white rounded-lg border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#C65D35] focus:ring-2 focus:ring-[#C65D35]/10"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#292824] mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-white rounded-lg border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#C65D35] focus:ring-2 focus:ring-[#C65D35]/10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#292824] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-white rounded-lg border border-[#DCD7CB] px-4 py-3 outline-none focus:border-[#C65D35] focus:ring-2 focus:ring-[#C65D35]/10"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C65D35] hover:bg-[#A94B2B] text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {isRegister ? "Create account" : "Sign in"}
              </button>

            </form>

            <p className="text-center text-sm text-[#77746D] mt-8">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
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
