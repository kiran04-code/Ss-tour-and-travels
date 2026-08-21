import { useMemo, useState } from "react";
import { CarFront, Check, CheckCircle2, Loader2, MapPin, MessageCircle, Phone, Search, Send, X } from "lucide-react";
import { quoteApi } from "../../api/quoteApi";

type Destination = { name: string; distance: string; description: string; cars: string; image: string };

const photos = [
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
];

const places: Destination[] = [
  ["Akkalkot", "40 km", "Sacred Swami Samarth temple town", "Sedan, SUV, 7-Seater"], ["Siddheshwar Temple", "3 km", "Solapur's iconic lakeside temple", "Sedan, Premium Car"], ["Great Indian Bustard Sanctuary", "25 km", "Open grasslands and wildlife views", "SUV, 7-Seater"], ["Hipparga Lake", "12 km", "Quiet waterside outing near the city", "Sedan, SUV"], ["Karmala", "70 km", "Historic town with local heritage", "Sedan, SUV, 7-Seater"], ["Barshi", "75 km", "Temple town known for Bhagwant Mandir", "Sedan, SUV"], ["Pandharpur", "75 km", "Revered Vitthal-Rukmini pilgrimage", "Sedan, SUV, 7-Seater, 12-Seater"], ["Tuljapur", "90 km", "Famous Tulja Bhavani temple", "Sedan, SUV, 7-Seater"], ["Akluj", "115 km", "Vineyards, river views and local culture", "Sedan, Premium Car, SUV"], ["Mohol", "35 km", "Easy local trip with village charm", "Sedan, SUV"], ["Mangalwedha", "55 km", "Pilgrimage and heritage stop", "Sedan, SUV, 7-Seater"], ["Malshiras", "95 km", "Rural Maharashtra road-trip escape", "Sedan, SUV"], ["Sangola", "80 km", "Traditional town near Pandharpur", "Sedan, SUV, 7-Seater"], ["Kurduwadi", "60 km", "Convenient rail-town day trip", "Sedan, SUV"], ["Bhoom", "120 km", "Scenic countryside drive", "SUV, 7-Seater"], ["Osmanabad", "70 km", "Historic city and Dharashiv Caves", "Sedan, SUV, 7-Seater"], ["Dharashiv Caves", "72 km", "Ancient rock-cut cave complex", "SUV, 7-Seater"], ["Naldurg Fort", "105 km", "Grand hill fort with a waterfall", "SUV, Premium Car"], ["Ganagapur", "125 km", "Dattatreya pilgrimage destination", "Sedan, SUV, 7-Seater, 12-Seater"], ["Gangapur Dam", "140 km", "Relaxed reservoir-side escape", "SUV, 7-Seater"], ["Bijapur", "105 km", "Gol Gumbaz and Deccan architecture", "Sedan, SUV, Premium Car"], ["Indi", "85 km", "Peaceful Karnataka border town", "Sedan, SUV"], ["Kudal Sangam", "170 km", "Riverside spiritual getaway", "SUV, 7-Seater"], ["Kolhapur", "235 km", "Mahalaxmi Temple and city break", "Sedan, SUV, Premium Car, 12-Seater"], ["Pune", "250 km", "City, airport and business travel", "Sedan, SUV, Premium Car"], ["Lonavala", "325 km", "Hills, lakes and weekend views", "SUV, Premium Car, 7-Seater"], ["Mahabaleshwar", "310 km", "Cool hill station and viewpoints", "SUV, Premium Car, 7-Seater"], ["Shirdi", "285 km", "Sai Baba temple pilgrimage", "Sedan, SUV, 7-Seater, 12-Seater"], ["Nashik", "350 km", "Vineyards and sacred riverfront", "Sedan, Premium Car, SUV"], ["Aurangabad", "310 km", "Heritage gateway to the Deccan", "Sedan, SUV, Premium Car"], ["Ellora Caves", "335 km", "UNESCO cave temples", "SUV, 7-Seater, 12-Seater"], ["Ajanta Caves", "420 km", "World-renowned Buddhist cave art", "SUV, 7-Seater, 12-Seater"], ["Alibaug", "410 km", "Beach town for an extended getaway", "SUV, Premium Car"], ["Goa", "500 km", "Coastal holiday road trip", "SUV, Premium Car, 7-Seater"], ["Hyderabad", "300 km", "City travel, food and heritage", "Sedan, SUV, Premium Car"], ["Hampi", "360 km", "Historic ruins and dramatic landscapes", "SUV, 7-Seater"], ["Badami", "280 km", "Cave temples and red sandstone cliffs", "SUV, 7-Seater"], ["Aihole", "290 km", "Early Chalukyan temple trail", "SUV, 7-Seater"], ["Pattadakal", "300 km", "UNESCO temple complex", "SUV, 7-Seater"], ["Narsobawadi", "205 km", "Krishna river pilgrimage town", "Sedan, SUV, 7-Seater"], ["Satara", "190 km", "Kas Plateau and hill-country drive", "SUV, Premium Car"], ["Kaikadi Maharaj Mandir", "18 km", "Popular local spiritual destination", "Sedan, SUV"], ["Bhuikot Fort", "4 km", "Solapur's historic fort and gardens", "Sedan, Premium Car"], ["Ujani Dam", "110 km", "Birdwatching and waterside views", "SUV, 7-Seater"], ["Yedshi Ramling Ghat", "95 km", "Forest road and nature outing", "SUV, 7-Seater"],
].map(([name, distance, description, cars], index) => ({ name, distance, description, cars, image: photos[index % photos.length] }));

const vehicleTypes = ["Sedan", "SUV", "Premium Car", "7-Seater", "12-Seater"];
const WHATSAPP_PHONE = "918010374300";
const CALL_PHONE = "+918010374300";

export function DestinationsSection() {
  const [selected, setSelected] = useState<Destination[]>([]);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    returnDate: "",
    passengers: "4",
    carType: "Sedan",
    requirements: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const filtered = useMemo(() => places.filter(place => place.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const visible = showAll || query ? filtered : filtered.slice(0, 8);
  const toggle = (place: Destination) => setSelected(current => current.some(item => item.name === place.name) ? current.filter(item => item.name !== place.name) : [...current, place]);

  const handleSubmit = async (e: React.FormEvent, channel: "website" | "whatsapp") => {
    e.preventDefault();
    const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number starting with 6-9.");
      return;
    }

    const formatTravelDate = (dStr: string) => {
      try {
        const d = new Date(dStr);
        if (!isNaN(d.getTime())) return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      } catch {}
      return dStr;
    };

    const destString = selected.length ? selected.map(p => p.name).join(" → ") : "Solapur Sightseeing Tour";
    const formattedDate = formatTravelDate(formData.date);
    const returnDateText = formData.returnDate ? `\n• Return Date: ${formatTravelDate(formData.returnDate)}` : "";
    const messageText = `Multi-Destination Tour: Solapur to ${destString}. Travel Date: ${formData.date}${formData.returnDate ? `, Return: ${formData.returnDate}` : ""}. Passengers: ${formData.passengers}. Car Type: ${formData.carType}. Requirements: ${formData.requirements || "None"}.`;
    const waMsg = `Hello SS Tours & Travels,\n\nI want to plan a multi-destination tour for:\n• Route: Solapur to ${destString}\n• Travel Date: ${formattedDate}${returnDateText}\n• Passengers: ${formData.passengers}\n• Preferred Car: ${formData.carType}\n\nMy Details:\n• Name: ${formData.name.trim()}\n• Mobile: +91 ${cleanPhone}\n\nPlease share the custom itinerary quote and taxi availability. Thank you!`;
    const directUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(waMsg)}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (channel === "whatsapp") {
      void quoteApi.createQuote({
        carId: "default",
        customerName: formData.name.trim(),
        customerPhone: `+91${cleanPhone}`,
        customerEmail: formData.email.trim() || undefined,
        message: messageText,
        preferredContactMethod: "whatsapp"
      }).catch(() => {});

      if (isMobile) {
        window.location.href = directUrl;
      } else {
        window.open(directUrl, "_blank", "noopener,noreferrer");
      }
      setSubmitting(false);
      setSubmitted(true);
      return;
    }

    try {
      await quoteApi.createQuote({
        carId: "default",
        customerName: formData.name.trim(),
        customerPhone: `+91${cleanPhone}`,
        customerEmail: formData.email.trim() || undefined,
        message: messageText,
        preferredContactMethod: "phone"
      });

      setSubmitted(true);
    } catch (err) {
      setErrorMessage((err as Error).message || "Could not send quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="destinations" className="bg-[#F1F5F9] py-20 sm:py-24">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[.2em] text-[#9a7100]">PLAN YOUR JOURNEY</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Explore Solapur &amp; beyond.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base">
              Build a personalised route from 45 handpicked temples, nature escapes, heritage sites and nearby cities.
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search a destination"
              className="w-full rounded-full border border-[#D8E1EE] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#F9B900] focus:ring-4 focus:ring-[#F9B900]/15"
            />
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[#D8E1EE] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[.14em] text-[#9a7100]">YOUR MULTI-STOP ROUTE · {selected.length} SELECTED</p>
                <p className="mt-2 font-bold text-[#071D49]">Solapur → {selected.map(place => place.name).join(" → ")}</p>
              </div>
              <button
                onClick={() => { setSubmitted(false); setQuoteOpen(true); }}
                className="bg-[#071D49] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49]"
              >
                Request a Quote
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map(place => (
                <button
                  key={place.name}
                  onClick={() => toggle(place)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EAF1F8] px-3 py-1.5 text-xs font-bold text-[#071D49]"
                >
                  {place.name}
                  <X size={13} />
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {vehicleTypes.map(type => (
                <div key={type} className="flex items-center gap-2 border border-[#D8E1EE] px-3 py-2 text-xs font-bold">
                  <CarFront size={15} className="text-[#071D49]" />
                  {type}
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-emerald-700">
                    <CheckCircle2 size={13} />Available
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {visible.map(place => {
            const active = selected.some(item => item.name === place.name);
            return (
              <article
                key={place.name}
                className={`group overflow-hidden border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  active ? "border-[#F9B900] ring-2 ring-[#F9B900]/30" : "border-[#D8E1EE]"
                }`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={place.image} alt={place.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  {active && (
                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#F9B900] text-[#071D49]">
                      <Check size={17} strokeWidth={3} />
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-[#071D49]/90 px-2.5 py-1 text-[10px] font-bold text-white">
                    <MapPin size={12} className="text-[#F9B900]" />
                    {place.distance} from Solapur
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-extrabold text-[#071D49]">{place.name}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-relaxed text-[#64748B]">{place.description}</p>
                  <div className="mt-4 flex items-center justify-between border-y border-[#E2E8F0] py-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 size={15} />Cars Available
                    </span>
                    <span className="text-right font-semibold text-[#64748B]">{place.cars}</span>
                  </div>
                  <button
                    onClick={() => toggle(place)}
                    className={`mt-4 w-full py-3 text-sm font-bold transition ${
                      active ? "bg-[#F9B900] text-[#071D49]" : "bg-[#071D49] text-white hover:bg-[#F9B900] hover:text-[#071D49]"
                    }`}
                  >
                    {active ? "Selected" : "Select Destination"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!query && !showAll && (
          <div className="mt-9 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="border border-[#071D49] px-6 py-3 text-sm font-bold text-[#071D49] transition hover:bg-[#071D49] hover:text-white"
            >
              View All 45 Places
            </button>
          </div>
        )}
        {showAll && !query && (
          <div className="mt-9 text-center">
            <button onClick={() => setShowAll(false)} className="text-sm font-bold text-[#071D49] underline underline-offset-4">
              Show fewer places
            </button>
          </div>
        )}
      </div>

      {quoteOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#071D49]/75 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-4">
              <div>
                <p className="text-xs font-bold tracking-[.16em] text-[#9a7100]">TAILORED TRIP QUOTE</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#071D49] sm:text-3xl">Plan your route</h2>
              </div>
              <button
                type="button"
                onClick={() => setQuoteOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#071D49] hover:text-white"
                aria-label="Close quote form"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#EBFBF2] text-[#1E7E34]">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <h4 className="mt-4 text-2xl font-extrabold text-[#071D49]">Quote Request Received!</h4>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
                  Thank you, <b className="text-[#071D49]">{formData.name}</b>. We have received your request for{" "}
                  <b className="text-[#071D49]">Solapur → {selected.map(p => p.name).join(" → ") || "Tour"}</b>. Our dispatch team will send fare details shortly.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={`tel:${CALL_PHONE}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#071D49] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49]"
                  >
                    <Phone size={14} /> Call Dispatch (+91 80103 74300)
                  </a>
                  <button
                    type="button"
                    onClick={() => setQuoteOpen(false)}
                    className="rounded-xl border border-[#CBD5E1] px-5 py-3 text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, "website")} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-bold text-[#071D49]">
                    Full Name <span className="text-[#B42318]">*</span>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anand Deshmukh"
                      className="mt-1 w-full rounded-lg border border-[#D8E1EE] bg-[#F7F9FC] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#F9B900]"
                    />
                  </label>

                  <label className="text-xs font-bold text-[#071D49]">
                    Mobile / WhatsApp <span className="text-[#B42318]">*</span>
                    <div className="relative mt-1 flex rounded-lg border border-[#D8E1EE] bg-[#F7F9FC] overflow-hidden focus-within:border-[#F9B900] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F9B900]/20">
                      <span className="flex items-center bg-[#E2E8F0]/75 px-2.5 text-xs font-bold text-[#071D49] border-r border-[#D8E1EE] select-none">
                        +91
                      </span>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        title="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.startsWith("91") && val.length > 10) val = val.slice(2);
                          if (val.startsWith("0")) val = val.slice(1);
                          setFormData({ ...formData, phone: val.slice(0, 10) });
                        }}
                        placeholder="98765 43210"
                        className="w-full bg-transparent px-3 py-2.5 text-sm font-semibold text-[#071D49] outline-none"
                      />
                    </div>
                  </label>

                  <label className="text-xs font-bold text-[#071D49]">
                    Travel Date <span className="text-[#B42318]">*</span>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#D8E1EE] bg-[#F7F9FC] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#F9B900]"
                    />
                  </label>

                  <label className="text-xs font-bold text-[#071D49]">
                    Return Date (Optional)
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#D8E1EE] bg-[#F7F9FC] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#F9B900]"
                    />
                  </label>

                  <label className="text-xs font-bold text-[#071D49]">
                    Preferred Car Type
                    <select
                      value={formData.carType}
                      onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#D8E1EE] bg-[#F7F9FC] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#F9B900]"
                    >
                      {vehicleTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="text-xs font-bold text-[#071D49]">
                    Selected Destinations
                    <div className="mt-1 min-h-[42px] rounded-lg border border-[#D8E1EE] bg-[#F7F9FC] px-3 py-2.5 text-xs font-semibold text-[#071D49]">
                      {selected.length ? selected.map((item) => item.name).join(" → ") : "No destinations selected"}
                    </div>
                  </div>
                </div>

                <label className="block text-xs font-bold text-[#071D49]">
                  Additional Requirements (Optional)
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="mt-1 h-20 w-full rounded-lg border border-[#D8E1EE] bg-[#F7F9FC] p-3 text-sm font-normal outline-none focus:border-[#F9B900]"
                    placeholder="Pickup address, specific timing, number of bags..."
                  />
                </label>

                {errorMessage && (
                  <p role="alert" className="rounded-lg bg-[#FFF2F2] p-2 text-xs font-bold text-[#B42318]">
                    {errorMessage}
                  </p>
                )}

                <div className="pt-2 grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#071D49] py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#F9B900] hover:text-[#071D49] disabled:opacity-60"
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
                    onClick={(e) => handleSubmit(e, "whatsapp")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#1EBE5D] disabled:opacity-60"
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
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
