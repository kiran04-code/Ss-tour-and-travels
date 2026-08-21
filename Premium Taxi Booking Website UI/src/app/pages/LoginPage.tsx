import { ArrowLeft, Eye, EyeOff, LockKeyhole, LogIn, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { isAuthenticated, loginAdmin, verifyClientCredentials } from "../auth";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to admin immediately
  if (isAuthenticated()) {
    window.location.replace("/admin");
    return null;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your admin username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setSubmitting(true);

    const isValid = verifyClientCredentials(username, password);

    if (!isValid) {
      setSubmitting(false);
      setError("Invalid username or password. Please try again.");
      return;
    }

    loginAdmin(username);
    window.location.assign("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071D49] p-4 text-[#071D49]">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F9B900] text-[#071D49] shadow-sm">
            <LockKeyhole size={20} />
          </span>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] transition hover:text-[#071D49]"
          >
            <ArrowLeft size={14} /> Back to website
          </a>
        </div>

        {/* Title */}
        <div className="mt-5">
          <p className="text-[11px] font-bold tracking-[.2em] text-[#9a7100]">
            SS TOURS &amp; TRAVELS
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#071D49] sm:text-3xl">
            Admin Portal Sign In
          </h1>
          <p className="mt-1.5 text-xs text-[#64748B]">
            Enter your credentials to access the quote management dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#475569]">
              Username / ID
            </label>
            <input
              required
              autoFocus
              autoComplete="username"
              value={username}
              placeholder="Enter admin username"
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              className="mt-1.5 w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-3 text-sm font-medium text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white focus:ring-2 focus:ring-[#F9B900]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569]">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                placeholder="Enter password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-3 pr-10 text-sm font-medium text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white focus:ring-2 focus:ring-[#F9B900]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#071D49]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-xl bg-[#FFF2F2] p-3 text-xs font-bold text-[#B42318]">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#071D49] py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#F9B900] hover:text-[#071D49] active:scale-[0.98] disabled:opacity-60"
          >
            <LogIn size={16} /> Sign In to Dashboard
          </button>
        </form>

        <div className="mt-6 border-t border-[#F1F5F9] pt-4 text-center">
          <p className="text-[11px] text-[#94A3B8]">
            Protected Area &bull; SS Tours &amp; Travels Admin Portal
          </p>
        </div>
      </section>
    </main>
  );
}


