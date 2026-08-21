import { ArrowLeft, KeyRound, LockKeyhole, LogIn, Sparkles } from "lucide-react";
import { useState } from "react";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, DEMO_CREDENTIALS } from "../auth";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fillDemo = () => {
    setUsername(DEMO_CREDENTIALS.username);
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  };

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const validUser =
      username.trim().toLowerCase() === DEMO_CREDENTIALS.username.toLowerCase() ||
      username.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase();
    const validEmail =
      !email || email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase();
    const validPass = password === DEMO_CREDENTIALS.password;

    if (!validUser || !validPass) {
      setError("Incorrect credentials. Click 'Auto-Fill Demo' below.");
      return;
    }

    localStorage.setItem(AUTH_TOKEN_KEY, "demo-token-ss-tours-2026");
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({
        username: DEMO_CREDENTIALS.username,
        email: DEMO_CREDENTIALS.email
      })
    );
    window.location.assign("/admin");
  }

  return (
    <main className="flex h-[100dvh] min-h-[100dvh] max-h-[100dvh] items-center justify-center overflow-hidden bg-[#F7F9FC] p-3 text-[#071D49] sm:p-5">
      <section className="w-full max-w-sm rounded-2xl border border-[#DDE4EF] bg-white p-5 shadow-[0_15px_45px_rgba(7,29,73,0.1)] sm:max-w-md sm:p-7">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#F9B900] text-[#071D49]">
            <LockKeyhole size={18} />
          </span>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] transition hover:text-[#071D49]"
          >
            <ArrowLeft size={13} /> Back to website
          </a>
        </div>

        {/* Title */}
        <div className="mt-3 sm:mt-4">
          <p className="text-[10px] font-bold tracking-[.18em] text-[#9a7100]">
            OWNER PORTAL
          </p>
          <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#071D49] sm:text-3xl">
            Sign in
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="mt-4 space-y-2.5 sm:space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[#475569]">
              Username
            </label>
            <input
              required
              autoComplete="username"
              value={username}
              placeholder="admin"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-normal text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white sm:py-2.5 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#475569]">
              Password
            </label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-normal text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white sm:py-2.5 sm:text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs font-bold text-[#B42318]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#071D49] py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#F9B900] hover:text-[#071D49] active:scale-[0.98] sm:py-3 sm:text-sm"
          >
            <LogIn size={15} /> Login to Dashboard
          </button>
        </form>

        {/* Auto-fill 1-click helper */}
        <div className="mt-3.5 border-t border-[#F1F5F9] pt-3 text-center sm:mt-4 sm:pt-3.5">
          <button
            type="button"
            onClick={fillDemo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#F9B900]/60 bg-[#FFFDF5] px-3 py-1.5 text-[11px] font-extrabold text-[#805F00] transition hover:bg-[#FFF4CC] active:scale-95"
          >
            <Sparkles size={12} className="text-[#F9B900]" /> 1-Click Auto-Fill Demo Login
          </button>

          <p className="mt-1.5 text-[10px] text-[#94A3B8]">
            User: <b className="text-[#475569]">admin</b> &nbsp;|&nbsp; Pass: <b className="text-[#475569]">Admin@123</b>
          </p>
        </div>
      </section>
    </main>
  );
}

