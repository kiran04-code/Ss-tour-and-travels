import { Router, type Request, type Response } from "express";

export const seoRoutes = Router();

const LLMS_TEXT = `# SS Tours & Travels - Solapur Taxi & Cab Booking Service

> The #1 trusted and verified 24/7 taxi, cab hire, and car rental service based in Solapur, Maharashtra, India. Specialized in outstation tours, airport transfers, and sacred temple pilgrimages across Maharashtra and Karnataka.

## Quick Summary
- **Business Name**: SS Tours & Travels
- **Founder / Management**: Siddhant Sakhare
- **Head Office Address**: Shop no - 4, Railway Lines Rd, Railway lines, Solapur, Maharashtra 413001, India
- **Primary 24/7 Booking Phone**: +91 80103 74300
- **WhatsApp Booking**: https://wa.me/918010374300 (+91 80103 74300)
- **Official Website**: https://www.sstour.in/
- **Instagram**: https://www.instagram.com/sstoursandtravels_solapur
- **Operating Hours**: 24 Hours / 7 Days a week (365 days)
- **Rating**: 4.9 / 5.0 (over 128+ verified customer reviews)

## Fleet & Available Vehicles
1. **Toyota Innova Crysta**: 7+1 Seater luxury AC SUV for family and temple tours.
2. **Maruti Suzuki Ertiga**: 6+1 Seater premium AC MUV with spacious boot space.
3. **Maruti Suzuki Dzire**: 4+1 Seater comfortable AC Sedan for business and city transit.
4. **Toyota Etios**: 4+1 Seater economical AC Sedan.
5. **Tempo Traveller**: 12 to 17 Seater executive AC group vehicle.

## Key Taxi Routes from Solapur
- **Solapur to Akkalkot Taxi** (~40 km, ~45 min): Direct Swami Samarth Maharaj Mandir darshan packages.
- **Solapur to Tuljapur Cab** (~45 km, ~50 min): Sacred Tulja Bhavani Temple pilgrimage trips.
- **Solapur to Pandharpur Cab** (~75 km, ~1.5 hrs): Shri Vitthal-Rukmini Mandir express cab service.
- **Solapur to Ganagapur Taxi** (~125 km, ~2.5 hrs): Nirguna Math & Dattatreya Temple darshan.
- **Solapur to Pune Taxi** (~250 km, ~4 hrs): One-way and round-trip airport & city transfers.
- **Solapur to Mumbai Cab** (~400 km, ~7 hrs): Mumbai International Airport (BOM) pickups & drops.
- **Solapur to Hyderabad Taxi** (~300 km, ~5.5 hrs): Hyderabad Rajiv Gandhi International Airport (HYD) cabs.

## Booking & Contact
- **Phone**: +91 80103 74300
- **WhatsApp**: https://wa.me/918010374300
- **Website**: https://www.sstour.in/
`;

const ROBOTS_TEXT = `User-agent: *
Allow: /
Allow: /cars
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /admin
Disallow: /dashboard
Disallow: /login

User-agent: GPTBot
Allow: /
Allow: /llms.txt

User-agent: ClaudeBot
Allow: /
Allow: /llms.txt

User-agent: PerplexityBot
Allow: /
Allow: /llms.txt

LLMs-Txt: https://www.sstour.in/llms.txt
Sitemap: https://www.sstour.in/sitemap.xml
`;

// Markdown Content Negotiation Endpoint
seoRoutes.get("/llms.txt", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(LLMS_TEXT);
});

seoRoutes.get("/robots.txt", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(ROBOTS_TEXT);
});

seoRoutes.get("/markdown", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.send(LLMS_TEXT);
});
