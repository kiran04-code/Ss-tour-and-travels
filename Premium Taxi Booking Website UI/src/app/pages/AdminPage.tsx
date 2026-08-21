import {
  CarFront,
  Clock,
  ImageIcon,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { Car, QuoteRequest, QuoteStatus, Stats } from "../../api/types";
import {
  DashboardLayout,
  ErrorState,
  LoadingState,
  StatusBadge
} from "../components/dashboard/DashboardLayout";
import { GalleryManager } from "../components/dashboard/GalleryManager";

function quoteWhatsappMessage(quote: QuoteRequest) {
  const car = typeof quote.carId === "object" ? quote.carId : null;
  return `Hello ${quote.customerName},\n\nThank you for reaching out to SS Tours & Travels${car ? ` for ${car.name}` : ""}.\n\nYour travel request:\n${quote.message}\n\nWe would be happy to confirm your ride. How may we assist you?`;
}

type TabType = "all" | "quotes" | "cars" | "gallery";

export function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [quoteSearch, setQuoteSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingQuoteId, setUpdatingQuoteId] = useState<string | null>(null);

  const load = () =>
    Promise.all([adminApi.getStats(), adminApi.getQuotes(), adminApi.getCars()])
      .then(([s, q, c]) => {
        setStats(s);
        setQuotes(q);
        setCars(c.items);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    void load();
  }, []);

  const handleStatusChange = async (quoteId: string, newStatus: QuoteStatus) => {
    setUpdatingQuoteId(quoteId);
    try {
      await adminApi.updateQuoteStatus(quoteId, newStatus);
      setQuotes((prev) =>
        prev.map((q) => (q._id === quoteId ? { ...q, status: newStatus } : q))
      );
    } catch (err) {
      alert((err as Error).message || "Failed to update quote status");
    } finally {
      setUpdatingQuoteId(null);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await adminApi.deleteCar(carId);
        setCars((prev) => prev.filter((c) => c._id !== carId));
      } catch (err) {
        alert((err as Error).message || "Failed to delete car");
      }
    }
  };

  const handleCarStatusChange = async (carId: string, newStatus: Car["status"]) => {
    try {
      await adminApi.updateCarStatus(carId, newStatus);
      setCars((prev) =>
        prev.map((c) => (c._id === carId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert((err as Error).message || "Failed to update car status");
    }
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        quoteSearch === "" ||
        q.customerName.toLowerCase().includes(quoteSearch.toLowerCase()) ||
        q.customerPhone.includes(quoteSearch) ||
        q.customerEmail.toLowerCase().includes(quoteSearch.toLowerCase()) ||
        q.message.toLowerCase().includes(quoteSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, quoteSearch, statusFilter]);

  const newQuotesCount = useMemo(
    () => quotes.filter((q) => q.status === "new").length,
    [quotes]
  );

  return (
    <DashboardLayout
      eyebrow="ADMINISTRATION"
      title="Admin Dashboard"
      showGalleryManager={false}
    >
      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => setActiveTab("cars")}
              className="cursor-pointer rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#F9B900]"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-bold uppercase tracking-wider">Total Cars</span>
                <CarFront size={18} className="text-[#071D49]" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-[#071D49]">
                {stats?.totalCars ?? cars.length}
              </p>
              <p className="mt-1 text-xs text-[#26734D] font-semibold">
                {stats?.activeCars ?? 0} active in fleet
              </p>
            </div>

            <div
              onClick={() => {
                setActiveTab("quotes");
                setStatusFilter("new");
              }}
              className="cursor-pointer rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#F9B900]"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-bold uppercase tracking-wider">New Inquiries</span>
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FFF4CC] text-[10px] font-extrabold text-[#805F00]">
                  {newQuotesCount}
                </span>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-[#805F00]">
                {newQuotesCount}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">Pending response</p>
            </div>

            <div
              onClick={() => {
                setActiveTab("quotes");
                setStatusFilter("all");
              }}
              className="cursor-pointer rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#F9B900]"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-bold uppercase tracking-wider">Total Quotes</span>
                <Clock size={18} className="text-[#071D49]" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-[#071D49]">
                {quotes.length}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">All received bookings</p>
            </div>

            <div
              onClick={() => setActiveTab("gallery")}
              className="cursor-pointer rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#F9B900]"
            >
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-bold uppercase tracking-wider">Gallery</span>
                <ImageIcon size={18} className="text-[#071D49]" />
              </div>
              <p className="mt-3 text-sm font-bold text-[#071D49]">Manage Photos</p>
              <p className="mt-1 text-xs text-[#64748B]">Website showcase</p>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "all"
                    ? "bg-[#071D49] text-white shadow-sm"
                    : "border border-[#DDE4EF] bg-white text-[#475569] hover:border-[#F9B900]"
                }`}
              >
                All Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("quotes")}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "quotes"
                    ? "bg-[#071D49] text-white shadow-sm"
                    : "border border-[#DDE4EF] bg-white text-[#475569] hover:border-[#F9B900]"
                }`}
              >
                Quote Requests ({quotes.length})
                {newQuotesCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#F9B900] px-1.5 py-0.2 text-[10px] text-[#071D49]">
                    {newQuotesCount} new
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cars")}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "cars"
                    ? "bg-[#071D49] text-white shadow-sm"
                    : "border border-[#DDE4EF] bg-white text-[#475569] hover:border-[#F9B900]"
                }`}
              >
                Cars Fleet ({cars.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "gallery"
                    ? "bg-[#071D49] text-white shadow-sm"
                    : "border border-[#DDE4EF] bg-white text-[#475569] hover:border-[#F9B900]"
                }`}
              >
                Gallery Manager
              </button>
            </div>

            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE4EF] bg-white px-3 py-2 text-xs font-bold text-[#64748B] transition hover:text-[#071D49]"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Main Content Grid */}
          <div
            className={`grid gap-6 ${
              activeTab === "all" ? "lg:grid-cols-12" : "grid-cols-1"
            }`}
          >
            {/* Quote Requests Module */}
            {(activeTab === "all" || activeTab === "quotes") && (
              <section
                className={`rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm ${
                  activeTab === "all" ? "lg:col-span-7" : "w-full"
                }`}
              >
                {/* Module Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#071D49]">
                      Quote Requests
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Showing {filteredQuotes.length} of {quotes.length} inquiries
                    </p>
                  </div>

                  {/* Status Filter Chips */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                    {["all", "new", "contacted", "quoted", "closed"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`rounded-md px-2.5 py-1 uppercase tracking-wider transition ${
                          statusFilter === st
                            ? "bg-[#071D49] text-white"
                            : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mt-4">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  />
                  <input
                    type="text"
                    value={quoteSearch}
                    onChange={(e) => setQuoteSearch(e.target.value)}
                    placeholder="Search by customer name, phone, or route..."
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#F9B900] focus:bg-white"
                  />
                </div>

                {/* Scrollable Quotes List */}
                <div className="mt-4 max-h-[540px] space-y-3 overflow-y-auto pr-1">
                  {filteredQuotes.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#CBD5E1] py-12 text-center text-xs text-[#64748B]">
                      No quote requests match your filter.
                    </div>
                  ) : (
                    filteredQuotes.map((quote) => {
                      const cleanPhone = quote.customerPhone.replace(/\D/g, "");
                      return (
                        <article
                          key={quote._id}
                          className="group relative rounded-lg border border-[#E2E8F0] bg-white p-4 transition-all duration-200 hover:border-[#F9B900] hover:shadow-md"
                        >
                          {/* Card Top Row */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                            <div>
                              <b className="text-sm font-extrabold text-[#071D49]">
                                {quote.customerName}
                              </b>
                              <span className="ml-2 text-[11px] text-[#94A3B8]">
                                {new Date(quote.createdAt).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-1.5">
                              <StatusBadge status={quote.status} />
                              <select
                                disabled={updatingQuoteId === quote._id}
                                value={quote.status}
                                onChange={(e) =>
                                  void handleStatusChange(
                                    quote._id,
                                    e.target.value as QuoteStatus
                                  )
                                }
                                className="cursor-pointer rounded border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1 text-[11px] font-bold text-[#071D49] outline-none hover:border-[#F9B900]"
                              >
                                <option value="new">Mark New</option>
                                <option value="contacted">Mark Contacted</option>
                                <option value="quoted">Mark Quoted</option>
                                <option value="closed">Mark Closed</option>
                              </select>
                            </div>
                          </div>

                          {/* Contact Info & Message */}
                          <div className="mt-2.5">
                            <p className="text-xs text-[#64748B]">
                              📞 {quote.customerPhone} &nbsp;·&nbsp; ✉️{" "}
                              {quote.customerEmail}
                            </p>
                            <div className="mt-2 rounded bg-[#F8FAFC] p-2.5 text-xs leading-relaxed text-[#334155]">
                              {quote.message}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="mt-3 flex flex-wrap gap-2 pt-2">
                            <a
                              href={`tel:${quote.customerPhone}`}
                              className="inline-flex items-center gap-1.5 rounded-md bg-[#071D49] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#F9B900] hover:text-[#071D49]"
                            >
                              <Phone size={13} /> Call
                            </a>

                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                quoteWhatsappMessage(quote)
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-md border border-[#26734D] bg-[#EEF7F1] px-3 py-1.5 text-xs font-bold text-[#26734D] transition hover:bg-[#26734D] hover:text-white"
                            >
                              <MessageCircle size={13} /> Reply on WhatsApp
                            </a>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {/* Right Column: Fleet & Gallery Modules */}
            {(activeTab === "all" || activeTab === "cars" || activeTab === "gallery") && (
              <div
                className={`space-y-6 ${
                  activeTab === "all" ? "lg:col-span-5" : "w-full"
                }`}
              >
                {/* Car Inventory Module */}
                {(activeTab === "all" || activeTab === "cars") && (
                  <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-extrabold text-[#071D49]">
                          Car Inventory
                        </h2>
                        <p className="text-xs text-[#64748B]">
                          {cars.length} cars in fleet
                        </p>
                      </div>
                      <a
                        href="/dashboard/cars/new"
                        className="inline-flex items-center gap-1 rounded-lg bg-[#F9B900] px-3 py-1.5 text-xs font-bold text-[#071D49] transition hover:bg-[#e6ad00]"
                      >
                        <Plus size={14} /> Add Car
                      </a>
                    </div>

                    <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
                      {cars.length === 0 ? (
                        <p className="py-8 text-center text-xs text-[#64748B]">
                          No cars listed yet.
                        </p>
                      ) : (
                        cars.map((car) => (
                          <div
                            key={car._id}
                            className="flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] p-3 transition hover:border-[#F9B900]"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={car.images[0]}
                                alt={car.name}
                                className="h-12 w-16 rounded object-cover"
                              />
                              <div>
                                <h4 className="text-xs font-extrabold text-[#071D49]">
                                  {car.name}
                                </h4>
                                <p className="text-[11px] text-[#64748B]">
                                  {car.location} · {car.fuelType}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={car.status}
                                onChange={(e) =>
                                  void handleCarStatusChange(
                                    car._id,
                                    e.target.value as Car["status"]
                                  )
                                }
                                className="rounded border border-[#CBD5E1] bg-[#F8FAFC] px-1.5 py-1 text-[10px] font-bold text-[#071D49]"
                              >
                                <option value="available">Available</option>
                                <option value="inactive">Inactive</option>
                                <option value="sold">Sold</option>
                              </select>

                              <a
                                href={`/dashboard/cars/${car._id}/edit`}
                                className="p-1 text-[#64748B] hover:text-[#071D49]"
                                title="Edit car"
                              >
                                <Pencil size={14} />
                              </a>

                              <button
                                type="button"
                                onClick={() => void handleDeleteCar(car._id)}
                                className="p-1 text-[#B42318] hover:opacity-80"
                                title="Delete car"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                )}

                {/* Gallery Manager Module */}
                {(activeTab === "all" || activeTab === "gallery") && (
                  <GalleryManager />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

