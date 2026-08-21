import { Instagram } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/sstoursandtravels_solapur?igsi=bmgzcnlrcjA3aDlu";
const INSTAGRAM_HANDLE = "@sstoursandtravels_solapur";

export function SocialLinks() {
  return (
    <div>
      <p className="text-xs font-extrabold tracking-[.18em] text-[#F9B900]">
        FOLLOW US ON INSTAGRAM
      </p>
      <div className="mt-3.5 flex items-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow SS Tours & Travels on Instagram"
          className="group inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E1306C] hover:bg-gradient-to-r hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white hover:shadow-[0_8px_25px_rgba(225,48,108,0.35)]"
        >
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
            <Instagram size={16} />
          </div>
          <span className="text-xs font-extrabold tracking-wide text-white/95">
            {INSTAGRAM_HANDLE}
          </span>
        </a>
      </div>
    </div>
  );
}

