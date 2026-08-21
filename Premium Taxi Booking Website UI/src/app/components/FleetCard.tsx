import { Star, Users } from "lucide-react";

export type FleetCar = {
  id?: string;
  name: string;
  type: string;
  seats: string;
  tag: string;
  img: string;
  images?: string[];
  description?: string;
  fuelType?: string;
  transmission?: string;
  location?: string;
  status?: "available" | "sold" | "inactive";
};

function Stars() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex gap-0.5 text-[#F9B900]">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={12} fill="currentColor" />
        ))}
      </span>
      <b className="text-xs text-[#071D49]">4.9</b>
    </span>
  );
}

type FleetCardProps = {
  car: FleetCar;
  onViewDetails: (car: FleetCar) => void;
  onBook: (car: FleetCar) => void;
};

export function FleetCard({ car, onViewDetails, onBook }: FleetCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-[0_5px_18px_rgba(0,0,0,.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC928] hover:shadow-[0_14px_30px_rgba(0,0,0,.1)]">
      {/* Image canvas */}
      <div className="relative flex aspect-[16/10] items-center justify-center bg-[#F7F7F7] p-4 sm:p-5">
        <span className="absolute left-3 top-3 z-10 rounded bg-[#FFC928] px-3 py-1 text-[10px] font-extrabold tracking-[.14em] text-[#171717]">
          {car.status === "available" ? car.tag : car.status === "sold" ? "Sold" : "Unavailable"}
        </span>
        <img
          src={car.img}
          alt={car.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#64748B]">
            {car.type}
          </p>
          <Stars />
        </div>

        <h3 className="mt-2 text-xl font-extrabold tracking-tight text-[#171717]">
          {car.name}
        </h3>

        <div className="mt-4 flex items-center justify-between border-y border-[#E2E8F0] py-3 text-sm">
          <span className="flex items-center gap-1.5 text-[#64748B]">
            <Users className="text-[#F9B900]" size={15} />
            {car.seats}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onViewDetails(car)}
            className="rounded-lg border border-[#171717] py-2.5 text-xs font-bold text-[#171717] transition-colors duration-200 hover:bg-[#171717] hover:text-white"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onBook(car)}
            disabled={car.status !== "available"}
            className="rounded-lg bg-[#FFC928] py-2.5 text-xs font-bold text-[#171717] transition-colors duration-200 hover:bg-[#e6ad00] disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#94A3B8]"
          >
            {car.status === "available" ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}
