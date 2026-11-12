type DashboardHeaderProps = {
  userName: string;
  onLogout: () => void;
};

function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex flex-wrap justify-between items-center gap-5 mb-10">
      <div>
        {/* Sweety Branding */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#292824] flex items-center justify-center">
            <svg
              viewBox="0 0 40 40"
              className="w-7 h-7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Sweety logo"
            >
              <path
                d="M20 3C20 3 7 18 7 25C7 32.18 12.82 37 20 37C27.18 37 33 32.18 33 25C33 18 20 3 20 3Z"
                fill="#C65D35"
              />
              <path
                d="M10 24H16L19 17L23 29L26 23H30"
                stroke="#F4F1E8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide text-[#292824]">
              SWEETY
            </h1>
            <p className="text-[10px] tracking-wider text-[#77746D]">
              BLOOD GLUCOSE TRACKER
            </p>
          </div>
        </div>

        <p className="text-sm text-[#77746D]">YOUR HEALTH OVERVIEW</p>

        <h2 className="text-2xl sm:text-3xl font-bold mt-1">Good morning!</h2>

        <p className="text-sm text-[#77746D] mt-1">
          Here's your glucose summary.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#292824] text-[#F4F1E8] flex items-center justify-center font-semibold">
          {initials || "U"}
        </div>

        <div>
          <p className="font-semibold text-sm">{userName}</p>
          <p className="text-xs text-[#77746D]">Personal account</p>
        </div>

        <button
          onClick={onLogout}
          className="ml-4 rounded-lg bg-[#292824] px-5 py-2 text-sm font-semibold text-[#F4F1E8] shadow-sm transition-all duration-200 hover:bg-[#C65D35] hover:shadow-md active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
