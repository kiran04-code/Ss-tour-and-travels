import { ChevronDown, HelpCircle, MessageCircle, Phone, Sparkles } from "lucide-react";
import { useState } from "react";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: "Booking" | "Temple Tours" | "Pricing" | "Fleet" | "Airport";
};

const faqs: FAQItem[] = [
  {
    id: "booking",
    category: "Booking",
    question: "How do I book a cab with SS Tours & Travels Solapur?",
    answer:
      "You can book instantly by calling our 24/7 hotline at +91 80103 74300, sending us a message on WhatsApp, or submitting the quick quote form on this website. Our team confirms your ride immediately with vehicle and driver details."
  },
  {
    id: "temple-tours",
    category: "Temple Tours",
    question: "Which temple pilgrimage packages do you offer from Solapur?",
    answer:
      "We specialize in hassle-free temple darshan packages from Solapur to Pandharpur (Shri Vitthal-Rukmini Mandir), Akkalkot (Shri Swami Samarth Maharaj Math), Tuljapur (Bhavani Mata Mandir), and Ganagapur (Dattatreya Temple). Same-day return and customized multi-temple circuits are available."
  },
  {
    id: "pricing",
    category: "Pricing",
    question: "Are there any hidden costs, night charges, or surprise fees?",
    answer:
      "No. We take pride in 100% transparent pricing. All toll taxes, driver allowance, and route rates are discussed clearly prior to confirming your booking. What we quote is what you pay."
  },
  {
    id: "fleet",
    category: "Fleet",
    question: "What types of cars and seating capacities are available?",
    answer:
      "Our fleet includes clean, sanitized, and air-conditioned vehicles: Toyota Innova Crysta (6-7 seater), Maruti Ertiga (6 seater), Swift Dzire / sedans (4 seater), and tempo travellers for larger group travel."
  },
  {
    id: "airport",
    category: "Airport",
    question: "Do you provide 24/7 airport pickup and drop services?",
    answer:
      "Yes, we provide 24/7 on-time airport transfers between Solapur and Pune International Airport (PNQ), Mumbai Chhatrapati Shivaji Maharaj Airport (BOM), and Hyderabad Airport (HYD) with flight time tracking."
  },
  {
    id: "multiday",
    category: "Booking",
    question: "Can I book a car with driver for multi-day outstation trips?",
    answer:
      "Yes! We offer flexible outstation rental packages for Goa, Mahabaleshwar, Kolhapur, Shirdi, and across Maharashtra & Karnataka. The dedicated vehicle and experienced driver remain at your disposal throughout the tour."
  },
  {
    id: "payment",
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept Google Pay, PhonePe, Paytm, UPI, Bank Transfer (IMPS/NEFT), and Cash. You can pay an initial token at booking and the remainder upon completion of your trip."
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("booking");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Booking", "Temple Tours", "Pricing", "Fleet", "Airport"];

  const filteredFaqs = faqs.filter(
    (faq) => activeCategory === "All" || faq.category === activeCategory
  );

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[.2em] text-[#9a7100]">
            <span className="h-px w-6 bg-[#FFC928]" />
            FREQUENTLY ASKED QUESTIONS
            <span className="h-px w-6 bg-[#FFC928]" />
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#071D49] sm:text-4xl lg:text-5xl">
            Everything you need to know.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#64748B] sm:text-base">
            Clear answers about our Solapur taxi services, temple packages, pricing, and fleet.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  activeCategory === category
                    ? "bg-[#071D49] text-white shadow-sm"
                    : "border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#F9B900] hover:text-[#071D49]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-[#F9B900] bg-[#FFFDF7] shadow-md ring-1 ring-[#F9B900]/20"
                    : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold ${
                        isOpen
                          ? "bg-[#F9B900] text-[#071D49]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      <HelpCircle size={15} />
                    </span>
                    <h3 className="text-sm font-extrabold text-[#071D49] sm:text-base">
                      {faq.question}
                    </h3>
                  </div>

                  <ChevronDown
                    size={19}
                    className={`shrink-0 text-[#64748B] transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#9a7100]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#F9B900]/20 px-5 pb-6 pt-3 text-xs leading-relaxed text-[#475569] sm:px-6 sm:text-sm">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need More Help Banner */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] p-6 text-center shadow-sm sm:p-8">
          <div className="inline-grid h-12 w-12 place-items-center rounded-full bg-[#FFF4CC] text-[#805F00]">
            <Sparkles size={22} />
          </div>
          <h4 className="mt-3 text-lg font-extrabold text-[#071D49]">
            Still have questions or need a custom quote?
          </h4>
          <p className="mt-1 text-xs text-[#64748B] sm:text-sm">
            Contact Siddhant Sakhare directly for instant assistance, route suggestions, and bookings.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+918010374300"
              className="inline-flex items-center gap-2 rounded-xl bg-[#071D49] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#F9B900] hover:text-[#071D49] active:scale-[0.98]"
            >
              <Phone size={14} /> Call +91 80103 74300
            </a>

            <a
              href="https://wa.me/918010374300?text=Hello%20SS%20Tours%20%26%20Travels,%20I%20have%20a%20question%20regarding%20a%20taxi%20booking."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#26734D] bg-[#EEF7F1] px-5 py-3 text-xs font-bold text-[#26734D] transition hover:bg-[#26734D] hover:text-white active:scale-[0.98]"
            >
              <MessageCircle size={14} /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
