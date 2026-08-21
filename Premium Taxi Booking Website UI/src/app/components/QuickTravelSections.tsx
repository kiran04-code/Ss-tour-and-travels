import { ArrowRight, BadgeIndianRupee, CarFront, Clock3, Headphones, ShieldCheck, UserRoundCheck } from "lucide-react";
import type { ReactNode } from "react";

const benefits = [
  [CarFront, "Clean & Sanitized Cars"],
  [UserRoundCheck, "Professional Drivers"],
  [Clock3, "On-Time Pickup"],
  [BadgeIndianRupee, "No Hidden Charges"],
  [Headphones, "24×7 Service"],
  [ShieldCheck, "Safe & Comfortable"],
] as const;

const routes = ["Solapur to Akkalkot", "Solapur to Tuljapur", "Solapur to Pandharpur", "Solapur to Ganagapur", "Solapur to Pune", "Solapur to Mumbai", ];

function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="text-center"><h2 className="text-xl font-extrabold text-[#171717] sm:text-2xl">{children}</h2><span className="mx-auto mt-2 block h-0.5 w-7 bg-[#FFC928]" /></div>;
}

export function QuickTravelSections() {
  return <section className="bg-[#F7F7F7] py-9 sm:py-11"><div className="mx-auto max-w-[1240px] px-5">
    <SectionTitle>Why Choose SS Tours &amp; Travels?</SectionTitle>
    <div className="mt-5 grid overflow-hidden rounded-lg border border-[#E8E8E8] bg-white shadow-sm sm:grid-cols-3 lg:grid-cols-6">
      {benefits.map(([Icon, title], index) => <div key={title} className={`flex min-h-[106px] flex-col items-center justify-center px-3 text-center ${index ? "border-t border-[#E8E8E8] sm:border-l sm:border-t-0 lg:border-t-0" : ""} ${index === 3 ? "sm:border-l-0 lg:border-l" : ""}`}><Icon size={25} strokeWidth={1.9} className="text-[#171717]" /><span className="mt-2 max-w-[100px] text-xs font-semibold leading-4 text-[#444]">{title}</span></div>)}
    </div>
    <div className="mt-9"><SectionTitle>Popular Routes from Solapur</SectionTitle>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {routes.map(route => <a key={route} href="#destinations" className="group flex min-h-11 items-center justify-between rounded-lg border border-[#E8E8E8] bg-white px-4 text-xs font-bold text-[#222] shadow-sm transition hover:-translate-y-0.5 hover:border-[#FFC928]"><span>{route}</span><ArrowRight size={15} className="text-[#555] transition group-hover:text-[#d99f00]" /></a>)}
        <a href="#destinations" className="group flex min-h-11 items-center justify-between rounded-lg bg-[#171717] px-4 text-xs font-bold text-[#FFC928] transition hover:bg-[#333]"><span>View All Routes</span><ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></a>
      </div>
    </div>
  </div></section>;
}
