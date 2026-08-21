import { ArrowRight, BadgeCheck, CarFront, Phone, Star } from "lucide-react";
import heroSceneBg from "../../public/hero-scene-bg.jpg";
import heroSceneBgMobile from "../../public/hero-scene-bg-mobile.jpg";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#f7f7f7] text-[#171717]">
      {/* Desktop & Laptop Background Image */}
      <div className="absolute inset-0 hidden lg:block">
        <img src={heroSceneBg} alt="" aria-hidden="true" className="h-full w-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-white/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
      </div>

      {/* Mobile & Tablet Background Image */}
      <div className="absolute inset-0 block lg:hidden">
        <img src={heroSceneBgMobile} alt="" aria-hidden="true" className="h-full w-full object-cover object-[center_68%] sm:object-[center_60%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f7f7]/95 via-[#f7f7f7]/85 to-[#f7f7f7]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[460px] max-w-[1240px] flex-col justify-start px-4 pt-7 pb-8 sm:min-h-[500px] sm:px-8 sm:pt-8 sm:pb-12 lg:min-h-[540px] lg:grid lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-14">
        <div className="relative z-10 max-w-xl mt-1 sm:mt-0">
          <p className="mb-2.5 sm:mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#9a7100] sm:text-xs">
            <span className="h-0.5 w-6 bg-[#FFC928]" />
            Trusted Taxi Service in Solapur
          </p>
          <h1 className="mt-1 text-5xl font-extrabold leading-[1.08] tracking-tight xs:text-4xl sm:text-6xl sm:leading-[1.0] lg:text-7xl lg:leading-[.94]">
            Taxi service<br />in <span className="text-[#e6ad00]">Solapur.</span>
          </h1>
          <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-[#444] sm:mt-5 sm:text-base sm:text-[#555]">
            Local rides, outstation trips, airport transfers and temple tours—comfortable travel whenever you need it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
            <a href="#book" className="inline-flex items-center justify-center rounded-lg bg-[#FFC928] px-4 py-3 text-xs font-extrabold text-[#171717] shadow-sm transition hover:bg-[#e6ad00] active:scale-[0.98] xs:text-sm sm:px-5 sm:py-3.5">
              Book your taxi <ArrowRight className="ml-1.5 sm:ml-2" size={16} />
            </a>
            <a href="tel:+918010374300" className="inline-flex items-center justify-center rounded-lg bg-[#171717] px-4 py-3 text-xs font-extrabold text-white transition hover:bg-[#333] active:scale-[0.98] xs:text-sm sm:px-5 sm:py-3.5">
              <Phone className="mr-1.5 sm:mr-2" size={15} />Call now
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-[#1a1717] sm:mt-8 sm:gap-x-5 sm:gap-y-3 sm:text-xs sm:text-[#161414]">
            <span className="inline-flex items-center gap-1.5 shrink-0"><BadgeCheck size={16} className="text-[#e6ad00]" />24×7 available</span>
            <span className="inline-flex items-center gap-1.5 shrink-0"><Star size={16} fill="currentColor" className="text-[#e6ad00]" />4.9 rating</span>
            <span className="inline-flex items-center gap-1.5 shrink-0"><CarFront size={16} className="text-[#e6ad00]" />Clean, sanitised cars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
