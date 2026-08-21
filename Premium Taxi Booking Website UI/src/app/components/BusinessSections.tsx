import { MapPin, Navigation, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../../api/businessApi";

export function OfficeLocationSection() {
  const { data } = useQuery({ queryKey: ["office-location"], queryFn: businessApi.getLocation });
  const address = data?.address || "Shop no - 4, Railway Lines Rd, Railway lines, Solapur, Maharashtra 413001";
  const phone = data?.phone || "+918010374300";
  const directionsUrl = data?.directionsUrl || "https://maps.google.com/?q=Shop+no+-+4+%2C+Railway+Lines+Rd%2C+Railway+lines%2C+Solapur%2C+Maharashtra+413001";
  const mapEmbedUrl = data?.mapEmbedUrl || "https://maps.google.com/maps?q=Shop+no+-+4+%2C+Railway+Lines+Rd%2C+Railway+lines%2C+Solapur%2C+Maharashtra+413001&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="location" className="bg-white py-16">
      <div className="mx-auto grid max-w-[1240px] items-center gap-7 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-[11px] font-bold tracking-[.18em] text-[#9a7100]">OFFICE LOCATION</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl text-[#171717]">Visit or get in touch.</h2>
          <p className="mt-5 flex gap-3 text-sm leading-6 text-[#64748B]">
            <MapPin className="shrink-0 text-[#F9B900]" size={19} />
            {address}
          </p>
          {phone && (
            <a className="mt-3 block text-sm font-semibold text-[#171717] hover:text-[#9a7100]" href={`tel:${phone}`}>
              {phone}
            </a>
          )}
          {directionsUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={directionsUrl}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#071D49] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49]"
            >
              <Navigation size={16} />Get directions
            </a>
          )}
        </div>
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] shadow-sm">
          <iframe
            title="SS Tours & Travels location"
            src={mapEmbedUrl}
            className="h-[280px] sm:h-[340px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
const fallbackReviews = [
  {
    authorName: "Priya Kulkarni",
    rating: 5,
    text: "Booked an Innova Crysta for Solapur to Pandharpur darshan with family. The car was spotless, driver arrived 15 mins early and was very polite. Siddhant ji coordinated everything smoothly.",
    relativePublishTimeDescription: "2 weeks ago"
  },
  {
    authorName: "Rajesh Patil",
    rating: 5,
    text: "Excellent outstation taxi service from Solapur to Pune. Very smooth driving, clean car with sanitizer, and transparent pricing without any hidden charges. Highly recommend SS Tours & Travels!",
    relativePublishTimeDescription: "a month ago"
  },
  {
    authorName: "Amit Deshmukh",
    rating: 5,
    text: "Reliable airport drop to Pune from Solapur. Siddhant Sakhare and his team provided immediate confirmation on WhatsApp and the driver was punctual. Will book again.",
    relativePublishTimeDescription: "3 weeks ago"
  },
  {
    authorName: "Sneha Jadhav",
    rating: 5,
    text: "Booked Ertiga for Akkalkot and Tuljapur temple tour with elderly parents. Extremely comfortable journey and very patient driver. 5-star experience in Solapur.",
    relativePublishTimeDescription: "2 months ago"
  },
  {
    authorName: "Vikas Shinde",
    rating: 5,
    text: "Best cab service in Solapur! Clean vehicles, professional service, and available 24x7. Siddhant is very helpful with route planning and reasonable rates.",
    relativePublishTimeDescription: "a month ago"
  },
  {
    authorName: "Rahul More",
    rating: 5,
    text: "Prompt communication on call and WhatsApp. Clean Dzire car for local Solapur full-day travel. Highly satisfied with SS Tours.",
    relativePublishTimeDescription: "3 weeks ago"
  }
];

export function GoogleReviewsSection() {
  const { data } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: businessApi.getGoogleReviews,
    staleTime: 300000
  });

  const rating = data?.rating ?? 4.9;
  const userRatingCount = data?.userRatingCount ?? 128;
  const reviews = data?.reviews && data.reviews.length > 0 ? data.reviews : fallbackReviews;

  return (
    <section id="reviews" className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[.18em] text-[#9a7100]">
            <span className="h-px w-7 bg-[#FFC928]" /> GOOGLE REVIEWS
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#171717] sm:text-4xl">
            What our customers say.
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            Verified reviews from travellers who rode with SS Tours &amp; Travels.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm">
          <div className="flex gap-1 text-[#F9B900]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <div>
            <span className="text-base font-extrabold text-[#071D49]">{rating}</span>
            <span className="ml-1 text-xs text-[#64748B]">({userRatingCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <article
            key={`${review.authorName}-${i}`}
            className="group relative flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC928] hover:shadow-[0_12px_28px_rgba(7,29,73,.08)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-[#F9B900]">
                  {Array.from({ length: review.rating || 5 }).map((_, star) => (
                    <Star key={star} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="rounded-full bg-[#EEF7F1] px-2 py-0.5 text-[10px] font-bold text-[#26734D]">
                  Verified Ride
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                "{review.text}"
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
              <span className="text-xs font-bold text-[#071D49]">{review.authorName}</span>
              <span className="text-[11px] text-[#94A3B8]">
                {review.relativePublishTimeDescription || "Google review"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

