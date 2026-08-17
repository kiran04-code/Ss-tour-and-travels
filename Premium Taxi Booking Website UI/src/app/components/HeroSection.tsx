import { ArrowRight, Phone, Star } from "lucide-react";
import heroSceneBg from "../../public/hero-scene-bg.jpg";
import innovaHero from "../../public/innova-hero.png"; 

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
      {/* Scenic background — landscape only, no vehicle */}
      <div className="absolute inset-0">
        <img
          src={heroSceneBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full  object-cover "
        />
      </div>

      {/* Navy gradient overlay for text readability */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,20,.94)_0%,rgba(4,18,40,.82)_32%,rgba(5,26,52,.38)_58%,rgba(7,29,73,.06)_82%,transparent_100%)]" />

      {/* Bottom fade for trust bar */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#020914]/75 to-transparent" />

      {/* Hero layout — single car rendered once in the grid */}
      <div className="relative mx-auto flex min-h-[calc(100vh-78px)] max-w-[1320px] flex-col px-5 pb-32 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid flex-1 grid-cols-1 items-center gap-6 lg:grid-cols-[44%_56%] lg:gap-4">
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
                href={"tel:" }
                className="inline-flex items-center rounded-full border border-white/60 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F9B900] hover:text-[#F9B900]"
              >
                <Phone className="mr-1.5" size={16} />
                Call now
              </a>
            </div>
          </div>

          {/* Right — ONE car only, full vehicle visible */}
        
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
