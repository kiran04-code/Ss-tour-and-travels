import { Facebook, Instagram, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../../api/businessApi";
const icons = { Instagram, Facebook, YouTube: Youtube };
export function SocialLinks() { const { data = [] } = useQuery({ queryKey: ["social-links"], queryFn: businessApi.getSocialLinks }); if (!data.length) return null; return <div><p className="text-xs font-bold tracking-[.16em] text-[#F9B900]">SOCIAL MEDIA</p><div className="mt-3 flex gap-3">{data.map((link) => { const Icon = icons[link.platform as keyof typeof icons]; return Icon ? <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit us on ${link.platform}`} className="grid h-9 w-9 place-items-center border border-white/30 text-white hover:border-[#F9B900] hover:text-[#F9B900]"><Icon size={17} /></a> : null; })}</div></div>; }
