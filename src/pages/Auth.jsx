import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Mail, UserPlus, LogIn, Sparkles, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname === "/signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    setMode(location.pathname === "/signup" ? "signup" : "login");
  }, [location.pathname]);

  const clear = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const u = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(u.user, { displayName: name });
      }
      clear();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace("auth/", ""));
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace("auth/", ""));
      setIsLoading(false);
    }
  };

  if (loading)
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50"
      }`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100"
          : "bg-gradient-to-br from-emerald-50 via-cyan-50 to-emerald-50 text-gray-900"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? "bg-emerald-500" : "bg-emerald-400"
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          darkMode ? "bg-cyan-500" : "bg-cyan-400"
        }`} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl ${
            darkMode 
              ? "bg-gray-900/90 backdrop-blur-xl border border-gray-800/50" 
              : "bg-white/90 backdrop-blur-xl border border-emerald-200/50 shadow-emerald-500/10"
          }`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                darkMode
                  ? "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 shadow-emerald-500/50"
                  : "bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 shadow-emerald-500/30"
              }`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-3xl sm:text-4xl">🌱</span>
            </motion.div>
            <motion.h1
              className={`text-2xl sm:text-3xl font-bold mb-2 ${
                darkMode
                  ? "bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              EcoVolt
            </motion.h1>
            <p className={`text-xs sm:text-sm text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Powering a Greener Pakistan 🇵🇰
            </p>
          </div>

          {/* Mode Toggle */}
          <div className={`flex items-center gap-2 mb-6 rounded-xl p-1.5 ${
            darkMode ? "bg-gray-800/60" : "bg-emerald-50/50"
          }`}>
            {["login", "signup"].map((t) => (
              <motion.button
                key={t}
                onClick={() => {
                  setMode(t);
                  clear();
                  navigate(t === "login" ? "/login" : "/signup", { replace: true });
                }}
                className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] flex items-center justify-center gap-2 ${
                  mode === t
                    ? darkMode
                      ? "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 text-white shadow-lg"
                    : darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
                <span className="text-sm sm:text-base">{t === "login" ? "Login" : "Sign Up"}</span>
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <UserPlus className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm sm:text-base min-h-[48px] ${
                        darkMode
                          ? "bg-gray-800/50 text-gray-100 border-gray-700 placeholder-gray-500 focus:border-emerald-500"
                          : "bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400 focus:border-emerald-500"
                      }`}
                      required
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm sm:text-base min-h-[48px] ${
                      darkMode
                        ? "bg-gray-800/50 text-gray-100 border-gray-700 placeholder-gray-500 focus:border-emerald-500"
                        : "bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400 focus:border-emerald-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm sm:text-base min-h-[48px] ${
                      darkMode
                        ? "bg-gray-800/50 text-gray-100 border-gray-700 placeholder-gray-500 focus:border-emerald-500"
                        : "bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400 focus:border-emerald-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-xl text-sm font-medium text-center ${
                    darkMode
                      ? "bg-red-500/20 border border-red-500/30 text-red-400"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }`}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 sm:py-4 rounded-xl font-semibold text-white transition-all min-h-[48px] text-sm sm:text-base flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : darkMode
                    ? "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
                    : "bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:shadow-lg hover:scale-[1.02]"
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className={`flex-1 h-px ${
              darkMode ? "bg-gray-700" : "bg-gray-300"
            }`} />
            <span className={`text-xs font-medium ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}>OR</span>
            <div className={`flex-1 h-px ${
              darkMode ? "bg-gray-700" : "bg-gray-300"
            }`} />
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogle}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 py-3.5 sm:py-4 rounded-xl border transition-all min-h-[48px] text-sm sm:text-base font-medium ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : darkMode
                ? "border-gray-700 bg-gray-800/50 text-gray-100 hover:bg-gray-700/50 hover:border-gray-600"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
            }`}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            <Mail size={20} />
            <span>Continue with Google</span>
          </motion.button>

          {/* Footer */}
          <div className={`text-center mt-6 text-xs ${
            darkMode ? "text-gray-500" : "text-gray-500"
          }`}>
            By continuing, you agree to our{" "}
            <button className="underline hover:text-emerald-500 transition-colors">Terms</button> &{" "}
            <button className="underline hover:text-emerald-500 transition-colors">Privacy Policy</button>.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
