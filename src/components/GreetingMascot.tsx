export const GreetingMascot = () => (
  <aside className="greeting-mascot" aria-label="Welcome to OPSIYS">
    <div className="greeting-mascot__bubble">
      Hi! Welcome to <span>OPSIYS</span> <span aria-hidden="true">👋</span>
    </div>

    <div className="greeting-mascot__character">
      <svg viewBox="0 0 150 170" role="img" aria-label="Waving OPSIYS robot mascot">
        <line x1="75" y1="20" x2="75" y2="5" stroke="#8c00ff" strokeWidth="3" strokeLinecap="round" />
        <circle className="greeting-mascot__antenna" cx="75" cy="5" r="5" fill="#ff005a" />

        <rect x="35" y="20" width="80" height="62" rx="24" fill="#1c1a24" stroke="#ff005a" strokeWidth="2" />
        <circle className="greeting-mascot__eye" cx="60" cy="50" r="8" fill="#00e0c6" />
        <circle className="greeting-mascot__eye greeting-mascot__eye--right" cx="90" cy="50" r="8" fill="#00e0c6" />
        <path d="M60 64 Q75 74 90 64" stroke="#c68cff" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="48" cy="60" r="5" fill="#ff005a" opacity="0.25" />
        <circle cx="102" cy="60" r="5" fill="#ff005a" opacity="0.25" />

        <rect x="45" y="82" width="60" height="52" rx="20" fill="#232030" stroke="#8c00ff" strokeWidth="2" />
        <circle cx="75" cy="105" r="9" fill="none" stroke="#ff7a45" strokeWidth="2.5" />
        <circle cx="75" cy="105" r="3" fill="#ff7a45" />
        <rect x="35" y="92" width="12" height="30" rx="6" fill="#232030" stroke="#8c00ff" strokeWidth="2" />
        <g className="greeting-mascot__arm">
          <rect x="103" y="86" width="12" height="30" rx="6" fill="#232030" stroke="#8c00ff" strokeWidth="2" />
        </g>
        <rect x="55" y="134" width="14" height="20" rx="6" fill="#1c1a24" stroke="#ff005a" strokeWidth="2" />
        <rect x="81" y="134" width="14" height="20" rx="6" fill="#1c1a24" stroke="#ff005a" strokeWidth="2" />
      </svg>
    </div>

    <svg className="greeting-mascot__shadow" viewBox="0 0 150 20" aria-hidden="true">
      <ellipse cx="75" cy="10" rx="40" ry="8" fill="#000" />
    </svg>
  </aside>
);
