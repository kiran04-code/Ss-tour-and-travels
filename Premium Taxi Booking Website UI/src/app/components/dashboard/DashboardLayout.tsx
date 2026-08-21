import { ArrowLeft, CarFront, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "../../auth";
import { GalleryManager } from "./GalleryManager";

export function DashboardLayout({
  title,
  eyebrow = "OWNER PORTAL",
  showGalleryManager = true,
  children
}: {
  title: string;
  eyebrow?: string;
  showGalleryManager?: boolean;
  children: ReactNode;
}) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isDashboard = currentPath.startsWith("/dashboard");

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#071D49]">
      <header className="bg-[#071D49] text-white shadow-md">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-3">
            <a href="/admin" className="flex items-center gap-2.5 text-sm font-extrabold tracking-wide">
              <span className="grid h-9 w-9 place-items-center rounded bg-[#F9B900] text-[#071D49] shadow-sm">
                <CarFront size={19} />
              </span>
              SS TOURS &amp; TRAVELS
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {isDashboard ? (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F9B900] px-3.5 py-1.5 text-xs font-extrabold text-[#071D49] shadow-sm transition hover:bg-[#e6ad00]"
              >
                <ArrowLeft size={14} /> Go back to Admin page
              </a>
            ) : (
              <a
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition hover:border-[#F9B900] hover:bg-[#F9B900] hover:text-[#071D49]"
              >
                <CarFront size={14} /> Cars &amp; Fleet Manager
              </a>
            )}

            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 transition hover:text-[#F9B900]"
            >
              <ArrowLeft size={14} /> Back to website
            </a>

            <button
              onClick={() => {
                signOut();
                window.location.assign("/login");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-bold text-white/75 transition hover:border-[#F9B900] hover:text-[#F9B900]"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1320px] px-5 py-8 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[.2em] text-[#9a7100]">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          </div>
          {isDashboard && (
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#071D49] underline underline-offset-4 hover:text-[#9a7100]"
            >
              <ArrowLeft size={13} /> Return to Admin Lead Manager
            </a>
          )}
        </div>
        {children}
        {showGalleryManager && <GalleryManager />}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) { const colors: Record<string, string> = { available: "bg-[#EEF7F1] text-[#26734D]", sold: "bg-[#FFF0F0] text-[#B42318]", inactive: "bg-[#F1F5F9] text-[#64748B]", new: "bg-[#FFF4CC] text-[#805F00]", contacted: "bg-[#EAF2FF] text-[#2457A6]", quoted: "bg-[#F0EAFE] text-[#6941C6]", closed: "bg-[#F1F5F9] text-[#64748B]" }; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${colors[status] || colors.inactive}`}>{status}</span>; }

export function LoadingState() { return <div className="border border-[#DDE4EF] bg-white p-10 text-center text-sm text-[#64748B]">Loading...</div>; }
export function ErrorState({ message }: { message: string }) { return <div className="border border-[#F4B5B5] bg-[#FFF7F7] p-5 text-sm text-[#B42318]">{message}</div>; }
