import { useEffect, useState } from "react";
import { ArrowRight, Car, Check, Clock3, Headphones, Loader2, Menu, MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, Wind, X } from "lucide-react";
import logo from "../public/logo1.png";
import image1 from "../public/image1.png";
import image2 from "../public/image2.jpg";
import image3 from "../public/image3.png";
import { DestinationsSection } from "./components/DestinationsSection";
import { FleetCard, type FleetCar } from "./components/FleetCard";
import { HeroSection } from "./components/HeroSection";
import { GallerySection } from "./components/GallerySection";
import { GoogleReviewsSection, OfficeLocationSection } from "./components/BusinessSections";
import { SocialLinks } from "./components/SocialLinks";
import { QuickTravelSections } from "./components/QuickTravelSections";
import { OperationsRouter } from "./OperationsRouter";
import { carApi } from "../api/carApi";
import { quoteApi } from "../api/quoteApi";
import type { Car as DatabaseCar } from "../api/types";
const PHONE = "+919876543210";
const WHATSAPP_PHONE = "9197774025744";
function toFleetCar(car: DatabaseCar): FleetCar {
  return { id: car._id, name: car.name, type: `${car.brand} · ${car.model}`, seats: `${car.fuelType} · ${car.transmission}`, tag: "DB Listing", img: car.images[0] || "", status: car.status };
}
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
    const [menu, setMenu] = useState(false), [scrolled, setScrolled] = useState(false), [car, setCar] = useState<FleetCar | null>(null), [review, setReview] = useState(false), [sent, setSent] = useState(false);
    const [cars, setCars] = useState<FleetCar[]>([]), [fleetLoading, setFleetLoading] = useState(true), [fleetError, setFleetError] = useState("");
    const [quote, setQuote] = useState({ name: "", mobile: "", email: "", pickup: "", drop: "", date: "", car: "" });
    const [isSubmitting, setIsSubmitting] = useState(false), [confirmedQuote, setConfirmedQuote] = useState<typeof quote | null>(null), [quoteError, setQuoteError] = useState("");
    useEffect(() => { carApi.getCars({ limit: 50 }).then((result) => setCars(result.items.map(toFleetCar))).catch((error: Error) => setFleetError(error.message)).finally(() => setFleetLoading(false)); }, []);
    if (window.location.pathname !== "/" && window.location.pathname !== "") return <OperationsRouter />;
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const submissionChannel = submitter?.value === "whatsapp" ? "whatsapp" : "website";
        // Opening the window directly from the button interaction prevents popup blockers
        // from blocking the WhatsApp page after the API request completes.
        const whatsappWindow = submissionChannel === "whatsapp" ? window.open("", "_blank") : null;
        const mobile = quote.mobile.replace(/\s|-/g, "");
        if (!/^[6-9]\d{9}$/.test(mobile)) { whatsappWindow?.close(); return; }
        const selectedCar = cars.find((item) => item.id === quote.car);
        if (!selectedCar?.id) { whatsappWindow?.close(); setQuoteError("Please select an available car before sending your request."); return; }
        setIsSubmitting(true);
        setQuoteError("");
        try {
            const submittedQuote = await quoteApi.createQuote({
                carId: selectedCar.id,
                customerName: quote.name.trim(),
                customerPhone: mobile,
                customerEmail: quote.email.trim(),
                message: `Taxi journey: ${quote.pickup.trim()} to ${quote.drop.trim()} on ${quote.date}. Preferred car: ${selectedCar.name}.`,
                preferredContactMethod: submissionChannel === "whatsapp" ? "whatsapp" : "phone",
            });
            if (submissionChannel === "whatsapp") {
                if (!submittedQuote.whatsappUrl) throw new Error("WhatsApp requests are not configured. Please use Send via Website instead.");
                if (whatsappWindow) { whatsappWindow.opener = null; whatsappWindow.location.href = submittedQuote.whatsappUrl; }
                else window.open(submittedQuote.whatsappUrl, "_blank", "noopener,noreferrer");
            }
            setConfirmedQuote({ ...quote, mobile });
        } catch (error) {
            whatsappWindow?.close();
            setQuoteError((error as Error).message || "We could not send your quote request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll) }, []);
    const links = [["Home", "#home"], ["About Us", "#experience"], ["Our Cars", "#cars"], ["Outstation", "#book"], ["Airport Transfer", "#book"], ["Solapur Local", "#book"], ["Contact", "#contact"]];
    return <div className="min-h-screen overflow-x-hidden bg-[#F7F9FC] text-[#071D49]">
        <header style={{ fontFamily: "Teachers, sans-serif" }} className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/10 bg-[#071D49]/98 shadow-[0_8px_28px_rgba(0,0,0,.22)]" : "border-white/10 bg-[#071D49]/35 backdrop-blur-md"}`}><div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 lg:px-8"><Logo /><nav className="hidden h-full items-center gap-5 xl:flex">{links.map(([l, h], index) => <a key={l} href={h} className={`group relative flex h-full items-center text-[12px] font-semibold tracking-[.02em] transition-colors duration-200 hover:text-[#F9B900] ${index === 0 ? "text-[#F9B900]" : "text-white/80"}`}><span>{l}</span><span className={`absolute bottom-0 left-0 h-0.5 bg-[#F9B900] transition-all duration-300 ${index === 0 ? "w-full" : "w-0 group-hover:w-full"}`} /></a>)}</nav><div className="hidden items-center gap-3 xl:flex"><a href={"tel:" + PHONE} className="flex items-center gap-2 border-r border-white/20 pr-4 text-sm font-bold text-white transition-colors hover:text-[#F9B900]"><Phone size={15} className="text-[#F9B900]" /><span className="text-[#F9B900]">Call Now</span><span className="text-white">+91 98765 43210</span></a><a aria-label="Chat on WhatsApp" href={"https://wa.me/" + WHATSAPP_PHONE} className="grid h-9 w-9 place-items-center border border-white/30 text-white transition-colors hover:border-[#F9B900] hover:bg-[#F9B900] hover:text-[#071D49]"><MessageCircle size={17} /></a></div><div className="flex items-center gap-3 xl:hidden"><a href={"tel:" + PHONE} aria-label="Call now" className="grid h-9 w-9 place-items-center border border-[#F9B900]/70 text-[#F9B900]"><Phone size={16} /></a><button aria-label={menu ? "Close menu" : "Open menu"} className="grid h-9 w-9 place-items-center border border-white/30 text-white transition-colors hover:border-[#F9B900] hover:text-[#F9B900]" onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <Menu size={20} />}</button></div></div>{menu && <nav className="border-t border-white/10 bg-[#071D49] px-5 pb-5 pt-2 shadow-2xl xl:hidden">{links.map(([l, h], index) => <a onClick={() => setMenu(false)} key={l} href={h} className={`flex items-center justify-between border-b border-white/10 py-3.5 text-sm font-semibold ${index === 0 ? "text-[#F9B900]" : "text-white/80"}`}><span>{l}</span><ArrowRight size={15} className="text-[#F9B900]" /></a>)}<a onClick={() => setMenu(false)} href="#book" className="mt-4 block bg-[#F9B900] px-4 py-3.5 text-center text-sm font-extrabold text-[#071D49]">Book Your Taxi <ArrowRight className="ml-1 inline" size={15} /></a></nav>}</header>
        <main>
            <section id="home" className="relative isolate overflow-hidden bg-[#071D49] pt-[78px] text-white">
                <HeroSection />
                <div id="book" className="relative z-10 mt-5 mx-auto -mb-12 max-w-[1120px] px-5"><div className="bg-white p-5 shadow-[0_20px_55px_rgba(0,0,0,.22)] sm:p-7">{confirmedQuote ? <div className="bg-[#071D49] py-8 text-center text-white"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F9B900] text-[#071D49]"><Check size={27} /></span><h2 className="mt-4 text-2xl font-extrabold text-white">Quote Request Received!</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-white/85">Thank you, <b className="text-white">{confirmedQuote.name}</b>. Your request has been sent to the quote team. We will contact you shortly on <b className="text-white">{confirmedQuote.mobile}</b>.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><a href={"tel:" + PHONE} className="bg-[#F9B900] px-5 py-3 text-sm font-bold text-[#071D49]"><Phone className="mr-1.5 inline" size={16} />Call Now</a><a href={"https://wa.me/" + WHATSAPP_PHONE} className="border border-white/70 px-5 py-3 text-sm font-bold text-white">WhatsApp</a><button onClick={() => { setConfirmedQuote(null); setQuote({ name: "", mobile: "", email: "", pickup: "", drop: "", date: "", car: "" }) }} className="px-4 py-3 text-sm font-bold text-white/85">New request</button></div></div> : <form onSubmit={submit} className="grid gap-4 md:grid-cols-3"><div className="md:col-span-3"><p className="text-xl font-extrabold">Book your taxi</p><p className="mt-1 text-sm text-[#64748B]">Share your journey details and receive a tailored quote.</p></div>{[["name", "Full Name", "text"], ["mobile", "Mobile Number", "tel"], ["email", "Email Address", "email"], ["pickup", "Pickup Location", "text"], ["drop", "Drop Location", "text"], ["date", "Travel Date", "date"]].map(([n, p, t]) => <label key={n}><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-[#64748B]">{p}</span><input required type={t} name={n} value={quote[n as keyof typeof quote]} onChange={e => setQuote(x => ({ ...x, [n]: e.target.value }))} pattern={n === "mobile" ? "[6-9][0-9]{9}" : undefined} title={n === "mobile" ? "Enter a valid 10-digit Indian mobile number" : undefined} placeholder={n === "mobile" ? "98765 43210" : undefined} className="w-full border-b border-[#CBD5E1] bg-[#F7F9FC] px-3 py-3 text-sm outline-none focus:border-[#F9B900]" /></label>)}<label><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-[#64748B]">Preferred Car</span><select required value={quote.car} onChange={e => setQuote(x => ({ ...x, car: e.target.value }))} className="w-full border-b border-[#CBD5E1] bg-[#F7F9FC] px-3 py-3 text-sm outline-none focus:border-[#F9B900]"><option value="">Select a car</option>{cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="grid gap-2 sm:grid-cols-2"><button name="submissionChannel" value="website" disabled={isSubmitting} className="flex items-center justify-center bg-[#071D49] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={16} />Sending...</> : <>Send via Website <ArrowRight className="ml-1" size={16} /></>}</button><button name="submissionChannel" value="whatsapp" disabled={isSubmitting} className="flex items-center justify-center bg-[#25D366] px-4 py-3.5 text-sm font-bold text-[#073B20] transition hover:bg-[#1fbd5a] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={16} />Sending...</> : <><MessageCircle className="mr-1" size={16} />Send on WhatsApp</>}</button></div>{quoteError && <p role="alert" className="md:col-span-3 text-sm font-semibold text-[#B42318]">{quoteError}</p>}</form>}</div>
                </div>
                <div className="relative mt-22 grid border-t border-white/10 bg-[#051533] text-white sm:grid-cols-5">
                </div>
                </section>
            <section id="cars" className="bg-white py-24"><div className="mx-auto max-w-[1320px] px-5 lg:px-8"><div className="text-center"><p className="text-[11px] font-bold tracking-[.2em] text-[#9a7100]">OUR FLEET</p><h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Choose your kind of comfort.</h2><p className="mx-auto mt-3 max-w-xl text-sm text-[#64748B]">Live listings from our marketplace, updated from the database.</p></div>{fleetError ? <p className="mt-12 text-center text-sm text-[#B42318]">Unable to load cars right now. Please try again shortly.</p> : fleetLoading ? <p className="mt-12 text-center text-sm text-[#64748B]">Loading available cars...</p> : cars.length === 0 ? <p className="mt-12 text-center text-sm text-[#64748B]">No cars are listed yet.</p> : <div className="fleet-scroll mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{cars.map(c => <FleetCard key={c.id || c.name} car={c} onViewDetails={setCar} onBook={setCar} />)}</div>}</div></section>
            <QuickTravelSections />
            <GallerySection />
            <OfficeLocationSection />
            <GoogleReviewsSection />

          <section
  id="reviews"
  className="hidden"
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
<footer id="contact" className="bg-[#051533] px-5 py-10 text-white">
  <div className="mx-auto grid max-w-[1320px] gap-8 sm:grid-cols-2 lg:grid-cols-4">

    <div>
      <Logo />
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
        Comfortable, reliable and affordable rides for local and outstation
        travel across Maharashtra.
      </p>
    </div>

    <div>
      <p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">
        OUR SERVICES
      </p>
      <div className="mt-3 grid gap-2 text-sm text-white/60">
        <span>City Rides</span>
        <span>Outstation Rides</span>
        <span>Airport Pickup & Drop</span>
        <span>Tour &amp; Travel</span>
      </div>
    </div>

    <div>
      <p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">
        GET IN TOUCH
      </p>

      <a
        className="mt-3 block text-lg font-extrabold text-white"
        href={"tel:" + PHONE}
      >
        +91 98765 43210
      </a>

      <a
        className="mt-2 inline-block text-sm text-white/60 hover:text-[#F9B900]"
        href={"https://wa.me/" + WHATSAPP_PHONE}
      >
        WhatsApp us
      </a>
    </div>

    <div>
      <p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">
        TRAVEL WITH US
      </p>

      <p className="mt-3 text-sm leading-relaxed text-white/60">
        Available 24/7 for your travel needs.
        <br />
        Solapur, Maharashtra
      </p>

      <a
        href="#book"
        className="mt-4 inline-block border border-white/30 px-4 py-2 text-xs font-bold transition hover:border-[#F9B900] hover:text-[#F9B900]"
      >
        Book Your Ride
      </a>
      <div className="mt-6"><SocialLinks /></div>
    </div>

  </div>

  <div className="mx-auto mt-8 max-w-[1320px] border-t border-white/10 pt-4 text-xs text-white/40">
    © 2026 SS Tours &amp; Travels. All rights reserved.
  </div>
</footer>    
{car && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#071D49]/75 p-3 sm:p-6">
    <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl sm:rounded-2xl">

      <button
        onClick={() => setCar(null)}
        className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#071D49] shadow sm:right-4 sm:top-4"
      >
        <X size={18} />
      </button>

      <div className="grid md:grid-cols-2">

        {/* Image */}
        <img
          src={car.img}
          alt={car.name}
          className="h-40 w-full object-cover sm:h-56 md:h-full md:min-h-[500px]"
        />

        {/* Content */}
        <div className="p-4 sm:p-7">

          <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#9a7100] sm:text-xs">
            {car.tag} · {car.type}
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-[#071D49] sm:mt-2 sm:text-3xl">
            {car.name}
          </h2>

          <div className="mt-2 flex items-center text-sm">
            <Stars />
            <b className="ml-2">4.9</b>
            <span className="ml-1 text-[#64748B]">rating</span>
          </div>

          {/* Features */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#64748B] sm:mt-5 sm:gap-3 sm:text-sm">
            {[
              car.seats,
              "Air Conditioned",
              "2 large bags",
              "Music system",
              "Verified driver",
              "Safety checked",
            ].map(x => (
              <span
                key={x}
                className="rounded-md bg-[#F8FAFC] px-2 py-2 sm:border-l-2 sm:border-[#F9B900] sm:bg-transparent sm:pl-2"
              >
                {x}
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[#64748B] sm:mt-5 sm:text-sm">
            Comfortable seating, responsible driving and a local professional
            who knows the route.
          </p>

          {/* Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a
              href="#book"
              onClick={() => setCar(null)}
              className="rounded-lg bg-[#F9B900] px-3 py-2.5 text-center text-xs font-bold text-[#071D49] sm:px-4 sm:py-3 sm:text-sm"
            >
              Book This Car
            </a>

            <a
              href={"tel:" + PHONE}
              className="rounded-lg bg-[#071D49] px-3 py-2.5 text-center text-xs font-bold text-white sm:px-4 sm:py-3 sm:text-sm"
            >
              Call Now
            </a>

            <a
              href={"https://wa.me/" + WHATSAPP_PHONE}
              className="col-span-2 rounded-lg border border-[#071D49] px-3 py-2.5 text-center text-xs font-bold text-[#071D49] sm:w-auto sm:text-sm"
            >
              WhatsApp
            </a>
          </div>

          <p className="mt-4 border-t pt-3 text-[10px] leading-relaxed text-[#64748B] sm:mt-6 sm:pt-4 sm:text-xs">
            Vehicle feedback:{" "}
            <b>
              “Smooth, comfortable and on time.”
            </b>
          </p>

        </div>
      </div>
    </div>
  </div>
)}    
        {review && <div className="fixed inset-0 z-[70] grid place-items-center bg-[#071D49]/75 p-4"><div className="w-full max-w-md bg-white p-7 shadow-2xl"><button onClick={() => setReview(false)} className="float-right"><X /></button>{sent ? <div className="py-10 text-center"><span className="inline-grid h-14 w-14 place-items-center rounded-full bg-[#F9B900]"><Check /></span><h2 className="mt-5 text-2xl font-extrabold">Thank you for sharing.</h2><p className="mt-2 text-sm text-[#64748B]">Your review has been received.</p><button onClick={() => setReview(false)} className="mt-6 bg-[#071D49] px-5 py-3 text-sm font-bold text-white">Close</button></div> : <form onSubmit={e => { e.preventDefault(); setSent(true) }}><p className="text-xs font-bold tracking-[.18em] text-[#9a7100]">YOUR EXPERIENCE</p><h2 className="mt-2 text-2xl font-extrabold">Write a Review</h2><label className="mt-5 block text-xs font-bold">Name<input required className="mt-2 w-full border-b p-3 outline-none focus:border-[#F9B900]" /></label><div className="mt-5"><p className="text-xs font-bold">Star Rating</p><div className="mt-2"><Stars /></div></div><label className="mt-5 block text-xs font-bold">Your Experience<textarea required className="mt-2 h-24 w-full border p-3 text-sm outline-none focus:border-[#F9B900]" /></label><button className="mt-5 w-full bg-[#071D49] py-3 text-sm font-bold text-white">Submit Review</button></form>}</div></div>}
        <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 lg:hidden"><a href={"tel:" + PHONE} className="bg-[#F9B900] py-3 text-center text-xs font-extrabold">Call Now</a><a href="#book" className="bg-[#071D49] py-3 text-center text-xs font-extrabold text-white">Book a Ride</a></div></div>
}
