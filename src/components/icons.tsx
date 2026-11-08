interface IconProps {
  className?: string;
}

/** Gold FF-style coin */
export function CoinIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="coin-g" cx="38%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#ffe98a" />
          <stop offset="55%" stopColor="#ffc61a" />
          <stop offset="100%" stopColor="#e08a00" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#coin-g)" stroke="#8a5a00" strokeWidth="1.4" />
      <polygon
        points="12,4.6 17.8,8.2 17.8,15.8 12,19.4 6.2,15.8 6.2,8.2"
        fill="#ffdf4d"
        stroke="#c47b00"
        strokeWidth="1.1"
      />
      <polygon points="12,8 14.4,13.6 9.6,13.6" fill="#e89b00" />
    </svg>
  );
}

/** Cyan diamond currency */
export function DiamondIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gem-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5f3ff" />
          <stop offset="45%" stopColor="#3fd9ff" />
          <stop offset="100%" stopColor="#0e9bdc" />
        </linearGradient>
      </defs>
      <polygon points="6.5,3.5 17.5,3.5 21.5,9 12,20.5 2.5,9" fill="url(#gem-g)" stroke="#0b6f9e" strokeWidth="1" />
      <polyline points="2.5,9 21.5,9" fill="none" stroke="#dff8ff" strokeWidth="0.9" opacity="0.85" />
      <polyline points="6.5,3.5 9.5,9 12,20.5" fill="none" stroke="#dff8ff" strokeWidth="0.7" opacity="0.6" />
      <polyline points="17.5,3.5 14.5,9 12,20.5" fill="none" stroke="#dff8ff" strokeWidth="0.7" opacity="0.6" />
    </svg>
  );
}

/** Rifle silhouette */
export function GunIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 28 24" className={className} fill="currentColor" aria-hidden="true">
      <polygon points="1,9.2 5,8.2 6,6.4 9.2,6.4 10,8.2 15.8,8.2 16.9,6.7 19.2,6.7 19.9,8.3 26.2,8.9 26.2,10.3 20.2,10.7 16.6,10.7 14.2,10.7 13.4,15.2 10.9,15.2 11.6,10.7 8.8,10.7 8,14.4 5.7,14.4 6.3,10.7 5,10.7 1.5,11.2" />
    </svg>
  );
}

/** Isometric loot cube */
export function CubeIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <polygon points="12,2.6 21,7.2 12,11.8 3,7.2" fill="#ffd94d" stroke="#7a5200" strokeWidth="0.8" />
      <polygon points="3,7.2 12,11.8 12,21.4 3,16.8" fill="#d99a12" stroke="#7a5200" strokeWidth="0.8" />
      <polygon points="21,7.2 12,11.8 12,21.4 21,16.8" fill="#a86f06" stroke="#7a5200" strokeWidth="0.8" />
      <polyline points="3,7.2 21,7.2" stroke="#7a5200" strokeWidth="0.6" opacity="0.6" />
    </svg>
  );
}

/** Gold winged rank emblem */
export function RankEmblem({ className = "h-10 w-12" }: IconProps) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rank-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe98a" />
          <stop offset="55%" stopColor="#ffc61a" />
          <stop offset="100%" stopColor="#d98a00" />
        </linearGradient>
      </defs>
      <g fill="url(#rank-g)" stroke="#7a5200" strokeWidth="0.7">
        <polygon points="2,7 17,13 2,16" />
        <polygon points="46,7 31,13 46,16" />
        <polygon points="24,2 31,10 24,14 17,10" />
        <polygon points="24,11 32.5,18.5 24,23 15.5,18.5" />
        <polygon points="24,20 29.5,24.5 24,28 18.5,24.5" />
      </g>
    </svg>
  );
}

/** Tiny pixel face used for the CHARACTER entries */
export function PixelFace({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <rect x="2" y="1" width="12" height="4" fill="#5b3a1e" />
      <rect x="2" y="5" width="2" height="4" fill="#5b3a1e" />
      <rect x="12" y="5" width="2" height="4" fill="#5b3a1e" />
      <rect x="4" y="5" width="8" height="8" fill="#f0be8a" />
      <rect x="2" y="9" width="2" height="4" fill="#f0be8a" />
      <rect x="12" y="9" width="2" height="4" fill="#f0be8a" />
      <rect x="5" y="8" width="2" height="2" fill="#26221f" />
      <rect x="9" y="8" width="2" height="2" fill="#26221f" />
      <rect x="6" y="11" width="4" height="1" fill="#b06a3b" />
    </svg>
  );
}
