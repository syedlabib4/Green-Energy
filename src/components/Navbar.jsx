import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useSidebar } from "../contexts/SidebarContext";
import { 
  Moon, 
  Sun, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { toggle, isOpen } = useSidebar();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between h-16 md:h-20 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 backdrop-blur-xl border-b border-gray-800/50"
          : "bg-white backdrop-blur-xl border-b border-gray-200/50"
      }`}
      style={{
        boxShadow: darkMode
          ? "0 4px 20px rgba(0, 0, 0, 0.3)"
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Left Section: Menu + Logo */}
      <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6">
        {/* Mobile Menu Button - Hidden on desktop (md and above) */}
        <button
          onClick={toggle}
          className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
            darkMode
              ? "hover:bg-gray-800 text-gray-300 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Logo/Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 group transition-transform duration-200 hover:scale-[1.02]"
        >
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${
                  darkMode
                    ? "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600"
                    : "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600"
                } shadow-lg shadow-emerald-500/50 group-hover:shadow-xl group-hover:shadow-emerald-500/70 transition-all duration-300 group-hover:scale-110`}
              >
            <span className="text-lg sm:text-xl">🌱</span>
          </div>
          <div className="flex flex-col">
              <span
                className={`text-lg sm:text-xl font-bold tracking-tight ${
                  darkMode
                    ? "bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg"
                    : "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent"
                }`}
              >
              EcoVolt
            </span>
            <span
              className={`hidden sm:block text-[10px] font-medium tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Powering a Greener Pakistan
            </span>
          </div>
        </Link>
      </div>

      {/* Right Section: Actions + User */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-4 md:px-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`relative p-2 sm:p-2.5 rounded-lg transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center ${
            darkMode
              ? "hover:bg-gray-800 text-yellow-400 hover:text-yellow-300"
              : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
          }`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          <motion.div
            animate={{ rotate: darkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.div>
        </button>

        {user ? (
          /* User Menu */
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 ${
                darkMode
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-100"
              } ${userMenuOpen ? (darkMode ? "bg-gray-800" : "bg-gray-100") : ""}`}
              aria-label="User menu"
            >
              {/* User Avatar */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-semibold text-sm ${
                      darkMode
                        ? "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50"
                        : "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40"
                    }`}
                  >
                {getUserInitials()}
              </div>
              
              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:block text-left">
                <div
                  className={`text-sm font-semibold ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {user.displayName || user.email?.split("@")[0] || "User"}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.email}
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  userMenuOpen ? "rotate-180" : ""
                } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              />
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-64 sm:max-w-none sm:w-64 rounded-xl shadow-xl border overflow-hidden z-50 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                  style={{
                    boxShadow: darkMode
                      ? "0 10px 40px rgba(0, 0, 0, 0.4)"
                      : "0 10px 40px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {/* User Info Header */}
                  <div
                    className={`px-4 py-3 border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                              darkMode
                                ? "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40"
                                : "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                            }`}
                          >
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-semibold truncate ${
                            darkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {user.displayName || "User"}
                        </div>
                        <div
                          className={`text-xs truncate ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 min-h-[44px] ${
                            location.pathname === "/dashboard"
                              ? darkMode
                                ? "bg-gradient-to-r from-emerald-600/30 to-cyan-600/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
                                : "bg-gradient-to-r from-emerald-100 to-cyan-50 text-emerald-700 border border-emerald-300/50 shadow-md"
                              : darkMode
                              ? "text-gray-300 hover:bg-gradient-to-r hover:from-emerald-900/20 hover:to-cyan-900/20 hover:text-emerald-300 border border-transparent hover:border-emerald-500/20"
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-cyan-50 hover:text-emerald-700"
                          }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>

                    <div
                      className={`my-1 h-px ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    />

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors min-h-[44px] ${
                darkMode
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Login Button */
              <Link
                to="/login"
                className={`flex items-center gap-2 px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all duration-300 min-h-[44px] ${
                  darkMode
                    ? "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60"
                    : "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50"
                } hover:scale-105 active:scale-95`}
              >
            <Zap className="w-4 h-4" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
