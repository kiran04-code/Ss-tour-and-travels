import { useEffect, useState } from "react";
import { ArrowRight, Car, Check, Clock3, Headphones, Loader2, Menu, MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, Wind, X } from "lucide-react";
import logo from "../public/logo1.png";
import image1 from "../public/image1.png";
import image2 from "../public/image2.jpg";
import image3 from "../public/image3.png";
import ertigaHero from "../public/ertiga-hero.webp";
import { DestinationsSection } from "./components/DestinationsSection";
const PHONE = "+919876543210";
const cars = [
    { name: "Maruti Dzire", type: "Executive Sedan", seats: "4 passengers", rate: "\u20B912/km", tag: "Popular", img: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1100&q=85" },
    { name: "Maruti Ertiga", type: "Family MPV", seats: "6 passengers", rate: "\u20B914/km", tag: "New", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1100&q=85" },
    { name: "Toyota Innova Crysta", type: "Comfort SUV", seats: "7 passengers", rate: "\u20B918/km", tag: "Best Seller", img: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1100&q=85" }
];
const reviews = [
  [
    "Priya Kulkarni",
    "PK",
    "Solapur → Pandharpur",
    "Innova Crysta",
    "12 Jul 2026",
    "The car was spotless and our driver made the entire darshan trip feel easy and relaxed.",
    5,
  ],
  [
    "Rajesh Patil",
    "RP",
    "Solapur → Pune",
    "Ertiga",
    "28 Jun 2026",
    "Excellent timing, professional driving and clear communication from the booking team.",
    5,
  ],
  [
    "Anita Deshmukh",
    "AD",
    "Solapur Local",
    "Dzire",
    "08 Jun 2026",
    "A genuinely polished local taxi experience. I would happily book SS Tours again.",
    5,
  ],
];
function Logo() { return <a href="#home" className="flex h-16 items-center" aria-label="SS Tours and Travels home"><img src={logo} alt="SS Tours & Travels" className="h-full w-auto max-w-[280px] object-contain object-left" /></a> }
function Stars() { return <span className="inline-flex gap-0.5 text-[#F9B900]">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="currentColor" />)}</span> }
export default function App() {
    const [menu, setMenu] = useState(false), [scrolled, setScrolled] = useState(false), [car, setCar] = useState<typeof cars[0] | null>(null), [review, setReview] = useState(false), [sent, setSent] = useState(false);
    const [quote, setQuote] = useState({ name: "", mobile: "", pickup: "", drop: "", date: "", car: "" });
    const [isSubmitting, setIsSubmitting] = useState(false), [confirmedQuote, setConfirmedQuote] = useState<typeof quote | null>(null);
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const mobile = quote.mobile.replace(/\s|-/g, "");
        if (!/^[6-9]\d{9}$/.test(mobile)) return;
        setIsSubmitting(true);
        const request = { customerName: quote.name.trim(), mobileNumber: mobile, pickupLocation: quote.pickup.trim(), dropLocation: quote.drop.trim(), travelDate: quote.date, preferredCar: quote.car, createdAt: new Date().toISOString() };
        window.setTimeout(() => {
            const saved = JSON.parse(localStorage.getItem("ssToursQuoteRequests") || "[]");
            localStorage.setItem("ssToursQuoteRequests", JSON.stringify([...saved, request]));
            setConfirmedQuote({ ...quote, mobile });
            setIsSubmitting(false);
        }, 700);
    };
    useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll) }, []);
    const links = [["Home", "#home"], ["About Us", "#experience"], ["Our Cars", "#cars"], ["Outstation", "#book"], ["Airport Transfer", "#book"], ["Solapur Local", "#book"], ["Contact", "#contact"]];
    return <div className="min-h-screen overflow-x-hidden bg-[#F7F9FC] text-[#071D49]">
        <header style={{ fontFamily: "Teachers, sans-serif" }} className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/10 bg-[#071D49]/98 shadow-[0_8px_28px_rgba(0,0,0,.22)]" : "border-white/10 bg-[#071D49]/35 backdrop-blur-md"}`}><div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 lg:px-8"><Logo /><nav className="hidden h-full items-center gap-5 xl:flex">{links.map(([l, h], index) => <a key={l} href={h} className={`group relative flex h-full items-center text-[12px] font-semibold tracking-[.02em] transition-colors duration-200 hover:text-[#F9B900] ${index === 0 ? "text-[#F9B900]" : "text-white/80"}`}><span>{l}</span><span className={`absolute bottom-0 left-0 h-0.5 bg-[#F9B900] transition-all duration-300 ${index === 0 ? "w-full" : "w-0 group-hover:w-full"}`} /></a>)}</nav><div className="hidden items-center gap-3 xl:flex"><a href={"tel:" + PHONE} className="flex items-center gap-2 border-r border-white/20 pr-4 text-sm font-bold text-white transition-colors hover:text-[#F9B900]"><Phone size={15} className="text-[#F9B900]" /><span className="text-[#F9B900]">Call Now</span><span className="text-white">+91 98765 43210</span></a><a aria-label="Chat on WhatsApp" href={"https://wa.me/" + PHONE.slice(1)} className="grid h-9 w-9 place-items-center border border-white/30 text-white transition-colors hover:border-[#F9B900] hover:bg-[#F9B900] hover:text-[#071D49]"><MessageCircle size={17} /></a></div><div className="flex items-center gap-3 xl:hidden"><a href={"tel:" + PHONE} aria-label="Call now" className="grid h-9 w-9 place-items-center border border-[#F9B900]/70 text-[#F9B900]"><Phone size={16} /></a><button aria-label={menu ? "Close menu" : "Open menu"} className="grid h-9 w-9 place-items-center border border-white/30 text-white transition-colors hover:border-[#F9B900] hover:text-[#F9B900]" onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <Menu size={20} />}</button></div></div>{menu && <nav className="border-t border-white/10 bg-[#071D49] px-5 pb-5 pt-2 shadow-2xl xl:hidden">{links.map(([l, h], index) => <a onClick={() => setMenu(false)} key={l} href={h} className={`flex items-center justify-between border-b border-white/10 py-3.5 text-sm font-semibold ${index === 0 ? "text-[#F9B900]" : "text-white/80"}`}><span>{l}</span><ArrowRight size={15} className="text-[#F9B900]" /></a>)}<a onClick={() => setMenu(false)} href="#book" className="mt-4 block bg-[#F9B900] px-4 py-3.5 text-center text-sm font-extrabold text-[#071D49]">Book Your Taxi <ArrowRight className="ml-1 inline" size={15} /></a></nav>}</header>
        <main>
            <section id="home" className="relative isolate overflow-hidden bg-[#071D49] pt-[76px] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_86%_27%,#4b86b3_0%,#245276_27%,#0a294b_56%,#020914_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(165deg,transparent_0%,rgba(23,73,49,.72)_42%,#061c28_100%)]" />
                <div className="absolute -right-[8%] bottom-[4%] h-[60%] w-[88%] sm:right-0 sm:h-[68%] sm:w-[73%] lg:bottom-[8%] lg:h-[74%] lg:w-[64%]">
                    <img src={ertigaHero} alt="White premium MPV taxi on a Maharashtra road" className="h-full w-full object-contain object-right-bottom drop-shadow-[0_24px_26px_rgba(0,0,0,.42)]" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,20,.96)_0%,rgba(4,18,40,.84)_34%,rgba(5,26,52,.28)_58%,rgba(7,29,73,.04)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#020914]/75 to-transparent" />
                <div className="relative mx-auto flex min-h-[650px] max-w-[1320px] items-start px-5 pb-28 pt-20 sm:min-h-[680px] sm:pt-24 lg:px-8 lg:pt-32"><div className="max-w-xl"><p className="mb-5 flex items-center gap-3 text-[11px] font-bold tracking-[.22em] text-[#F9B900]"><span className="h-px w-9 bg-[#F9B900]" />SS TOURS &amp; TRAVELS</p><h1 className="text-5xl font-normal leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-7xl">Every journey<br /><span className="text-[#F9B900]">starts here.</span></h1><p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">Reliable rides from Solapur for city travel, outstation trips, airport transfers and temple tours.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#book" className="rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#071D49] transition hover:bg-[#F9B900]">Book your ride <ArrowRight className="ml-1 inline" size={16} /></a><a href={"tel:" + PHONE} className="rounded-full border border-white/60 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#F9B900] hover:text-[#F9B900]"><Phone className="mr-1.5 inline" size={16} />Call now</a></div></div><div className="absolute bottom-8 right-5 hidden items-center gap-6 text-xs text-white/75 lg:flex lg:right-8"><span><Stars /> <b className="ml-2 text-white">4.9/5 rating</b></span><span className="h-5 w-px bg-white/30" /><span><b className="text-[#F9B900]">500+</b> happy customers</span><span className="h-5 w-px bg-white/30" /><span><b className="text-[#F9B900]">24/7</b> available</span></div></div>
                <div id="book" className="relative z-10 mx-auto -mb-12 max-w-[1120px] px-5"><div className="bg-white p-5 shadow-[0_20px_55px_rgba(0,0,0,.22)] sm:p-7">{confirmedQuote ? <div className="py-5 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F9B900]"><Check size={27} /></span><h2 className="mt-4 text-2xl font-extrabold">Quote Request Received!</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#64748B]">Thank you, <b className="text-[#071D49]">{confirmedQuote.name}</b>. Our team will contact you shortly on <b className="text-[#071D49]">{confirmedQuote.mobile}</b>.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><a href={"tel:" + PHONE} className="bg-[#071D49] px-5 py-3 text-sm font-bold text-white"><Phone className="mr-1.5 inline" size={16} />Call Now</a><a href={"https://wa.me/" + PHONE.slice(1)} className="border border-[#071D49] px-5 py-3 text-sm font-bold">WhatsApp</a><button onClick={() => { setConfirmedQuote(null); setQuote({ name: "", mobile: "", pickup: "", drop: "", date: "", car: "" }) }} className="px-4 py-3 text-sm font-bold text-[#64748B]">New request</button></div></div> : <form onSubmit={submit} className="grid gap-4 md:grid-cols-3"><div className="md:col-span-3"><p className="text-xl font-extrabold">Book your taxi</p><p className="mt-1 text-sm text-[#64748B]">Share your journey details and receive a tailored quote.</p></div>{[["name", "Full Name", "text"], ["mobile", "Mobile Number", "tel"], ["pickup", "Pickup Location", "text"], ["drop", "Drop Location", "text"], ["date", "Travel Date", "date"]].map(([n, p, t]) => <label key={n}><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-[#64748B]">{p}</span><input required type={t} name={n} value={quote[n as keyof typeof quote]} onChange={e => setQuote(x => ({ ...x, [n]: e.target.value }))} pattern={n === "mobile" ? "[6-9][0-9]{9}" : undefined} title={n === "mobile" ? "Enter a valid 10-digit Indian mobile number" : undefined} placeholder={n === "mobile" ? "98765 43210" : undefined} className="w-full border-b border-[#CBD5E1] bg-[#F7F9FC] px-3 py-3 text-sm outline-none focus:border-[#F9B900]" /></label>)}<label><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-[#64748B]">Preferred Car</span><select required value={quote.car} onChange={e => setQuote(x => ({ ...x, car: e.target.value }))} className="w-full border-b border-[#CBD5E1] bg-[#F7F9FC] px-3 py-3 text-sm outline-none focus:border-[#F9B900]"><option value="">Select a car</option>{cars.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select></label><button disabled={isSubmitting} className="flex items-center justify-center bg-[#071D49] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={16} />Saving request...</> : <>Get Instant Quote <ArrowRight className="ml-1" size={16} /></>}</button></form>}</div></div>
                <div className="relative mt-12 grid border-t border-white/10 bg-[#051533] text-white sm:grid-cols-5">{[[Clock3, "24/7 Service"], [Users, "Professional Drivers"], [Wind, "Clean Cars"], [Check, "Transparent Pricing"], [ShieldCheck, "Safe Travel"]].map(([I, t]) => { const Icon = I as typeof Clock3; return <div key={t as string} className="flex items-center justify-center gap-2 border-b border-r border-white/10 px-3 py-5 text-xs font-bold"><Icon size={16} className="text-[#F9B900]" />{t}</div> })}</div></section>
            <section id="experience" className="bg-[#F1F5F9] py-20 sm:py-28"><div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8"><div><p className="flex items-center gap-2 text-[11px] font-bold tracking-[.2em] text-[#9a7100]"><span className="h-px w-7 bg-[#F9B900]" />TRAVEL EXPERIENCE</p><h2 className="mt-4 max-w-lg text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">Made for the moments you remember.</h2><p className="mt-5 max-w-md leading-relaxed text-[#64748B]">From family temple visits to weekends away, SS Tours makes every journey feel simple, safe and comfortable for everyone onboard.</p><div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">{[["14+", "Years of trust"], ["25k+", "Happy journeys"], ["24/7", "Travel support"]].map(([n, l]) => <div key={l} className="border-l-2 border-[#F9B900] pl-3"><b className="block text-xl font-extrabold sm:text-2xl">{n}</b><span className="mt-1 block text-[11px] leading-tight text-[#64748B]">{l}</span></div>)}</div><a href="#book" className="mt-9 inline-block bg-[#071D49] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49]">Plan your next trip <ArrowRight className="ml-1 inline" size={16} /></a></div><div className="grid grid-cols-2 gap-3 sm:gap-4"><figure className="relative col-span-2 overflow-hidden sm:col-span-1 sm:row-span-2"><img className="h-[300px] w-full object-cover sm:h-[490px]" src={image1} alt="Happy family travelling together" /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071D49]/90 to-transparent px-5 pb-5 pt-14 text-white"><p className="text-[10px] font-bold tracking-[.16em] text-[#F9B900]">FAMILY TIME</p><p className="mt-1 text-lg font-boWhat Our Customers Sayld">More smiles, less planning.</p></figcaption></figure><figure className="relative overflow-hidden"><img className="h-[175px] w-full object-cover sm:h-[237px]" src={image2} alt="Friends enjoying a day out" /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-sm font-bold text-white">Days worth sharing</figcaption></figure><figure className="relative overflow-hidden"><img className="h-[175px] w-full object-cover sm:h-[237px]" src={image3} alt="Family enjoying a scenic trip" /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-sm font-bold text-white">Comfort for every generation</figcaption></figure></div></div></section>
            <section id="cars" className="bg-white py-24"><div className="mx-auto max-w-[1320px] px-5 lg:px-8"><div className="text-center"><p className="text-[11px] font-bold tracking-[.2em] text-[#9a7100]">OUR FLEET</p><h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Choose your kind of comfort.</h2></div><div className="mt-12 grid gap-6 lg:grid-cols-3">{cars.map(c => <article key={c.name} className="group border border-[#DDE4EF] bg-[#F7F9FC] p-3 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"><div className="relative overflow-hidden"><img className="h-60 w-full object-cover transition duration-700 group-hover:scale-105" src={c.img} alt={c.name} /><b className="absolute left-3 top-3 bg-[#F9B900] px-3 py-1 text-[10px] tracking-[.15em]">{c.tag}</b></div><div className="p-4"><div className="flex items-center justify-between"><p className="text-xs font-bold tracking-[.14em] text-[#64748B]">{c.type}</p><span><Stars /> <b className="text-xs">4.9</b></span></div><h3 className="mt-2 text-2xl font-extrabold">{c.name}</h3><div className="mt-4 flex justify-between border-y border-[#E2E8F0] py-3 text-sm text-[#64748B]"><span><Users className="mr-1 inline text-[#F9B900]" size={15} />{c.seats}</span><b className="text-[#071D49]">{c.rate}</b></div><div className="mt-4 flex gap-3"><button onClick={() => setCar(c)} className="flex-1 border border-[#071D49] py-2.5 text-xs font-bold">View Details</button><button onClick={() => setCar(c)} className="flex-1 bg-[#071D49] py-2.5 text-xs font-bold text-white">Book Now</button></div></div></article>)}</div></div></section>
            <DestinationsSection />
          <section
  id="reviews"
  className="relative mx-auto max-w-[1320px] px-5 py-24 lg:px-8"
>
  {/* Header */}
  <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
    <div>
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-[#F9B900]" />
        <p className="text-[11px] font-bold tracking-[0.22em] text-[#9a7100]">
          CUSTOMER FEEDBACK
        </p>
      </div>

      <h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-[#071D49] sm:text-5xl">
        What Our Customers Say
      </h2>

      <p className="mt-4 max-w-xl text-sm leading-6 text-[#64748B]">
        Real experiences from customers who trusted us with their journey.
      </p>
    </div>

    {/* Rating + CTA */}
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-[#071D49]">
              4.9
            </span>

            <span className="text-[#64748B]">/5</span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <div className="flex gap-0.5 text-[#F9B900]">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>★</span>
              ))}
            </div>

            <span className="text-xs text-[#64748B]">
              120+ reviews
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setReview(true);
          setSent(false);
        }}
        className="group inline-flex items-center border border-[#071D49] bg-[#071D49] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#F9B900] hover:text-[#071D49]"
      >
        Write a Review
        <ArrowRight
          className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
          size={16}
        />
      </button>
    </div>
  </div>

  {/* Reviews */}
  <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {reviews.map(([name, initial, rating, category, date, text]) => (
      <article
        key={name}
        className="group relative overflow-hidden border border-[#DDE4EF] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#F9B900] hover:shadow-[0_18px_45px_rgba(7,29,73,0.10)]"
      >
        {/* Top accent */}
        <div className="absolute left-0 top-0 h-1 w-0 bg-[#F9B900] transition-all duration-300 group-hover:w-full" />

        {/* Customer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF4CC] text-sm font-extrabold text-[#071D49]">
              {initial}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <b className="text-sm text-[#071D49]">
                  {name}
                </b>

                <span className="rounded-full bg-[#EEF7F1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#26734D]">
                  Verified
                </span>
              </div>

              <p className="mt-1 text-xs text-[#94A3B8]">
                {date}
              </p>
            </div>
          </div>

          {/* Quote */}
          <span className="text-4xl font-serif leading-none text-[#E8EDF5]">
            “
          </span>
        </div>

        {/* Rating */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-0.5 text-[#F9B900]">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-sm">
                ★
              </span>
            ))}
          </div>

          <span className="rounded-full border border-[#DDE4EF] px-3 py-1 text-[10px] font-semibold text-[#64748B]">
            {category}
          </span>
        </div>

        {/* Review */}
        <p className="mt-5 text-[14px] leading-7 text-[#475569]">
          “{text}”
        </p>

        {/* Bottom */}
        <div className="mt-7 border-t border-[#E8EDF5] pt-4">
          <span className="text-xs font-semibold text-[#071D49]">
            {rating} Rating
          </span>
        </div>
      </article>
    ))}
  </div>
</section>
        </main>
        <footer id="contact" className="bg-[#051533] px-5 py-10 text-white"><div className="mx-auto grid max-w-[1320px] gap-8 sm:grid-cols-2 lg:grid-cols-4"><div><Logo /><p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">Reliable local and outstation rides from Solapur, whenever you need to travel.</p></div><div><p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">SERVICES</p><div className="mt-3 grid gap-2 text-sm text-white/60"><span>Local travel</span><span>Outstation trips</span><span>Airport transfers</span><span>Temple tours</span></div></div><div><p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">CONTACT</p><a className="mt-3 block text-lg font-extrabold text-white" href={"tel:" + PHONE}>+91 98765 43210</a><a className="mt-2 inline-block text-sm text-white/60 hover:text-[#F9B900]" href={"https://wa.me/" + PHONE.slice(1)}>Chat on WhatsApp</a></div><div><p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">AVAILABLE</p><p className="mt-3 text-sm leading-relaxed text-white/60">24/7 booking support<br />Solapur, Maharashtra</p><a href="#book" className="mt-4 inline-block border border-white/30 px-4 py-2 text-xs font-bold hover:border-[#F9B900] hover:text-[#F9B900]">Request a quote</a></div></div><div className="mx-auto mt-8 max-w-[1320px] border-t border-white/10 pt-4 text-xs text-white/40">ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© 2026 SS Tours &amp; Travels. All rights reserved.</div></footer>
        {car && <div className="fixed inset-0 z-[60] grid place-items-center bg-[#071D49]/75 p-4"><div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-white shadow-2xl"><button onClick={() => setCar(null)} className="float-right p-4"><X /></button><div className="grid md:grid-cols-2"><img src={car.img} alt={car.name} className="h-72 w-full object-cover md:h-full" /><div className="p-7"><p className="text-xs font-bold tracking-[.16em] text-[#9a7100]">{car.tag} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {car.type}</p><h2 className="mt-2 text-3xl font-extrabold">{car.name}</h2><div className="mt-3"><Stars /> <b className="ml-2">4.9 rating</b></div><p className="mt-4 text-2xl font-extrabold text-[#071D49]">{car.rate}</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm text-[#64748B]">{[car.seats, "Air Conditioned", "2 large bags", "Music system", "Verified driver", "Safety checked"].map(x => <span key={x} className="border-l-2 border-[#F9B900] pl-2">{x}</span>)}</div><p className="mt-5 text-sm leading-relaxed text-[#64748B]">Comfortable seating, responsible driving and a local professional who knows the route.</p><div className="mt-6 flex flex-wrap gap-2"><a href="#book" onClick={() => setCar(null)} className="bg-[#F9B900] px-4 py-3 text-sm font-bold">Book This Car</a><a href={"tel:" + PHONE} className="bg-[#071D49] px-4 py-3 text-sm font-bold text-white">Call Now</a><a href={"https://wa.me/" + PHONE.slice(1)} className="border border-[#071D49] px-4 py-3 text-sm font-bold">WhatsApp</a></div><p className="mt-6 border-t pt-4 text-xs text-[#64748B]">Vehicle-specific guest feedback: <b>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œSmooth, comfortable and on time.ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â</b></p></div></div></div></div>}
        {review && <div className="fixed inset-0 z-[70] grid place-items-center bg-[#071D49]/75 p-4"><div className="w-full max-w-md bg-white p-7 shadow-2xl"><button onClick={() => setReview(false)} className="float-right"><X /></button>{sent ? <div className="py-10 text-center"><span className="inline-grid h-14 w-14 place-items-center rounded-full bg-[#F9B900]"><Check /></span><h2 className="mt-5 text-2xl font-extrabold">Thank you for sharing.</h2><p className="mt-2 text-sm text-[#64748B]">Your review has been received.</p><button onClick={() => setReview(false)} className="mt-6 bg-[#071D49] px-5 py-3 text-sm font-bold text-white">Close</button></div> : <form onSubmit={e => { e.preventDefault(); setSent(true) }}><p className="text-xs font-bold tracking-[.18em] text-[#9a7100]">YOUR EXPERIENCE</p><h2 className="mt-2 text-2xl font-extrabold">Write a Review</h2><label className="mt-5 block text-xs font-bold">Name<input required className="mt-2 w-full border-b p-3 outline-none focus:border-[#F9B900]" /></label><div className="mt-5"><p className="text-xs font-bold">Star Rating</p><div className="mt-2"><Stars /></div></div><label className="mt-5 block text-xs font-bold">Your Experience<textarea required className="mt-2 h-24 w-full border p-3 text-sm outline-none focus:border-[#F9B900]" /></label><button className="mt-5 w-full bg-[#071D49] py-3 text-sm font-bold text-white">Submit Review</button></form>}</div></div>}
        <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 lg:hidden"><a href={"tel:" + PHONE} className="bg-[#F9B900] py-3 text-center text-xs font-extrabold">Call Now</a><a href="#book" className="bg-[#071D49] py-3 text-center text-xs font-extrabold text-white">Book a Ride</a></div></div>
}
