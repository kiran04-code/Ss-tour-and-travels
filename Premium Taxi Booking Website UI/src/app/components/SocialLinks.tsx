import { Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../../api/businessApi";

const defaultSocials = [
  { platform: "Instagram", url: "https://www.instagram.com/sstoursandtravels_solapur?igsi=bmgzcnlrcjA3aDlu", handle: "@sstoursandtravels_solapur" },
  { platform: "Facebook", url: "https://www.facebook.com", handle: "SS Tours Solapur" },
  { platform: "WhatsApp", url: "https://wa.me/918010374300", handle: "+91 80103 74300" },
  { platform: "YouTube", url: "https://www.youtube.com", handle: "SS Tours & Travels" }
];

const icons: Record<string, typeof Instagram> = {
  Instagram,
  Facebook,
  WhatsApp: MessageCircle,
  YouTube: Youtube
};

export function SocialLinks() {
  const { data: apiData = [] } = useQuery({
    queryKey: ["social-links"],
    queryFn: businessApi.getSocialLinks
  });

  const links = apiData.length ? apiData : defaultSocials;

  return (
    <div>
      <p className="text-xs font-extrabold tracking-[.18em] text-[#F9B900]">
        CONNECT WITH US
      </p>
      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
        {links.map((link) => {
          const Icon = icons[link.platform] || icons[link.platform.toLowerCase()];
          if (!Icon) return null;
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow SS Tours & Travels on ${link.platform}`}
              className="group grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/5 text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F9B900] hover:bg-[#F9B900] hover:text-[#071D49] hover:shadow-[0_8px_20px_rgba(249,185,0,0.3)]"
            >
              <Icon size={18} className="transition-transform group-hover:scale-110" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

