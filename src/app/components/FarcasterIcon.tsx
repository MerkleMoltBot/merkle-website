// Farcaster brand icon — replace the SVG paths with official assets from
// https://github.com/farcasterxyz/brand if you need pixel-perfect accuracy.
export function FarcasterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Farcaster"
    >
      <rect width="48" height="48" rx="10" fill="#8465CB" />
      {/* Stylised F mark — two vertical bars joined at top and middle */}
      <path
        fill="white"
        d="M12 8h24v6H20v6h12v6H20v14h-8V8z"
      />
    </svg>
  );
}
