import { useEffect, useState } from "react";
import { ArrowRight, Camera, Car, Check, ChevronLeft, ChevronRight, Clock3, Headphones, Loader2, MapPin, Menu, MessageCircle, Navigation, Phone, ShieldCheck, Sparkles, Star, Users, Wind, X } from "lucide-react";
import logo from "../public/logo1.png";
import image1 from "../public/image1.png";
import image2 from "../public/image2.jpg";
import image3 from "../public/image3.png";
import { DestinationsSection } from "./components/DestinationsSection";
import { FleetCard, type FleetCar } from "./components/FleetCard";
import { HeroSection } from "./components/HeroSection";
import { GallerySection } from "./components/GallerySection";
import { FAQSection } from "./components/FAQSection";
import { GoogleReviewsSection, OfficeLocationSection } from "./components/BusinessSections";
import { SocialLinks } from "./components/SocialLinks";
import { QuickTravelSections } from "./components/QuickTravelSections";
import { OperationsRouter } from "./OperationsRouter";
import { isAuthenticated } from "./auth";
import { carApi } from "../api/carApi";
import { quoteApi } from "../api/quoteApi";
import type { Car as DatabaseCar } from "../api/types";
const PHONE = "+918010374300";
const WHATSAPP_PHONE = "918010374300";
function toFleetCar(car: DatabaseCar): FleetCar {
  const images = (car.images && car.images.length > 0) ? car.images : (car.img ? [car.img] : []);
  return {
    id: car._id,
    name: car.name,
    type: car.brand ? `${car.brand} · ${car.transmission}` : "Premium Taxi",
    seats: `${car.fuelType} · ${car.transmission}`,
    tag: "DB Listing",
    img: images[0] || "",
    images: images,
    description: car.description,
    fuelType: car.fuelType,
    transmission: car.transmission,
    location: car.location,
    status: car.status
  };
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
function Logo() {
  return (
    <a href="#home" className="flex h-14 xs:h-16 sm:h-16 lg:h-20 items-center shrink-0" aria-label="SS Tours and Travels home">
      <img
        src={logo}
        alt="SS Tours & Travels Solapur"
        className="h-12 xs:h-14 sm:h-15 lg:h-16 w-auto max-w-[220px] xs:max-w-[260px] sm:max-w-[280px] lg:max-w-[340px] object-contain object-left scale-110 origin-left drop-shadow-md"
      />
    </a>
  );
}
function Stars() { return <span className="inline-flex gap-0.5 text-[#F9B900]">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="currentColor" />)}</span> }
export default function App() {
    const [menu, setMenu] = useState(false), [scrolled, setScrolled] = useState(false), [car, setCar] = useState<FleetCar | null>(null), [review, setReview] = useState(false), [sent, setSent] = useState(false);
    const [activeCarImg, setActiveCarImg] = useState(0);
    const [carTouchStart, setCarTouchStart] = useState(0);
    const [cars, setCars] = useState<FleetCar[]>([]), [fleetLoading, setFleetLoading] = useState(true), [fleetError, setFleetError] = useState("");
    const [quote, setQuote] = useState({ name: "", mobile: "", email: "", pickup: "", drop: "", date: "", car: "" });
    const [isSubmitting, setIsSubmitting] = useState(false), [confirmedQuote, setConfirmedQuote] = useState<typeof quote | null>(null), [quoteError, setQuoteError] = useState("");
    useEffect(() => { carApi.getCars({ limit: 50 }).then((result) => setCars(result.items.map(toFleetCar))).catch((error: Error) => setFleetError(error.message)).finally(() => setFleetLoading(false)); }, []);
    if (window.location.pathname !== "/" && window.location.pathname !== "") return <OperationsRouter />;
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const submissionChannel = submitter?.value === "whatsapp" ? "whatsapp" : "website";
        const mobile = quote.mobile.replace(/\D/g, "").slice(-10);
        if (!/^[6-9]\d{9}$/.test(mobile)) { setQuoteError("Please enter a valid 10-digit Indian mobile number starting with 6-9."); return; }
        const selectedCar = cars.find((item) => item.id === quote.car);
        if (!selectedCar?.id) { setQuoteError("Please select an available car before sending your request."); return; }

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const formatTravelDate = (dStr: string) => {
            try {
                const d = new Date(dStr);
                if (!isNaN(d.getTime())) return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
            } catch {}
            return dStr;
        };
        const formattedDate = formatTravelDate(quote.date);
        const waText = `Hello SS Tours & Travels,\n\nI want to book a taxi for:\n• Route: ${quote.pickup.trim()} to ${quote.drop.trim()}\n• Date: ${formattedDate}\n• Preferred Car: ${selectedCar.name}\n\nMy Details:\n• Name: ${quote.name.trim()}\n• Mobile: +91 ${mobile}\n\nPlease share the fare quote and cab availability. Thank you!`;
        const directWaUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(waText)}`;

        if (submissionChannel === "whatsapp") {
            void quoteApi.createQuote({
                carId: selectedCar.id,
                customerName: quote.name.trim(),
                customerPhone: `+91${mobile}`,
                customerEmail: quote.email.trim() || undefined,
                message: `Taxi journey: ${quote.pickup.trim()} to ${quote.drop.trim()} on ${quote.date}. Preferred car: ${selectedCar.name}.`,
                preferredContactMethod: "whatsapp",
            }).catch(() => {});

            if (isMobile) {
                window.location.href = directWaUrl;
            } else {
                window.open(directWaUrl, "_blank", "noopener,noreferrer");
            }
            setConfirmedQuote({ ...quote, mobile });
            return;
        }

        setIsSubmitting(true);
        setQuoteError("");
        try {
            await quoteApi.createQuote({
                carId: selectedCar.id,
                customerName: quote.name.trim(),
                customerPhone: `+91${mobile}`,
                customerEmail: quote.email.trim() || undefined,
                message: `Taxi journey: ${quote.pickup.trim()} to ${quote.drop.trim()} on ${quote.date}. Preferred car: ${selectedCar.name}.`,
                preferredContactMethod: "phone",
            });
            setConfirmedQuote({ ...quote, mobile });
        } catch (error) {
            setQuoteError((error as Error).message || "We could not send your quote request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll) }, []);
    const links = [["Home", "#home"], ["Our Cars", "#cars"], ["Gallery", "#gallery"], ["Reviews", "#reviews"], ["FAQ", "#faq"], ["Contact", "#contact"]];
    return <div className="min-h-screen overflow-x-hidden bg-[#F7F9FC] text-[#071D49]">
        <header style={{ fontFamily: "Teachers, sans-serif" }} className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/10 bg-[#071D49]/98 shadow-[0_8px_28px_rgba(0,0,0,.22)]" : "border-white/10 bg-[#071D49]/35 backdrop-blur-md"}`}><div className="mx-auto flex h-[74px] sm:h-[80px] lg:h-[86px] max-w-[1440px] items-center justify-between px-3 sm:px-6 lg:px-8"><Logo /><nav className="hidden h-full items-center gap-5 xl:flex">{links.map(([l, h], index) => <a key={l} href={h} className={`group relative flex h-full items-center text-[12px] font-semibold tracking-[.02em] transition-colors duration-200 hover:text-[#F9B900] ${index === 0 ? "text-[#F9B900]" : "text-white/80"}`}><span>{l}</span><span className={`absolute bottom-0 left-0 h-0.5 bg-[#F9B900] transition-all duration-300 ${index === 0 ? "w-full" : "w-0 group-hover:w-full"}`} /></a>)}</nav><div className="hidden items-center gap-3 xl:flex"><a href={"tel:" + PHONE} className="flex items-center gap-2 border-r border-white/20 pr-4 text-sm font-bold text-white transition-colors hover:text-[#F9B900]"><Phone size={15} className="text-[#F9B900]" /><span className="text-[#F9B900]">Call Now</span><span className="text-white">+91 80103 74300</span></a><a aria-label="Chat on WhatsApp" href={"https://wa.me/" + WHATSAPP_PHONE} className="grid h-9 w-9 place-items-center border border-white/30 text-white transition-colors hover:border-[#F9B900] hover:bg-[#F9B900] hover:text-[#071D49]"><MessageCircle size={17} /></a><a href="#book" className="inline-flex items-center gap-1.5 rounded-lg bg-[#F9B900] px-4 py-2 text-xs font-extrabold text-[#071D49] shadow-sm transition hover:bg-[#e6ad00]"><span>Book Now</span><ArrowRight size={13} /></a></div><div className="flex items-center gap-2 sm:gap-3 xl:hidden shrink-0"><a href={"tel:" + PHONE} aria-label="Call now" className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-md border border-[#F9B900]/70 text-[#F9B900] transition hover:bg-[#F9B900] hover:text-[#071D49]"><Phone size={16} /></a><a href={"https://wa.me/" + WHATSAPP_PHONE} aria-label="Chat on WhatsApp" className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-md border border-white/30 text-white transition hover:border-[#F9B900] hover:text-[#F9B900]"><MessageCircle size={16} /></a><button aria-label={menu ? "Close menu" : "Open menu"} className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-md border border-white/30 text-white transition-colors hover:border-[#F9B900] hover:text-[#F9B900]" onClick={() => setMenu(!menu)}>{menu ? <X size={19} /> : <Menu size={19} />}</button></div></div>{menu && <nav className="border-t border-white/10 bg-[#071D49] px-4 pb-5 pt-2 shadow-2xl xl:hidden sm:px-6">{links.map(([l, h], index) => <a onClick={() => setMenu(false)} key={l} href={h} className={`flex items-center justify-between border-b border-white/10 py-3 text-sm font-semibold transition hover:text-[#F9B900] ${index === 0 ? "text-[#F9B900]" : "text-white/85"}`}><span>{l}</span><ArrowRight size={14} className="text-[#F9B900]" /></a>)}<a onClick={() => setMenu(false)} href="#book" className="mt-4 block rounded-lg bg-[#FFC928] px-4 py-3 text-center text-sm font-extrabold text-[#071D49] transition hover:bg-[#e6ad00]">Book Your Taxi <ArrowRight className="ml-1 inline" size={15} /></a></nav>}</header>
        <main>
            <section id="home" className="relative isolate overflow-hidden bg-[#071D49] pt-[74px] sm:pt-[80px] lg:pt-[86px] text-white">
                <HeroSection />
                <div id="book" className="relative z-10 mt-5 mx-auto -mb-12 max-w-[1120px] px-4 sm:px-5"><div className="bg-white p-4 shadow-[0_20px_55px_rgba(0,0,0,.22)] sm:p-7">{confirmedQuote ? <div className="bg-[#071D49] py-8 text-center text-white"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F9B900] text-[#071D49]"><Check size={27} /></span><h2 className="mt-4 text-2xl font-extrabold text-white">Quote Request Received!</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-white/85">Thank you, <b className="text-white">{confirmedQuote.name}</b>. Your request has been sent to the quote team. We will contact you shortly on <b className="text-white">+91 {confirmedQuote.mobile}</b>.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><a href={"tel:" + PHONE} className="bg-[#F9B900] px-5 py-3 text-sm font-bold text-[#071D49]"><Phone className="mr-1.5 inline" size={16} />Call Now</a><a href={"https://wa.me/" + WHATSAPP_PHONE} className="border border-white/70 px-5 py-3 text-sm font-bold text-white">WhatsApp</a><button onClick={() => { setConfirmedQuote(null); setQuote({ name: "", mobile: "", email: "", pickup: "", drop: "", date: "", car: "" }) }} className="px-4 py-3 text-sm font-bold text-white/85">New request</button></div></div> : <form onSubmit={submit} className="grid gap-4 md:grid-cols-3"><div className="md:col-span-3"><p className="text-xl font-extrabold">Book your taxi</p><p className="mt-1 text-sm text-[#64748B]">Share your journey details and receive a tailored quote.</p></div>{[["name", "Full Name", "text", true], ["mobile", "Mobile Number", "tel", true], ["email", "Email Address", "email", false], ["pickup", "Pickup Location", "text", true], ["drop", "Drop Location", "text", true], ["date", "Travel Date", "date", true]].map(([n, p, t, req]) => <label key={n as string}><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-[#64748B]">{p as string} {req ? <span className="text-[#B42318] font-extrabold">*</span> : <span className="text-[9px] font-normal lowercase tracking-normal text-[#94A3B8]">(optional)</span>}</span>{n === "mobile" ? <div className="flex rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden focus-within:border-[#F9B900] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F9B900]/20"><span className="flex items-center bg-[#E2E8F0] px-3 text-xs font-extrabold text-[#071D49] border-r border-[#CBD5E1] select-none">+91</span><input required={Boolean(req)} type="tel" maxLength={10} name="mobile" value={quote.mobile} onChange={e => { let val = e.target.value.replace(/\D/g, ""); if (val.startsWith("91") && val.length > 10) val = val.slice(2); if (val.startsWith("0")) val = val.slice(1); setQuote(x => ({ ...x, mobile: val.slice(0, 10) })) }} pattern="[6-9][0-9]{9}" title="Enter a valid 10-digit Indian mobile number" placeholder="80103 74300" className="w-full bg-transparent px-3 py-2.5 text-sm font-semibold text-[#071D49] outline-none placeholder:text-[#94A3B8]" /></div> : <input required={Boolean(req)} type={t as string} name={n as string} value={quote[n as keyof typeof quote]} onChange={e => setQuote(x => ({ ...x, [n as string]: e.target.value }))} placeholder={n === "email" ? "name@example.com" : undefined} className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2.5 text-sm font-semibold text-[#071D49] outline-none focus:border-[#F9B900] focus:bg-white" />}</label>)}<label><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-[#64748B]">Preferred Car <span className="text-[#B42318] font-extrabold">*</span></span><select required value={quote.car} onChange={e => setQuote(x => ({ ...x, car: e.target.value }))} className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2.5 text-sm font-semibold text-[#071D49] outline-none focus:border-[#F9B900] focus:bg-white"><option value="">Select a car</option>{cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="grid gap-2 sm:grid-cols-2"><button name="submissionChannel" value="website" disabled={isSubmitting} className="flex items-center justify-center bg-[#071D49] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={16} />Sending...</> : <>Send via Website <ArrowRight className="ml-1" size={16} /></>}</button><button name="submissionChannel" value="whatsapp" disabled={isSubmitting} className="flex items-center justify-center bg-[#25D366] px-4 py-3.5 text-sm font-bold text-[#073B20] transition hover:bg-[#1fbd5a] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={16} />Sending...</> : <><MessageCircle className="mr-1" size={16} />Send on WhatsApp</>}</button></div>{quoteError && <p role="alert" className="md:col-span-3 text-sm font-semibold text-[#B42318]">{quoteError}</p>}</form>}</div>
                </div>
                <div className="relative mt-22 grid border-t border-white/10 bg-[#051533] text-white sm:grid-cols-5">
                </div>
                </section>
            <section id="cars" className="bg-white py-24"><div className="mx-auto max-w-[1320px] px-5 lg:px-8"><div className="text-center"><p className="text-[11px] font-bold tracking-[.2em] text-[#9a7100]">OUR FLEET</p><h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">Choose your kind of comfort.</h2><p className="mx-auto mt-3 max-w-xl text-sm text-[#64748B]">Live listings from our marketplace, updated from the database.</p></div>{fleetError ? <p className="mt-12 text-center text-sm text-[#B42318]">Unable to load cars right now. Please try again shortly.</p> : fleetLoading ? <p className="mt-12 text-center text-sm text-[#64748B]">Loading available cars...</p> : cars.length === 0 ? <p className="mt-12 text-center text-sm text-[#64748B]">No cars are listed yet.</p> : <div className="fleet-scroll mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{cars.map(c => <FleetCard key={c.id || c.name} car={c} onViewDetails={setCar} onBook={setCar} />)}</div>}</div></section>
            <QuickTravelSections />
            <GallerySection />
            <GoogleReviewsSection />
            <FAQSection />
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
<footer id="contact" className="bg-[#051533] px-5 py-12 text-white">
  <div className="mx-auto max-w-[1320px]">
    {/* Office Location & Interactive Map */}
    <div className="mb-10 rounded-2xl border border-white/10 bg-[#071D49]/70 p-5 sm:p-7 backdrop-blur-sm shadow-[0_12px_36px_rgba(0,0,0,.25)]">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold tracking-[.18em] text-[#F9B900]">
            <MapPin size={16} /> OFFICE LOCATION
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Visit our Solapur office.</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Shop no - 4 , Railway Lines Rd, Railway lines, Solapur, Maharashtra 413001
          </p>
          <p className="mt-2 text-xs text-white/60">
            Open 24×7 · Local Rides, Outstation &amp; Airport Transfers
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://maps.google.com/?q=Shop+no+-+4+%2C+Railway+Lines+Rd%2C+Railway+lines%2C+Solapur%2C+Maharashtra+413001"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F9B900] px-4 py-2.5 text-xs font-extrabold text-[#071D49] transition hover:bg-[#e6ad00]"
            >
              <Navigation size={14} /> Get Directions
            </a>
            <a
              href={"tel:" + PHONE}
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-xs font-bold text-white transition hover:border-[#F9B900] hover:text-[#F9B900]"
            >
              <Phone size={14} /> Call Office
            </a>
          </div>
        </div>
        <div className="h-[220px] sm:h-[260px] w-full overflow-hidden rounded-xl border border-white/15 shadow-inner">
          <iframe
            title="SS Tours & Travels Solapur Office Map"
            src="https://maps.google.com/maps?q=Shop+no+-+4+%2C+Railway+Lines+Rd%2C+Railway+lines%2C+Solapur%2C+Maharashtra+413001&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>

    {/* Footer Columns */}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Logo />
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
          Comfortable, reliable and affordable rides for local, temple tours and outstation
          travel across Maharashtra.
        </p>
        <div className="mt-5">
          <SocialLinks />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">
          OUR SERVICES
        </p>
        <div className="mt-3 grid gap-2 text-sm text-white/60">
          <span>City Taxi Rides</span>
          <span>Outstation Cabs</span>
          <span>Airport Pickup &amp; Drop</span>
          <span>Pandharpur &amp; Akkalkot Darshan</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">
          GET IN TOUCH
        </p>

        <a
          className="mt-3 block text-lg font-extrabold text-white hover:text-[#F9B900]"
          href={"tel:" + PHONE}
        >
          +91 80103 74300
        </a>

        <p className="mt-1 text-xs text-white/50">
          Owner: Siddhant Sakhare
        </p>

        <a
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#26734D] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#1f5c3e]"
          href={"https://wa.me/" + WHATSAPP_PHONE}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={14} /> WhatsApp Chat
        </a>
      </div>

      <div>
        <p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">
          OFFICE LOCATION
        </p>

        <p className="mt-3 text-xs leading-relaxed text-white/60">
          Shop no - 4, Railway Lines Rd,
          <br />
          Railway lines, Solapur,
          <br />
          Maharashtra 413001
        </p>

        <a
          href="#book"
          className="mt-4 inline-block rounded-lg bg-[#F9B900] px-4 py-2 text-xs font-extrabold text-[#071D49] shadow-sm transition hover:bg-[#e6ad00]"
        >
          Book Your Ride
        </a>
      </div>
    </div>

    <div className="mt-10 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
      <span>© 2026 SS Tours &amp; Travels (Siddhant Sakhare). All rights reserved.</span>
      <div className="flex flex-wrap items-center gap-4">
        <span>Shop no - 4, Railway Lines Rd, Solapur, Maharashtra 413001</span>
      </div>
    </div>
  </div>
</footer>    
{car && (() => {
  const carImages = (car.images && car.images.length > 0) ? car.images : (car.img ? [car.img] : []);
  const currentImg = carImages[activeCarImg] || carImages[0] || car.img || "";
  const nextCarImg = () => setActiveCarImg((prev) => (prev + 1) % carImages.length);
  const prevCarImg = () => setActiveCarImg((prev) => (prev - 1 + carImages.length) % carImages.length);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#071D49]/75 p-3 sm:p-6 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl sm:rounded-2xl">

        <button
          onClick={() => { setCar(null); setActiveCarImg(0); }}
          className="absolute right-2 top-2 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#071D49] shadow-md transition hover:bg-[#071D49] hover:text-white sm:right-4 sm:top-4"
          aria-label="Close car details modal"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">

          {/* Left Column: Swipeable Image Gallery */}
          <div className="flex flex-col bg-[#F8FAFC]">
            <div
              className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#E2E8F0] md:h-full md:min-h-[460px]"
              onTouchStart={(e) => setCarTouchStart(e.changedTouches[0].clientX)}
              onTouchEnd={(e) => {
                const diff = e.changedTouches[0].clientX - carTouchStart;
                if (Math.abs(diff) > 40 && carImages.length > 1) {
                  if (diff < 0) nextCarImg();
                  else prevCarImg();
                }
              }}
            >
              <img
                key={currentImg}
                src={currentImg}
                alt={`${car.name} photo ${activeCarImg + 1}`}
                className="h-full w-full object-cover transition-all duration-300"
              />

              {/* Photo Count Badge */}
              {carImages.length > 1 && (
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[#071D49]/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  <Camera size={13} className="text-[#F9B900]" />
                  <span>{activeCarImg + 1} / {carImages.length}</span>
                </div>
              )}

              {/* Left / Right Arrow Controls */}
              {carImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevCarImg(); }}
                    aria-label="Previous car photo"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#071D49] shadow-md transition hover:bg-[#F9B900] active:scale-95"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextCarImg(); }}
                    aria-label="Next car photo"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#071D49] shadow-md transition hover:bg-[#F9B900] active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Swipe Hint on Mobile */}
              {carImages.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-0.5 text-[10px] font-semibold text-white/90 md:hidden">
                  Swipe for more photos
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {carImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-[#E2E8F0] bg-white p-2.5">
                {carImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveCarImg(idx)}
                    className={`shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      idx === activeCarImg
                        ? "border-[#F9B900] ring-2 ring-[#F9B900]/30 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-12 w-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Car Details & Actions */}
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
              {car.description || "Comfortable seating, responsible driving and a local professional who knows the route."}
            </p>

            {/* Action Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <a
                href="#book"
                onClick={() => { setCar(null); setActiveCarImg(0); }}
                className="rounded-lg bg-[#F9B900] px-3 py-2.5 text-center text-xs font-bold text-[#071D49] shadow-sm transition hover:bg-[#e6ad00] sm:px-4 sm:py-3 sm:text-sm"
              >
                Book This Car
              </a>

              <a
                href={"tel:" + PHONE}
                className="rounded-lg bg-[#071D49] px-3 py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#12367d] sm:px-4 sm:py-3 sm:text-sm"
              >
                Call Now
              </a>

              <a
                href={"https://wa.me/" + WHATSAPP_PHONE}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 rounded-lg border border-[#071D49] px-3 py-2.5 text-center text-xs font-bold text-[#071D49] transition hover:bg-[#071D49] hover:text-white sm:w-auto sm:text-sm"
              >
                WhatsApp
              </a>
            </div>

            <p className="mt-4 border-t border-[#F1F5F9] pt-3 text-[10px] leading-relaxed text-[#64748B] sm:mt-6 sm:pt-4 sm:text-xs">
              Vehicle feedback: <b>“Smooth, comfortable and on time.”</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
})()}    
        {review && <div className="fixed inset-0 z-[70] grid place-items-center bg-[#071D49]/75 p-4"><div className="w-full max-w-md bg-white p-7 shadow-2xl"><button onClick={() => setReview(false)} className="float-right"><X /></button>{sent ? <div className="py-10 text-center"><span className="inline-grid h-14 w-14 place-items-center rounded-full bg-[#F9B900]"><Check /></span><h2 className="mt-5 text-2xl font-extrabold">Thank you for sharing.</h2><p className="mt-2 text-sm text-[#64748B]">Your review has been received.</p><button onClick={() => setReview(false)} className="mt-6 bg-[#071D49] px-5 py-3 text-sm font-bold text-white">Close</button></div> : <form onSubmit={e => { e.preventDefault(); setSent(true) }}><p className="text-xs font-bold tracking-[.18em] text-[#9a7100]">YOUR EXPERIENCE</p><h2 className="mt-2 text-2xl font-extrabold">Write a Review</h2><label className="mt-5 block text-xs font-bold">Name<input required className="mt-2 w-full border-b p-3 outline-none focus:border-[#F9B900]" /></label><div className="mt-5"><p className="text-xs font-bold">Star Rating</p><div className="mt-2"><Stars /></div></div><label className="mt-5 block text-xs font-bold">Your Experience<textarea required className="mt-2 h-24 w-full border p-3 text-sm outline-none focus:border-[#F9B900]" /></label><button className="mt-5 w-full bg-[#071D49] py-3 text-sm font-bold text-white">Submit Review</button></form>}</div></div>}
        <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 lg:hidden"><a href={"tel:" + PHONE} className="bg-[#F9B900] py-3 text-center text-xs font-extrabold">Call Now</a><a href="#book" className="bg-[#071D49] py-3 text-center text-xs font-extrabold text-white">Book a Ride</a></div></div>
}
