import { ArrowRight } from "lucide-react";
import image1 from "../../public/image1.png";
import image2 from "../../public/image2.jpg";
import image3 from "../../public/image3.png";
import image4 from "../../public/image.png";

const gallery = [
  { src: image1, label: "Family time", caption: "More smiles, less planning.", className: "sm:row-span-2" },
  { src: image2, label: "Days worth sharing", caption: "Comfortable road trips", className: "" },
  { src: image3, label: "Travel together", caption: "Memories on every mile", className: "" },
  { src: image4, label: "Safe journeys", caption: "Ready when you are", className: "sm:col-span-2" },
];

export function GallerySection() {
  return <section id="gallery" className="bg-white py-16 sm:py-20"><div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
    <div className="max-w-md"><p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[.18em] text-[#9a7100]"><span className="h-px w-7 bg-[#FFC928]" /> TRAVEL EXPERIENCE</p><h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#171717] sm:text-5xl">Made for the moments you remember.</h2><p className="mt-5 text-sm leading-7 text-[#666] sm:text-base">From family temple visits to weekends away, every ride is planned around a safe, simple and comfortable journey for everyone onboard.</p><div className="mt-7 grid grid-cols-3 gap-3"><div className="border-l-2 border-[#FFC928] pl-3"><b className="block text-xl font-extrabold text-[#171717]">14+</b><span className="text-[10px] text-[#666]">Years of trust</span></div><div className="border-l-2 border-[#FFC928] pl-3"><b className="block text-xl font-extrabold text-[#171717]">25k+</b><span className="text-[10px] text-[#666]">Happy journeys</span></div><div className="border-l-2 border-[#FFC928] pl-3"><b className="block text-xl font-extrabold text-[#171717]">24/7</b><span className="text-[10px] text-[#666]">Travel support</span></div></div><a href="#book" className="mt-8 inline-flex items-center rounded-lg bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FFC928] hover:text-[#171717]">Plan your next trip <ArrowRight className="ml-2" size={16} /></a></div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:grid-rows-2 sm:gap-4">{gallery.map(item => <figure key={item.label} className={`group relative min-h-[170px] overflow-hidden rounded-lg bg-[#f7f7f7] ${item.className}`}><img src={item.src} alt={item.label} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 pb-3 pt-12 text-white"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#FFC928]">{item.label}</p><p className="mt-1 text-sm font-bold">{item.caption}</p></figcaption></figure>)}</div>
  </div></section>;
}
