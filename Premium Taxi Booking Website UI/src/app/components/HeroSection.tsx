import { ArrowRight, BadgeCheck, CarFront, Phone, Star } from "lucide-react";
import heroSceneBg from "../../public/hero-scene-bg.jpg";
import innovaHero from "../../public/innova-hero.png";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#f7f7f7] text-[#171717]">
      <img src={heroSceneBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/55" />
      <div className="relative mx-auto grid min-h-[500px] max-w-[1240px] items-center gap-2 px-5 py-12 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:py-16">
        <div className="relative z-10 max-w-xl">
          <p className="flex items-center gap-2 text-xs font-extrabold tracking-[.16em] text-[#8c6b00]"><span className="h-0.5 w-8 bg-[#FFC928]" /> TRUSTED TAXI SERVICE IN SOLAPUR</p>
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
        <div className="relative min-h-[245px] lg:min-h-[390px]">
          <div className="absolute inset-x-4 bottom-4 h-20 rounded-full bg-black/15 blur-2xl" />
          <img src={innovaHero} alt="Toyota Innova available for taxi bookings" className="absolute bottom-0 right-[-5%] z-10 w-[112%] max-w-[720px] object-contain drop-shadow-2xl lg:right-[-10%]" />
        </div>
      </div>
    </div>
  );
}
