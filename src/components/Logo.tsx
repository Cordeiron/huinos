/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: showText ? "h-10 w-10" : "h-6 w-6",
    md: showText ? "h-14 w-14" : "h-9 w-9",
    lg: showText ? "h-32 w-32" : "h-16 w-16"
  };

  return (
    <div id="huios-logo-container" className={`flex items-center justify-center select-none ${className}`}>
      <svg
        id="huios-official-logo"
        className={`${sizes[size]} transition-all duration-300 hover:scale-105`}
        viewBox={showText ? "0 0 200 200" : "0 10 200 155"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Individual high-contrast leaf with central vein matching the uploaded image */}
          <g id="huios-leaf">
            <path d="M 0 0 C -3.5 -3.5, -3.5 -10, 0 -13 C 3.5 -10, 3.5 -3.5, 0 0 Z" fill="currentColor" />
            <path d="M 0 0 L 0 -11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" className="text-white dark:text-[#252525]" />
          </g>

          {/* Symmetrical leaf pair */}
          <g id="huios-leaf-pair">
            <use href="#huios-leaf" transform="rotate(-35)" />
            <use href="#huios-leaf" transform="rotate(35)" />
          </g>

          {/* Symmetrical leaf trio cluster */}
          <g id="huios-leaf-tri">
            <use href="#huios-leaf" />
            <use href="#huios-leaf" transform="rotate(-35)" />
            <use href="#huios-leaf" transform="rotate(35)" />
          </g>

          {/* Segmented ribbed fruit (pomegranate/persimmon) matching the image exactly */}
          <g id="huios-fruit">
            {/* Main segmented red circle */}
            <path
              d="M 0 -3 C -5.5 -3, -7 0.5, -5 4.5 C -3 6.5, 3 6.5, 5 4.5 C 7 0.5, 5.5 -3, 0 -3 Z"
              fill="#C62828"
            />
            {/* Small dark cap at top */}
            <path
              d="M -1.5 -3 L 0 -5.5 L 1.5 -3 Z"
              fill="currentColor"
              className="text-neutral-800 dark:text-neutral-200"
            />
            {/* Symmetrical internal rib/segmentation lines for volume */}
            <path
              d="M 0 -3 C -1.5 -0.5, -1.5 2.5, 0 5"
              stroke="#8E1B1B"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M 0 -3 C 1.5 -0.5, 1.5 2.5, 0 5"
              stroke="#8E1B1B"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M -2.5 -2.5 C -4.2 -0.2, -3.8 2.2, -2.5 3.8"
              stroke="#8E1B1B"
              strokeWidth="0.7"
              fill="none"
            />
            <path
              d="M 2.5 -2.5 C 4.2 -0.2, 3.8 2.2, 2.5 3.8"
              stroke="#8E1B1B"
              strokeWidth="0.7"
              fill="none"
            />
          </g>
        </defs>

        {/* Tree Canopy Skeleton (Solid Trunk & Branches) */}
        <g className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main solid center trunk */}
          <path d="M 100 110 L 100 85" strokeWidth="8" />
          <path d="M 100 85 L 100 55" strokeWidth="6" />
          <path d="M 100 55 L 100 35" strokeWidth="4.5" />
          
          {/* Lower large sweeping lateral branches */}
          <path d="M 100 90 C 85 90, 60 98, 40 95 C 30 92, 24 82, 22 75" strokeWidth="6.5" />
          <path d="M 100 90 C 115 90, 140 98, 160 95 C 170 92, 176 82, 178 75" strokeWidth="6.5" />
          
          {/* Middle lateral branches */}
          <path d="M 100 75 C 85 70, 65 72, 48 80" strokeWidth="4.5" />
          <path d="M 100 75 C 115 70, 135 72, 152 80" strokeWidth="4.5" />
          <path d="M 100 65 C 85 58, 68 56, 52 65" strokeWidth="4" />
          <path d="M 100 65 C 115 58, 132 56, 148 65" strokeWidth="4" />
          
          {/* Upper branches */}
          <path d="M 100 55 C 90 44, 75 42, 62 52" strokeWidth="3.5" />
          <path d="M 100 55 C 110 44, 125 42, 138 52" strokeWidth="3.5" />
        </g>

        {/* Dense Canopy Foliage */}
        <g className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
          {/* Central top vertical group */}
          <use href="#huios-leaf-tri" x="100" y="30" />
          <use href="#huios-leaf-pair" x="100" y="44" />
          <use href="#huios-leaf-pair" x="100" y="58" />
          
          {/* Upper left branch foliage */}
          <use href="#huios-leaf-tri" x="78" y="32" transform="rotate(-15, 78, 32)" />
          <use href="#huios-leaf-pair" x="88" y="40" transform="rotate(-15, 88, 40)" />
          <use href="#huios-leaf-pair" x="66" y="42" transform="rotate(-30, 66, 42)" />
          
          {/* Upper right branch foliage */}
          <use href="#huios-leaf-tri" x="122" y="32" transform="rotate(15, 122, 32)" />
          <use href="#huios-leaf-pair" x="112" y="40" transform="rotate(15, 112, 40)" />
          <use href="#huios-leaf-pair" x="134" y="42" transform="rotate(30, 134, 42)" />
          
          {/* Mid-upper left foliage */}
          <use href="#huios-leaf-tri" x="52" y="50" transform="rotate(-40, 52, 50)" />
          <use href="#huios-leaf-pair" x="62" y="58" transform="rotate(-35, 62, 58)" />
          <use href="#huios-leaf-pair" x="74" y="52" transform="rotate(-25, 74, 52)" />
          
          {/* Mid-upper right foliage */}
          <use href="#huios-leaf-tri" x="148" y="50" transform="rotate(40, 148, 50)" />
          <use href="#huios-leaf-pair" x="138" y="58" transform="rotate(35, 138, 58)" />
          <use href="#huios-leaf-pair" x="126" y="52" transform="rotate(25, 126, 52)" />

          {/* Lower-middle left foliage */}
          <use href="#huios-leaf-tri" x="34" y="66" transform="rotate(-60, 34, 66)" />
          <use href="#huios-leaf-pair" x="46" y="72" transform="rotate(-55, 46, 72)" />
          <use href="#huios-leaf-pair" x="58" y="68" transform="rotate(-45, 58, 68)" />
          <use href="#huios-leaf-pair" x="72" y="72" transform="rotate(-30, 72, 72)" />
          
          {/* Lower-middle right foliage */}
          <use href="#huios-leaf-tri" x="166" y="66" transform="rotate(60, 166, 66)" />
          <use href="#huios-leaf-pair" x="154" y="72" transform="rotate(55, 154, 72)" />
          <use href="#huios-leaf-pair" x="142" y="68" transform="rotate(45, 142, 68)" />
          <use href="#huios-leaf-pair" x="128" y="72" transform="rotate(30, 128, 72)" />

          {/* Lowest outer left branch foliage */}
          <use href="#huios-leaf-tri" x="22" y="82" transform="rotate(-75, 22, 82)" />
          <use href="#huios-leaf-pair" x="32" y="90" transform="rotate(-70, 32, 90)" />
          <use href="#huios-leaf-pair" x="44" y="86" transform="rotate(-60, 44, 86)" />
          <use href="#huios-leaf-pair" x="58" y="88" transform="rotate(-50, 58, 88)" />
          <use href="#huios-leaf-pair" x="74" y="84" transform="rotate(-35, 74, 84)" />
          
          {/* Lowest outer right branch foliage */}
          <use href="#huios-leaf-tri" x="178" y="82" transform="rotate(75, 178, 82)" />
          <use href="#huios-leaf-pair" x="168" y="90" transform="rotate(70, 168, 90)" />
          <use href="#huios-leaf-pair" x="156" y="86" transform="rotate(60, 156, 86)" />
          <use href="#huios-leaf-pair" x="142" y="88" transform="rotate(50, 142, 88)" />
          <use href="#huios-leaf-pair" x="126" y="84" transform="rotate(35, 126, 84)" />

          {/* Inner filler foliage near trunk */}
          <use href="#huios-leaf-pair" x="88" y="64" transform="rotate(-15, 88, 64)" />
          <use href="#huios-leaf-pair" x="112" y="64" transform="rotate(15, 112, 64)" />
          <use href="#huios-leaf-pair" x="86" y="76" transform="rotate(-10, 86, 76)" />
          <use href="#huios-leaf-pair" x="114" y="76" transform="rotate(10, 114, 76)" />
          <use href="#huios-leaf-pair" x="88" y="94" transform="rotate(-5, 88, 94)" />
          <use href="#huios-leaf-pair" x="112" y="94" transform="rotate(5, 112, 94)" />
        </g>

        {/* Beautiful ribbed red fruits interspersed symmetrically in the canopy */}
        {/* Top-most center fruit */}
        <use href="#huios-fruit" x="100" y="44" />
        
        {/* Upper-middle fruits */}
        <use href="#huios-fruit" x="83" y="52" />
        <use href="#huios-fruit" x="117" y="52" />
        
        {/* Middle level fruits */}
        <use href="#huios-fruit" x="68" y="63" />
        <use href="#huios-fruit" x="132" y="63" />
        
        {/* Outer middle level fruits */}
        <use href="#huios-fruit" x="51" y="74" />
        <use href="#huios-fruit" x="149" y="74" />
        
        {/* Lowest hanging fruits row along bottom edge */}
        <use href="#huios-fruit" x="34" y="92" />
        <use href="#huios-fruit" x="52" y="93" />
        <use href="#huios-fruit" x="73" y="94" />
        
        <use href="#huios-fruit" x="166" y="92" />
        <use href="#huios-fruit" x="148" y="93" />
        <use href="#huios-fruit" x="127" y="94" />

        {/* Inner branch fillers */}
        <use href="#huios-fruit" x="90" y="78" />
        <use href="#huios-fruit" x="110" y="78" />

        {/* Logo Text "HUIOS" and framing divider lines */}
        {showText && (
          <g className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
            {/* Top horizontal divider bar */}
            <line
              x1="15"
              y1="110"
              x2="185"
              y2="110"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Geometric custom text "HUIOS" paths exactly matching the logo's typography */}
            <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* H */}
              <path d="M 35 118 L 35 142 M 35 130 L 55 130 M 55 118 L 55 142" />
              {/* U */}
              <path d="M 67 118 L 67 134 C 67 143, 87 143, 87 134 L 87 118" />
              {/* I */}
              <path d="M 100 118 L 100 142" />
              {/* O */}
              <path d="M 113 124 C 113 117, 133 117, 133 124 L 133 136 C 133 143, 113 143, 113 136 Z" />
              {/* S */}
              <path d="M 164 122.5 C 164 117, 146 117, 146 122 C 146 127.5, 164 127, 164 132.5 C 164 137.5, 146 137.5, 146 134" />
            </g>

            {/* Bottom horizontal divider bar */}
            <line
              x1="15"
              y1="145"
              x2="185"
              y2="145"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Symmetrical organic deep root system matching the calligraphic design of the image */}
        <g
          className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300"
          transform={showText ? "translate(0, 0)" : "translate(0, -35)"}
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Central thick joint */}
          <path d="M 100 145 C 100 148, 98 152, 98 155" strokeWidth="4" />
          
          {/* Left main root branch */}
          <path d="M 98 147 C 88 151, 74 152, 60 160 C 48 166, 38 162, 28 167" strokeWidth="3" />
          {/* Left sub-capillaries */}
          <path d="M 80 151 C 72 157, 68 165, 58 172" strokeWidth="2" />
          <path d="M 60 160 C 52 168, 48 178, 38 184" strokeWidth="1.8" />
          <path d="M 44 163 C 38 170, 32 178, 24 182" strokeWidth="1.5" />
          <path d="M 30 167 C 22 173, 18 182, 12 185" strokeWidth="1.2" />

          {/* Right main root branch */}
          <path d="M 102 147 C 112 151, 126 152, 140 160 C 152 166, 162 162, 172 167" strokeWidth="3" />
          {/* Right sub-capillaries */}
          <path d="M 120 151 C 128 157, 132 165, 142 172" strokeWidth="2" />
          <path d="M 140 160 C 148 168, 152 178, 162 184" strokeWidth="1.8" />
          <path d="M 156 163 C 162 170, 168 178, 176 182" strokeWidth="1.5" />
          <path d="M 170 167 C 178 173, 182 182, 188 185" strokeWidth="1.2" />

          {/* Core vertical deep root */}
          <path d="M 100 148 C 100 158, 97 166, 98 176 C 99 184, 103 189, 101 197" strokeWidth="3" />
          {/* Core sub-capillaries */}
          <path d="M 99 156 C 92 164, 88 173, 80 182 C 75 187, 70 192, 64 195" strokeWidth="2" />
          <path d="M 101 156 C 108 164, 112 173, 120 182 C 125 187, 130 192, 136 195" strokeWidth="2" />
          <path d="M 98 168 C 94 175, 91 182, 85 188" strokeWidth="1.5" />
          <path d="M 102 168 C 106 175, 109 182, 115 188" strokeWidth="1.5" />
          <path d="M 99 180 C 97 186, 95 192, 92 197" strokeWidth="1.2" />
          <path d="M 101 180 C 103 186, 105 192, 108 197" strokeWidth="1.2" />

          {/* Mid-left deep root */}
          <path d="M 92 148 C 82 156, 70 166, 58 176 C 50 181, 42 183, 34 187" strokeWidth="2.2" />
          <path d="M 72 160 C 65 168, 58 176, 48 182" strokeWidth="1.5" />
          <path d="M 50 171 C 44 178, 38 185, 30 190" strokeWidth="1.2" />

          {/* Mid-right deep root */}
          <path d="M 108 148 C 118 156, 130 166, 142 176 C 150 181, 158 183, 166 187" strokeWidth="2.2" />
          <path d="M 128 160 C 135 168, 142 176, 152 182" strokeWidth="1.5" />
          <path d="M 150 171 C 156 178, 162 185, 170 190" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}
