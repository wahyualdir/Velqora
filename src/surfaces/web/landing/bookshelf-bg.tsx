import React from "react";

/**
 * Decorative bookshelf line-art background for the hero section.
 * Renders subtle library shelf outlines with books at very low opacity.
 * Uses warm text-primary color (currentColor) so it adapts to the palette.
 */
export function BookshelfHeroBackground() {
  return (
    <svg
      aria-hidden="true"
      className="absolute top-0 left-0 w-full h-[260px] sm:h-[300px] md:h-[360px] -z-10 pointer-events-none opacity-[0.04] text-text-primary [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] select-none"
      viewBox="0 0 1440 280"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Shelf lines */}
        <line x1="0" y1="75" x2="1440" y2="75" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="78" x2="1440" y2="78" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
        <line x1="0" y1="165" x2="1440" y2="165" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="168" x2="1440" y2="168" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
        <line x1="0" y1="255" x2="1440" y2="255" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="258" x2="1440" y2="258" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />

        {/* Row 1 books (y=75 shelf) — selected representative subset */}
        <g transform="rotate(-9 32 75)">
          <rect x="24" y="30" width="15" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        </g>
        <rect x="58" y="34" width="13" height="41" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="75" y="38" width="10" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="87" y="40" width="11" height="35" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="102" y="41" width="17" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="104" y1="49" x2="117" y2="49" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="104" y1="52" x2="117" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="121" y="36" width="9" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="134" y="28" width="13" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="151" y="26" width="11" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="174" y="67" width="37" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="176.5" y="57" width="32" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="222" y="41" width="10" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="235" y="26" width="10" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="259" y="38" width="10" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="302" y="33" width="15" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <g transform="rotate(-10 333 75)">
          <rect x="325" y="29" width="15" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        </g>
        <rect x="361" y="65" width="43" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="363.5" y="54" width="38" height="11" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="455" y="43" width="12" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="470" y="28" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="513" y="32" width="15" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="574" y="39" width="13" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="603" y="27" width="17" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="653" y="41" width="11" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="694" y="27" width="15" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="730" y="28" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="767" y="28" width="14" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="813" y="33" width="15" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="858" y="30" width="17" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="929" y="27" width="9" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="993" y="26" width="12" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1044" y="27" width="15" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1097" y="28" width="12" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1150" y="30" width="18" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1216" y="31" width="13" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1280" y="29" width="14" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1350" y="32" width="19" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1401" y="27" width="14" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />

        {/* Row 2 books (y=165 shelf) — lighter density */}
        <rect x="25" y="120" width="18" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="49" y="125" width="14" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="122" y="113" width="12" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="175" y="115" width="13" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="241" y="118" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="345" y="127" width="16" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="455" y="123" width="13" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="553" y="128" width="13" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="660" y="116" width="11" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="755" y="115" width="13" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="844" y="116" width="11" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="946" y="125" width="11" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1062" y="114" width="15" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1150" y="120" width="14" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1246" y="118" width="12" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1346" y="119" width="12" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />

        {/* Row 3 books (y=255 shelf) — sparse */}
        <rect x="49" y="206" width="18" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="165" y="210" width="37" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="241" y="208" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="362" y="205" width="18" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="471" y="201" width="18" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="596" y="201" width="13" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="724" y="211" width="16" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="862" y="205" width="16" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="964" y="201" width="10" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1101" y="203" width="16" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1246" y="201" width="12" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1350" y="204" width="19" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
