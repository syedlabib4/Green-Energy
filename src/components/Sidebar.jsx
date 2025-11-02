import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = ({ isOpen: isOpenProp, onClose: onCloseProp }) => {
  const location = useLocation();
  const { isOpen: isOpenCtx, close } = useSidebar();
  const { darkMode } = useTheme();

  const isOpen = typeof isOpenProp === "boolean" ? isOpenProp : isOpenCtx;
  const onClose = typeof onCloseProp === "function" ? onCloseProp : close;

  const navItem = (to, label) => (
    <Link
      to={to}
      onClick={() => onClose()}
      className={`block px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all duration-300 min-h-[44px] sm:min-h-[40px] flex items-center ${
        location.pathname === to
          ? "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 text-white shadow-lg shadow-emerald-500/50"
          : darkMode
          ? "text-gray-200 hover:bg-gradient-to-r hover:from-emerald-900/30 hover:via-cyan-900/20 hover:to-emerald-900/30 hover:text-emerald-300 border border-transparent hover:border-emerald-500/30"
          : "text-gray-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:via-cyan-50 hover:to-emerald-50 hover:text-emerald-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <aside
        className={`hidden md:flex w-56 lg:w-64 flex-shrink-0 p-4 lg:p-6 flex-col gap-4 lg:gap-6 shadow-md transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
        }`}
        style={{ 
          position: 'fixed',
          top: '5rem',
          left: 0,
          bottom: 0,
          height: 'calc(100vh - 5rem)',
          overflowY: 'auto'
        }}
      >
        <nav className="flex flex-col gap-2">
          {navItem("/dashboard", "🏠 Dashboard")}
          {navItem("/analytics", "📊 Analytics")}
          {navItem("/impact", "🌍 Impact")}
          {navItem("/tips", "💡 Energy Tips")}
          {navItem("/bill-reader", "📷 Bill Reader")}
          {navItem("/solar-checker", "☀️ Solar Checker")}
          {navItem("/ai-advisor", "🤖 AI Advisor")}
        </nav>
      </aside>

      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`w-72 sm:w-80 h-full p-5 sm:p-6 shadow-xl transition-colors overflow-y-auto ${
            darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-md transition-colors duration-200 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItem("/dashboard", "🏠 Dashboard")}
            {navItem("/analytics", "📊 Analytics")}
            {navItem("/impact", "🌍 Impact")}
            {navItem("/tips", "💡 Energy Tips")}
            {navItem("/bill-reader", "📷 Bill Reader")}
            {navItem("/solar-checker", "☀️ Solar Checker")}
            {navItem("/ai-advisor", "🤖 AI Advisor")}
          </nav>
        </div>
      </div>

      {isOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden="false"
          tabIndex={-1}
        />
      )}
    </>
  );
};

export default Sidebar;
