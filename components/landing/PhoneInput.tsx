"use client";

import { useState } from "react";

const COUNTRIES = [
  { flag: "🇮🇱", code: "+972", name: "Israel" },
  { flag: "🇺🇸", code: "+1", name: "United States" },
  { flag: "🇬🇧", code: "+44", name: "United Kingdom" },
  { flag: "🇩🇪", code: "+49", name: "Germany" },
  { flag: "🇫🇷", code: "+33", name: "France" },
  { flag: "🇦🇺", code: "+61", name: "Australia" },
  { flag: "🇨🇦", code: "+1", name: "Canada" },
  { flag: "🇧🇷", code: "+55", name: "Brazil" },
  { flag: "🇮🇳", code: "+91", name: "India" },
  { flag: "🇨🇳", code: "+86", name: "China" },
  { flag: "🇯🇵", code: "+81", name: "Japan" },
  { flag: "🇰🇷", code: "+82", name: "South Korea" },
  { flag: "🇲🇽", code: "+52", name: "Mexico" },
  { flag: "🇷🇺", code: "+7", name: "Russia" },
  { flag: "🇿🇦", code: "+27", name: "South Africa" },
  { flag: "🇦🇪", code: "+971", name: "UAE" },
  { flag: "🇸🇦", code: "+966", name: "Saudi Arabia" },
  { flag: "🇸🇬", code: "+65", name: "Singapore" },
  { flag: "🇳🇱", code: "+31", name: "Netherlands" },
  { flag: "🇸🇪", code: "+46", name: "Sweden" },
  { flag: "🇨🇭", code: "+41", name: "Switzerland" },
  { flag: "🇳🇴", code: "+47", name: "Norway" },
  { flag: "🇩🇰", code: "+45", name: "Denmark" },
  { flag: "🇦🇹", code: "+43", name: "Austria" },
  { flag: "🇧🇪", code: "+32", name: "Belgium" },
  { flag: "🇪🇸", code: "+34", name: "Spain" },
  { flag: "🇮🇹", code: "+39", name: "Italy" },
  { flag: "🇵🇱", code: "+48", name: "Poland" },
  { flag: "🇵🇹", code: "+351", name: "Portugal" },
  { flag: "🇹🇷", code: "+90", name: "Turkey" },
  { flag: "🇬🇷", code: "+30", name: "Greece" },
  { flag: "🇺🇦", code: "+380", name: "Ukraine" },
  { flag: "🇮🇩", code: "+62", name: "Indonesia" },
  { flag: "🇻🇳", code: "+84", name: "Vietnam" },
  { flag: "🇹🇭", code: "+66", name: "Thailand" },
  { flag: "🇲🇾", code: "+60", name: "Malaysia" },
  { flag: "🇵🇭", code: "+63", name: "Philippines" },
  { flag: "🇳🇿", code: "+64", name: "New Zealand" },
  { flag: "🇦🇷", code: "+54", name: "Argentina" },
  { flag: "🇨🇴", code: "+57", name: "Colombia" },
  { flag: "🇨🇱", code: "+56", name: "Chile" },
  { flag: "🇳🇬", code: "+234", name: "Nigeria" },
  { flag: "🇪🇬", code: "+20", name: "Egypt" },
  { flag: "🇰🇪", code: "+254", name: "Kenya" },
  { flag: "🇲🇦", code: "+212", name: "Morocco" },
];

export function PhoneInput() {
  const [prefix, setPrefix] = useState(COUNTRIES[0].code);
  const [number, setNumber] = useState("");

  const combined = number.trim() ? `${prefix} ${number.trim()}` : "";

  return (
    <div className="phone-input-wrap">
      {/* hidden field consumed by the server action */}
      <input type="hidden" name="phone" value={combined} />
      <select
        className="phone-prefix-select"
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
        aria-label="Country code"
      >
        {COUNTRIES.map((c) => (
          <option key={`${c.flag}${c.code}`} value={c.code}>
            {c.flag} {c.code} {c.name}
          </option>
        ))}
      </select>
      <input
        type="tel"
        className="phone-number-input"
        placeholder="5X-XXX-XXXX"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        autoComplete="tel-national"
        dir="ltr"
        aria-label="Phone number"
      />
    </div>
  );
}
