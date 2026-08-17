import { ArrowRight, Phone, Star } from "lucide-react";
import heroBackground from "../../public/hero-background.png";
import innovaHero from "../../public/innova-hero.png";

const PHONE = "+919876543210";

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[#F9B900]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} fill="currentColor" />
      ))}
    </span>
  );
}

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Scenic background */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-[center_center]"
        />
      </div>

      {/* Navy gradient overlay — left to right */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,20,.97)_0%,rgba(4,18,40,.88)_30%,rgba(5,26,52,.45)_55%,rgba(7,29,73,.08)_78%,transparent_100%)]" />

      {/* Bottom fade for trust bar legibility */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020914]/80 via-[#020914]/30 to-transparent" />

      {/* Vehicle showcase — desktop/tablet right column */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[58%] items-end justify-end sm:flex lg:w-[55%]"
        aria-hidden="true"
      >
        <img
          src={innovaHero}
          alt=""
          className="max-h-[88%] w-full max-w-[920px] translate-y-[-2%] object-contain object-right-bottom drop-shadow-[0_28px_32px_rgba(0,0,0,.45)] lg:max-h-[92%] lg:translate-y-[-4%]"
        />
      </div>

      {/* Main hero content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-78px)] max-w-[1320px] flex-col px-5 pb-32 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-20">
        <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-[44%_56%] lg:gap-0">
          {/* Left — copy & CTAs */}
          <div className="relative z-10 max-w-xl">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-bold tracking-[.22em] text-[#F9B900]">
              <span className="h-px w-9 bg-[#F9B900]" />
              SS TOURS &amp; TRAVELS
            </p>

            <h1 className="text-[2.65rem] font-normal leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-[4.25rem] xl:text-7xl">
              Every journey
              <br />
              <span className="text-[#F9B900]">starts here.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-white/82 sm:mt-6 sm:text-lg">
              Reliable rides from Solapur for city travel, outstation trips,
              airport transfers and temple tours.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
              <a
                href="#book"
                className="inline-flex items-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#071D49] shadow-[0_8px_24px_rgba(0,0,0,.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F9B900] hover:shadow-[0_12px_28px_rgba(249,185,0,.25)]"
              >
                Book your ride
                <ArrowRight className="ml-1.5" size={16} />
              </a>
              <a
                href={"tel:" + PHONE}
                className="inline-flex items-center rounded-full border border-white/60 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F9B900] hover:text-[#F9B900]"
              >
                <Phone className="mr-1.5" size={16} />
                Call now
              </a>
            </div>
          </div>

          {/* Mobile / small tablet — full vehicle below copy */}
          <div
            className="relative z-[1] flex min-h-[220px] items-end justify-center sm:min-h-[280px] lg:hidden"
          >
            <img
              src={innovaHero}
              alt="White Toyota Innova Crysta premium taxi"
              className="w-full max-w-[520px] object-contain object-bottom drop-shadow-[0_20px_28px_rgba(0,0,0,.42)] sm:max-w-[620px]"
            />
          </div>
        </div>

        {/* Trust bar */}
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-6 text-xs text-white/78 sm:gap-x-6 sm:text-sm lg:absolute lg:inset-x-8 lg:bottom-8 lg:border-t-0 lg:pt-0">
          <span className="inline-flex items-center gap-2">
            <Stars />
            <b className="text-white">4.9/5 rating</b>
          </span>
          <span className="hidden h-5 w-px bg-white/30 sm:block" aria-hidden="true" />
          <span>
            <b className="text-[#F9B900]">500+</b> happy customers
          </span>
          <span className="hidden h-5 w-px bg-white/30 sm:block" aria-hidden="true" />
          <span>
            <b className="text-[#F9B900]">24/7</b> available
          </span>
        </div>
      </div>
    </div>
  );
}
