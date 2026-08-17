import { Star, Users } from "lucide-react";

export type FleetCar = {
  name: string;
  type: string;
  seats: string;
  rate: string;
  tag: string;
  img: string;
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
    <article className="group overflow-hidden border border-[#DDE4EF] bg-white shadow-[0_10px_28px_rgba(7,29,73,.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c5d0e0] hover:shadow-[0_18px_38px_rgba(7,29,73,.12)]">
      {/* Image canvas */}
      <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#eef3f9] to-[#dce7f3] p-4 sm:p-5">
        <span className="absolute left-3 top-3 z-10 bg-[#F9B900] px-3 py-1 text-[10px] font-extrabold tracking-[.14em] text-[#071D49] shadow-[3px_3px_0_rgba(7,29,73,.14)]">
          {car.tag}
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

        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#071D49]">
          {car.name}
        </h3>

        <div className="mt-4 flex items-center justify-between border-y border-[#E2E8F0] py-3 text-sm">
          <span className="flex items-center gap-1.5 text-[#64748B]">
            <Users className="text-[#F9B900]" size={15} />
            {car.seats}
          </span>
          <b className="text-base text-[#071D49]">{car.rate}</b>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onViewDetails(car)}
            className="border border-[#071D49] py-2.5 text-xs font-bold text-[#071D49] transition-colors duration-200 hover:bg-[#071D49] hover:text-white"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onBook(car)}
            className="bg-[#071D49] py-2.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-[#F9B900] hover:text-[#071D49]"
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}
