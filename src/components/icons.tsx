import * as React from "react";

export const Logo: React.FC = () => {
  return (
    <svg width="300" height="100" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="prismaticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="16%" stopColor="#ec4899" />
          <stop offset="33%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="66%" stopColor="#3b82f6" />
          <stop offset="83%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <polygon points="30,75 150,15 270,75" fill="none" stroke="url(#prismaticGradient)" strokeWidth="2" opacity="0.5" />
      <text x="150" y="65" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="48" textAnchor="middle" fill="#0006" filter="blur(2px)" transform="translate(3, 3)">PRISM</text>
      <text x="150" y="65" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="48" textAnchor="middle" fill="url(#prismaticGradient)" filter="url(#glow)">PRISM</text>
      <line x1="100" y1="20" x2="80" y2="80" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="150" y1="20" x2="150" y2="80" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="200" y1="20" x2="220" y2="80" stroke="white" strokeWidth="1" opacity="0.7" />
    </svg>
  );
};

