import React from 'react';

export const CornerBorders = ({ className }: { className?: string }) => {
  return (
    <>
      <Icon className="absolute h-4 w-4 -top-2 -left-2 text-white pointer-events-none" />
      <Icon className="absolute h-4 w-4 -bottom-2 -left-2 text-white pointer-events-none" />
      <Icon className="absolute h-4 w-4 -top-2 -right-2 text-white pointer-events-none" />
      <Icon className="absolute h-4 w-4 -bottom-2 -right-2 text-white pointer-events-none" />
    </>
  );
};

const Icon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M2 12h20" />
    </svg>
  );
};
