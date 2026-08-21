import { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, DEMO_CREDENTIALS } from "../auth";

export function LoginPage() {
  const [username, setUsername] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [error, setError] = useState("");
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (username.trim() !== DEMO_CREDENTIALS.username || email.trim().toLowerCase() !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      setError("Incorrect username, email, or password.");
      return;
    }
    localStorage.setItem(AUTH_TOKEN_KEY, "demo-token-ss-tours-2026");
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ username: DEMO_CREDENTIALS.username, email: DEMO_CREDENTIALS.email }));
    window.location.assign("/dashboard");
  }
  return <main className="grid min-h-screen place-items-center bg-[#F7F9FC] p-5 text-[#071D49]"><section className="w-full max-w-md border border-[#DDE4EF] bg-white p-7 shadow-[0_20px_55px_rgba(7,29,73,.12)] sm:p-9"><span className="grid h-12 w-12 place-items-center bg-[#F9B900]"><LockKeyhole size={22} /></span><p className="mt-6 text-[10px] font-bold tracking-[.2em] text-[#9a7100]">OWNER PORTAL</p><h1 className="mt-2 text-3xl font-extrabold">Sign in</h1><p className="mt-2 text-sm text-[#64748B]">Use the demo credentials to access the dashboard.</p><form onSubmit={submit} className="mt-7 grid gap-4"><label className="text-xs font-bold">Username<input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1.5 w-full border border-[#CBD5E1] px-3 py-3 text-sm font-normal outline-none focus:border-[#F9B900]" /></label><label className="text-xs font-bold">Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full border border-[#CBD5E1] px-3 py-3 text-sm font-normal outline-none focus:border-[#F9B900]" /></label><label className="text-xs font-bold">Password<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full border border-[#CBD5E1] px-3 py-3 text-sm font-normal outline-none focus:border-[#F9B900]" /></label>{error && <p role="alert" className="text-sm font-semibold text-[#B42318]">{error}</p>}<button className="mt-2 inline-flex items-center justify-center gap-2 bg-[#071D49] px-4 py-3.5 text-sm font-extrabold text-white hover:bg-[#F9B900] hover:text-[#071D49]"><LogIn size={16} /> Login</button></form><div className="mt-6 border-t border-[#E8EDF5] pt-4 text-xs leading-6 text-[#64748B]"><b className="text-[#071D49]">Demo login:</b><br />Username: admin<br />Email: admin@sstours.in<br />Password: Admin@123</div></section></main>;
}
