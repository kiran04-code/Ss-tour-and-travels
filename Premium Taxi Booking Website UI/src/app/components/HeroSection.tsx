import { ArrowRight, BadgeCheck, CarFront, Phone, Star } from "lucide-react";
import heroSceneBg from "../../public/hero-scene-bg.jpg";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#f7f7f7] text-[#171717]">
      <div className="absolute  inset-0 hidden lg:block">
        <img src={heroSceneBg} alt="" aria-hidden="true" className="h-full w-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-white/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
      </div>
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-2 px-5 py-12 sm:px-8 lg:min-h-[560px] lg:grid-cols-[.95fr_1.05fr] lg:py-16">
        <div className="relative z-10 max-w-xl">
           <h1 className="mt-4 text-5xl font-extrabold leading-[.94] tracking-tight sm:text-6xl lg:text-7xl">Taxi service<br />in <span className="text-[#e6ad00]">Solapur.</span></h1>
          <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-[#555]">Local rides, outstation trips, airport transfers and temple tours—comfortable travel whenever you need it.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#book" className="inline-flex items-center rounded-lg bg-[#FFC928] px-5 py-3.5 text-sm font-extrabold text-[#171717] shadow-sm transition hover:bg-[#e6ad00]">Book your taxi <ArrowRight className="ml-2" size={17} /></a>
            <a href="tel:+919876543210" className="inline-flex items-center rounded-lg bg-[#171717] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#333]"><Phone className="mr-2" size={16} />Call now</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-[#555]">
            <span className="inline-flex items-center gap-1.5"><BadgeCheck size={17} className="text-[#e6ad00]" />24×7 available</span>
            <span className="inline-flex items-center gap-1.5"><Star size={17} fill="currentColor" className="text-[#e6ad00]" />4.9 rating</span>
            <span className="inline-flex items-center gap-1.5"><CarFront size={17} className="text-[#e6ad00]" />Clean, sanitised cars</span>
          </div>
        </div>
        <div aria-label="Taxi journey through the Solapur hills" role="img" style={{ backgroundImage: `url(${heroSceneBg})` }} className="relative mt-8 h-56 overflow-hidden rounded-2xl bg-cover bg-[62%_center] shadow-[0_18px_40px_rgba(7,29,73,.18)] sm:h-72 lg:hidden" />
      </div>
    </div>
  );
}
