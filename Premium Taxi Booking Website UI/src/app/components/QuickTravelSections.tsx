import { ArrowRight, BadgeIndianRupee, Calendar, CarFront, Check, Clock3, Headphones, Loader2, MapPin, MessageCircle, Phone, Send, ShieldCheck, Sparkles, User, UserRoundCheck, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { quoteApi } from "../../api/quoteApi";
import { carApi } from "../../api/carApi";
import type { Car } from "../../api/types";

const benefits = [
  [CarFront, "Clean & Sanitized Cars"],
  [UserRoundCheck, "Professional Drivers"],
  [Clock3, "On-Time Pickup"],
  [BadgeIndianRupee, "No Hidden Charges"],
  [Headphones, "24×7 Service"],
  [ShieldCheck, "Safe & Comfortable"],
] as const;

const popularRoutes = [
  { pickup: "Solapur", drop: "Akkalkot", label: "Solapur to Akkalkot", tag: "Temple Special" },
  { pickup: "Solapur", drop: "Tuljapur", label: "Solapur to Tuljapur", tag: "Bhavani Darshan" },
  { pickup: "Solapur", drop: "Pandharpur", label: "Solapur to Pandharpur", tag: "Vitthal Darshan" },
  { pickup: "Solapur", drop: "Ganagapur", label: "Solapur to Ganagapur", tag: "Dattatreya Temple" },
  { pickup: "Solapur", drop: "Pune", label: "Solapur to Pune", tag: "One Way / Return" },
  { pickup: "Solapur", drop: "Mumbai", label: "Solapur to Mumbai", tag: "Airport & Outstation" },
];

const allDestinations = [
  "Akkalkot", "Tuljapur", "Pandharpur", "Ganagapur", "Pune", "Mumbai", 
  "Hyderabad", "Kolhapur", "Shirdi", "Bijapur", "Goa", "Lonavala", 
  "Mahabaleshwar", "Nashik", "Aurangabad", "Solapur Local Station / City"
];

const WHATSAPP_NUMBER = "918010374300";
const CALL_NUMBER = "+918010374300";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-extrabold text-[#171717] sm:text-2xl">{children}</h2>
      <span className="mx-auto mt-2 block h-0.5 w-7 bg-[#FFC928]" />
    </div>
  );
}

export function QuickTravelSections() {
  const [modalOpen, setModalOpen] = useState(false);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<{ pickup: string; drop: string; label?: string }>({
    pickup: "Solapur",
    drop: "Akkalkot"
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "Solapur",
    drop: "Akkalkot",
    date: new Date().toISOString().split("T")[0],
    car: "Any Available AC Cab",
    carId: "",
    tripType: "One Way"
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    carApi.getCars({ limit: 50 })
      .then((res) => {
        const active = (res.items || []).filter((c) => c.status === "available");
        setAvailableCars(active);
        if (active.length > 0) {
          setForm((prev) => ({
            ...prev,
            car: active[0].name,
            carId: active[0]._id
          }));
        }
      })
      .catch(() => {
        // Fallback silently if offline
      });
  }, []);

  const openRouteModal = (pickup: string, drop: string, label?: string) => {
    setSelectedRoute({ pickup, drop, label });
    setForm((prev) => ({
      ...prev,
      pickup,
      drop,
      date: prev.date || new Date().toISOString().split("T")[0]
    }));
    setSubmitted(false);
    setErrorMessage("");
    setModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent, channel: "website" | "whatsapp") => {
    e.preventDefault();
    const cleanPhone = form.phone.replace(/\D/g, "").slice(-10);

    if (!form.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    if (!form.pickup.trim() || !form.drop.trim()) {
      setErrorMessage("Please specify both pickup and drop locations.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const journeyMessage = `Route: ${form.pickup.trim()} to ${form.drop.trim()} (${form.tripType}) on ${form.date}. Preferred: ${form.car}.`;
    const textMessage = `*Taxi Booking Request - SS Tours & Travels*\n\n📍 *Route:* ${form.pickup.trim()} ➔ ${form.drop.trim()}\n🚗 *Trip Type:* ${form.tripType}\n📅 *Travel Date:* ${form.date}\n🚘 *Vehicle:* ${form.car}\n\n👤 *Client Name:* ${form.name.trim()}\n📞 *Mobile Number:* +91 ${cleanPhone}\n\n_Please confirm taxi availability, fare quote, and driver details._`;
    const directWaUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(textMessage)}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (channel === "whatsapp") {
      // Create quote record in backend asynchronously in background
      void quoteApi.createQuote({
        carId: form.carId || "default",
        customerName: form.name.trim(),
        customerPhone: `+91${cleanPhone}`,
        message: journeyMessage,
        preferredContactMethod: "whatsapp"
      }).catch(() => {});

      // Instant direct navigation works 100% on iOS Safari, Android Chrome & Desktop
      if (isMobile) {
        window.location.href = directWaUrl;
      } else {
        window.open(directWaUrl, "_blank", "noopener,noreferrer");
      }
      setSubmitting(false);
      setSubmitted(true);
      return;
    }

    try {
      await quoteApi.createQuote({
        carId: form.carId || "default",
        customerName: form.name.trim(),
        customerPhone: `+91${cleanPhone}`,
        message: journeyMessage,
        preferredContactMethod: "phone"
      });

      setSubmitted(true);
    } catch (err) {
      setErrorMessage((err as Error).message || "Could not submit booking request. Please try again or call directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#F7F7F7] py-12 sm:py-16">
      <div className="mx-auto max-w-[1240px] px-5">
        {/* Benefits Strip */}
        <SectionTitle>Why Choose SS Tours &amp; Travels?</SectionTitle>
        <div className="mt-6 grid overflow-hidden rounded-xl border border-[#E8E8E8] bg-white shadow-sm sm:grid-cols-3 lg:grid-cols-6">
          {benefits.map(([Icon, title], index) => (
            <div
              key={title}
              className={`flex min-h-[106px] flex-col items-center justify-center p-3 text-center transition hover:bg-[#FFFDF5] ${
                index ? "border-t border-[#E8E8E8] sm:border-l sm:border-t-0 lg:border-t-0" : ""
              } ${index === 3 ? "sm:border-l-0 lg:border-l" : ""}`}
            >
              <Icon size={24} strokeWidth={1.9} className="text-[#071D49]" />
              <span className="mt-2 max-w-[110px] text-xs font-bold leading-4 text-[#334155]">{title}</span>
            </div>
          ))}
        </div>

        {/* Popular Routes Section */}
        <div className="mt-12">
          <SectionTitle>Popular Routes from Solapur</SectionTitle>
          <p className="mx-auto mt-2 max-w-lg text-center text-xs text-[#64748B] sm:text-sm">
            Click any route below to instantly get a quote or book your ride via Website or WhatsApp.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularRoutes.map((route) => (
              <button
                key={route.label}
                type="button"
                onClick={() => openRouteModal(route.pickup, route.drop, route.label)}
                className="group flex min-h-[56px] items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFC928] hover:shadow-md"
              >
                <div>
                  <span className="block text-xs font-extrabold text-[#071D49] group-hover:text-[#9a7100]">
                    {route.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold text-[#64748B]">
                    {route.tag}
                  </span>
                </div>
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F8FAFC] text-[#64748B] transition group-hover:bg-[#FFC928] group-hover:text-[#071D49]">
                  <ArrowRight size={14} />
                </div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => openRouteModal("Solapur", "Pandharpur", "Custom Solapur Route")}
              className="group flex min-h-[56px] items-center justify-between rounded-xl bg-[#071D49] px-4 py-3 text-left text-white shadow-sm transition hover:bg-[#F9B900] hover:text-[#071D49]"
            >
              <div>
                <span className="block text-xs font-extrabold text-[#FFC928] group-hover:text-[#071D49]">
                  View All / Custom Route
                </span>
                <span className="mt-0.5 block text-[10px] opacity-80">
                  Select or type any destination
                </span>
              </div>
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 transition group-hover:bg-[#071D49] group-hover:text-[#FFC928]">
                <ArrowRight size={14} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Route Booking Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071D49]/80 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF9E6] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#9a7100]">
                  <Sparkles size={11} className="text-[#F9B900]" /> Instant Route Booking
                </span>
                <h3 className="mt-1 text-xl font-extrabold text-[#071D49] sm:text-2xl">
                  {form.pickup} <span className="text-[#F9B900]">➔</span> {form.drop}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#F1F5F9] text-[#64748B] transition hover:bg-[#071D49] hover:text-white"
                aria-label="Close route booking modal"
              >
                <X size={17} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EBFBF2] text-[#1E7E34]">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <h4 className="mt-4 text-2xl font-extrabold text-[#071D49]">Booking Request Sent!</h4>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#64748B] sm:text-sm">
                  Thank you, <b className="text-[#071D49]">{form.name}</b>. We have received your journey details for{" "}
                  <b className="text-[#071D49]">{form.pickup} to {form.drop}</b> on <b className="text-[#071D49]">{form.date}</b>. Our team will contact you shortly.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={`tel:${CALL_NUMBER}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#071D49] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49]"
                  >
                    <Phone size={14} /> Call Dispatch (+91 80103 74300)
                  </a>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-[#CBD5E1] px-5 py-3 text-xs font-bold text-[#64748B] transition hover:bg-[#F1F5F9]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => handleBookingSubmit(e, "website")} className="mt-4 space-y-4">
                {/* Trip Type Selector */}
                <div className="flex gap-2">
                  {["One Way", "Round Trip", "Full Day Rental"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, tripType: type }))}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                        form.tripType === type
                          ? "bg-[#071D49] text-white shadow-sm"
                          : "border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#CBD5E1]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Pickup & Drop Inputs (Dynamic & Editable) */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#475569]">
                      <MapPin size={12} className="text-[#22C55E]" /> Pickup Location <span className="text-[#B42318]">*</span>
                    </span>
                    <input
                      required
                      type="text"
                      value={form.pickup}
                      onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                      placeholder="e.g. Solapur Railway Station / City"
                      className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#475569]">
                      <MapPin size={12} className="text-[#EF4444]" /> Drop Location <span className="text-[#B42318]">*</span>
                    </span>
                    <input
                      required
                      type="text"
                      value={form.drop}
                      onChange={(e) => setForm({ ...form, drop: e.target.value })}
                      placeholder="e.g. Akkalkot Mandir / Pune"
                      className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white"
                    />
                  </label>
                </div>

                {/* Quick Destination Chips */}
                <div className="rounded-lg bg-[#F8FAFC] p-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Quick Destinations:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {allDestinations.slice(0, 8).map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, drop: dest }))}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition ${
                          form.drop === dest
                            ? "bg-[#071D49] text-white"
                            : "bg-white border border-[#CBD5E1] text-[#475569] hover:border-[#F9B900]"
                        }`}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#475569]">
                      <User size={12} className="text-[#9a7100]" /> Your Full Name <span className="text-[#B42318]">*</span>
                    </span>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rajesh Patil"
                      className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#475569]">
                      <Phone size={12} className="text-[#9a7100]" /> Mobile / WhatsApp <span className="text-[#B42318]">*</span>
                    </span>
                    <div className="relative mt-1 flex rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden focus-within:border-[#F9B900] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F9B900]/20">
                      <span className="flex items-center bg-[#E2E8F0]/75 px-2.5 text-xs font-bold text-[#071D49] border-r border-[#CBD5E1] select-none">
                        +91
                      </span>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        title="Enter 10 digit Indian mobile number"
                        value={form.phone}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.startsWith("91") && val.length > 10) val = val.slice(2);
                          if (val.startsWith("0")) val = val.slice(1);
                          setForm({ ...form, phone: val.slice(0, 10) });
                        }}
                        placeholder="98765 43210"
                        className="w-full bg-transparent px-3 py-2 text-xs font-semibold text-[#071D49] outline-none"
                      />
                    </div>
                  </label>
                </div>

                {/* Travel Date & Preferred Car */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#475569]">
                      <Calendar size={12} className="text-[#9a7100]" /> Travel Date <span className="text-[#B42318]">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white"
                    />
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#475569]">
                      <CarFront size={12} className="text-[#9a7100]" /> Vehicle Preference
                    </span>
                    <select
                      value={form.carId || form.car}
                      onChange={(e) => {
                        const selectedCar = availableCars.find((c) => c._id === e.target.value);
                        setForm({
                          ...form,
                          carId: e.target.value,
                          car: selectedCar ? selectedCar.name : e.target.value
                        });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-2.5 py-2 text-xs font-semibold text-[#071D49] outline-none transition focus:border-[#F9B900] focus:bg-white"
                    >
                      {availableCars.length > 0 ? (
                        availableCars.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.brand} · {c.fuelType})
                          </option>
                        ))
                      ) : (
                        <option value="Standard AC Taxi">Standard AC Taxi</option>
                      )}
                    </select>
                  </label>
                </div>

                {errorMessage && (
                  <p role="alert" className="rounded-lg bg-[#FFF2F2] p-2 text-xs font-bold text-[#B42318]">
                    {errorMessage}
                  </p>
                )}

                {/* Dual Action Buttons: Send via Website & Send on WhatsApp */}
                <div className="pt-2 grid gap-2.5 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#071D49] py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#F9B900] hover:text-[#071D49] active:scale-[0.98] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} /> Send via Website
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={(e) => handleBookingSubmit(e, "whatsapp")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#1EBE5D] active:scale-[0.98] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>
                        <MessageCircle size={15} /> Send via WhatsApp
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-[#64748B]">
                  <span>⚡ Instant response</span>
                  <span>•</span>
                  <span>🔒 Best price guarantee</span>
                  <span>•</span>
                  <span>🚕 24/7 Service</span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
