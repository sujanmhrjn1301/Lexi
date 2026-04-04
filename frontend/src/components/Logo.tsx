export default function Logo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 logo-hover"
    >
      {/* Top face */}
      <line x1="6" y1="10" x2="16" y2="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="4" x2="26" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="26" y1="10" x2="16" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="16" x2="6" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Left face */}
      <line x1="6" y1="10" x2="6" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="6" y1="24" x2="16" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="30" x2="16" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Right face */}
      <line x1="26" y1="10" x2="26" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="26" y1="24" x2="16" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
