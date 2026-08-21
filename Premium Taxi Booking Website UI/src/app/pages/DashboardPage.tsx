import { CalendarDays, CheckCircle2, CarFront, Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { Car, Stats } from "../../api/types";
import { DashboardLayout, ErrorState, LoadingState, StatusBadge } from "../components/dashboard/DashboardLayout";
import { signOut } from "../auth";

export function DashboardPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([adminApi.getCars(), adminApi.getStats()])
      .then(([result, nextStats]) => {
        setCars(result.items);
        setStats(nextStats);
      })
      .catch((e: Error) => {
        if (
          e.message.toLowerCase().includes("authorization") ||
          e.message.toLowerCase().includes("401") ||
          e.message.toLowerCase().includes("unauthorized")
        ) {
          signOut();
          window.location.replace("/login");
          return;
        }
        setError(e.message);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (window.confirm("Delete this car and its quote requests?")) {
      await adminApi.deleteCar(id);
      void load();
    }
  }

  return (
    <DashboardLayout title="My Cars">
      {error && <ErrorState message={error} />}
      {loading ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Total Cars", stats?.totalCars || 0, CarFront],
              ["Active Cars", stats?.activeCars || 0, CheckCircle2],
              ["Quote Requests", stats?.totalQuoteRequests || 0, Eye]
            ].map(([label, value, Icon]) => {
              const I = Icon as typeof CarFront;
              return (
                <div key={label as string} className="rounded-xl border border-[#DDE4EF] bg-white p-5 shadow-sm">
                  <I size={20} className="text-[#9a7100]" />
                  <p className="mt-2 text-2xl font-extrabold text-[#071D49]">{value as number}</p>
                  <p className="text-xs font-bold text-[#64748B]">{label as string}</p>
                </div>
              );
            })}
          </div>

          <section className="mt-8 rounded-xl border border-[#DDE4EF] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] p-5">
              <h2 className="text-xl font-extrabold text-[#071D49]">My Cars</h2>
              <a href="/dashboard/cars/new" className="rounded-lg bg-[#F9B900] px-4 py-2 text-xs font-extrabold text-[#071D49] shadow-sm hover:bg-[#e6ad00]">
                Add a car
              </a>
            </div>
            {cars.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#64748B]">No cars in fleet yet. Click "Add a car" to list your first vehicle.</div>
            ) : (
              cars.map((car) => (
                <div key={car._id} className="grid gap-4 border-t border-[#F1F5F9] p-5 md:grid-cols-[100px_1fr_auto] items-center">
                  <img src={car.images[0]} alt={car.name} className="h-16 w-full rounded-lg object-cover" />
                  <div>
                    <h3 className="font-extrabold text-[#071D49]">
                      {car.name} <StatusBadge status={car.status} />
                    </h3>
                    <p className="mt-1 text-xs text-[#64748B]">
                      <CalendarDays className="mr-1 inline" size={13} />
                      {car.location} · Listed {new Date(car.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`/cars/${car._id}`} title="View Car" className="rounded-lg border border-[#DDE4EF] p-2 text-[#475569] hover:bg-[#F8FAFC]">
                      <Eye size={16} />
                    </a>
                    <a href={`/dashboard/cars/${car._id}/edit`} title="Edit Car" className="rounded-lg border border-[#DDE4EF] p-2 text-[#475569] hover:bg-[#F8FAFC]">
                      <Pencil size={16} />
                    </a>
                    <button onClick={() => void remove(car._id)} title="Delete Car" className="rounded-lg border border-[#FEE4E2] p-2 text-[#B42318] hover:bg-[#FEF3F2]">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

