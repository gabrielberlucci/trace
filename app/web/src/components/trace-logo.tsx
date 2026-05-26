export const TraceLogo = ({
  className = 'h-8 w-8',
}: {
  className?: string;
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="violet-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#a78bfa" /> {/* violet-400 */}
          <stop offset="50%" stopColor="#7c3aed" /> {/* violet-600 */}
          <stop offset="100%" stopColor="#4c1d95" /> {/* violet-900 */}
        </linearGradient>
      </defs>

      {/* Conexões traseiras abstratas */}
      <path
        d="M 20 70 L 35 50 M 80 70 L 65 50 M 35 50 L 65 50"
        stroke="url(#violet-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* Estrutura Principal do T abstrato */}
      <path
        d="M 15 30 L 85 30 L 65 50 L 50 50 L 50 85"
        stroke="url(#violet-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nós de dados (bolinhas) */}
      <circle cx="15" cy="30" r="7" fill="#a78bfa" />
      <circle cx="85" cy="30" r="7" fill="#a78bfa" />
      <circle cx="50" cy="50" r="6" fill="#7c3aed" />
      <circle cx="50" cy="85" r="8" fill="#4c1d95" />
    </svg>
  );
};
