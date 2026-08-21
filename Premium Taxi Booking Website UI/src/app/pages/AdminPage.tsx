import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { Car, QuoteRequest, Stats } from "../../api/types";
import { DashboardLayout, ErrorState, LoadingState, StatusBadge } from "../components/dashboard/DashboardLayout";
import { GalleryManager } from "../components/dashboard/GalleryManager";

function quoteWhatsappMessage(quote: QuoteRequest) {
  const car = typeof quote.carId === "object" ? quote.carId : null;
  return `Hello ${quote.customerName},\n\nThank you for your quote request${car ? ` for ${car.name}` : ""}.\n\nYour requirement:\n${quote.message}\n\nHow may we help you?`;
}

export function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null), [quotes, setQuotes] = useState<QuoteRequest[]>([]), [cars, setCars] = useState<Car[]>([]), [error, setError] = useState(""), [loading, setLoading] = useState(true);
  const load = () => Promise.all([adminApi.getStats(), adminApi.getQuotes(), adminApi.getCars()]).then(([s, q, c]) => { setStats(s); setQuotes(q); setCars(c.items); }).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);
  return <DashboardLayout eyebrow="OPERATIONS" title="Admin Dashboard">{error && <ErrorState message={error} />}{loading ? <LoadingState /> : <><div className="grid gap-4 sm:grid-cols-3">{[["Cars", stats?.totalCars], ["Active", stats?.activeCars], ["New requests", stats?.newQuoteRequests]].map(([label, value]) => <div key={label as string} className="border bg-white p-5"><p className="text-2xl font-extrabold">{value as number}</p><p className="text-xs">{label as string}</p></div>)}</div><section className="mt-8 border bg-white p-5"><h2 className="font-extrabold">Quote Requests</h2>{quotes.map((quote) => { const phone = quote.customerPhone.replace(/\D/g, ""); return <div key={quote._id} className="border-t py-4"><b>{quote.customerName}</b><p className="text-xs">{quote.customerPhone} · {quote.customerEmail}</p><p className="mt-2 text-sm">{quote.message}</p><div className="mt-3 flex flex-wrap gap-2"><a href={`tel:${quote.customerPhone}`} className="inline-flex items-center gap-1 bg-[#071D49] px-3 py-2 text-xs font-bold text-white"><Phone size={14} /> Call</a><a href={`https://wa.me/${phone}?text=${encodeURIComponent(quoteWhatsappMessage(quote))}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 border border-[#26734D] px-3 py-2 text-xs font-bold text-[#26734D]"><MessageCircle size={14} /> Send WhatsApp</a></div></div>; })}</section><section className="mt-8 border bg-white p-5"><h2 className="font-extrabold">Cars</h2>{cars.map((car) => <div key={car._id} className="flex items-center gap-3 border-t py-3"><img src={car.images[0]} alt="" className="h-12 w-16 object-cover" /><span>{car.name} · {car.location}</span><StatusBadge status={car.status} /></div>)}</section></>}</DashboardLayout>;
}
