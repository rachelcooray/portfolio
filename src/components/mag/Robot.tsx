// The friendly robot from the CV, waving, with a speech bubble.
export default function Robot({ say }: { say: string }) {
  return (
    <div className="robot">
      <p className="robot-say">{say}</p>
      <svg className="robot-svg" viewBox="0 0 200 230" aria-hidden="true">
        <line x1="100" y1="10" x2="100" y2="30" stroke="#46521a" strokeWidth="4" strokeLinecap="round" />
        <circle className="robot-bulb" cx="100" cy="9" r="7" fill="#c7d42b" stroke="#46521a" strokeWidth="2.5" />
        <rect x="52" y="28" width="96" height="70" rx="22" fill="#46521a" />
        <rect x="64" y="42" width="72" height="40" rx="14" fill="#faf7ef" />
        <g className="robot-eyes">
          <circle cx="86" cy="60" r="6.5" fill="#2b2318" />
          <circle cx="114" cy="60" r="6.5" fill="#2b2318" />
        </g>
        <path d="M90 72 q10 7 20 0" fill="none" stroke="#2b2318" strokeWidth="3" strokeLinecap="round" />
        <rect x="62" y="104" width="76" height="86" rx="18" fill="#6b5436" stroke="#46521a" strokeWidth="2" />
        <circle cx="100" cy="140" r="12" fill="#c7d42b" stroke="#46521a" strokeWidth="2" />
        <path d="M62 128 q-22 8 -20 34" fill="none" stroke="#46521a" strokeWidth="8" strokeLinecap="round" />
        <circle cx="42" cy="164" r="10" fill="#c7d42b" stroke="#46521a" strokeWidth="2.5" />
        <g className="robot-wave">
          <path d="M138 128 q22 -10 24 -36" fill="none" stroke="#46521a" strokeWidth="8" strokeLinecap="round" />
          <circle cx="162" cy="90" r="10" fill="#c7d42b" stroke="#46521a" strokeWidth="2.5" />
        </g>
        <rect x="76" y="188" width="16" height="26" rx="7" fill="#46521a" />
        <rect x="108" y="188" width="16" height="26" rx="7" fill="#46521a" />
        <rect x="68" y="210" width="30" height="12" rx="6" fill="#2b2318" />
        <rect x="102" y="210" width="30" height="12" rx="6" fill="#2b2318" />
      </svg>
    </div>
  );
}
