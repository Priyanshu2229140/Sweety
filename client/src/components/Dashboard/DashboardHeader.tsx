type DashboardHeaderProps = {
  userName: string;
  onLogout: () => void;
};

function DashboardHeader({ userName, onLogout }: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-10">
      <div>
        <p className="text-sm text-[#77746D]">YOUR HEALTH OVERVIEW</p>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1">Good morning!</h2>
        <p className="text-sm text-[#77746D] mt-1">
          Here's your glucose summary.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#292824] text-[#F4F1E8] flex items-center justify-center font-semibold">
          DU
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
