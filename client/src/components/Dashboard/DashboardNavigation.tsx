function DashboardNavigation() {
  return (
    <>
      {/* Desktop Sidebar */}
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

      {/* Mobile Navigation */}
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
    </>
  );
}

export default DashboardNavigation;
