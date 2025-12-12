import React from 'react'

const Logo = () => {
  return (
<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#6366f1" />
      <stop offset="100%" stopColor="#8b5cf6" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.2" />
    </filter>
  </defs>
  
  <circle cx="25" cy="25" r="22" fill="url(#gradient)" filter="url(#shadow)" />
  
  <path d="M20 18 L30 18 L35 25 L30 32 L20 32 L15 25 Z" fill="white" opacity="0.9" />
  <circle cx="25" cy="25" r="4" fill="#6366f1" />
  
  <path d="M18 18 L22 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  <path d="M28 18 L32 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  <path d="M18 32 L22 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  <path d="M28 32 L32 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  
  <circle cx="25" cy="25" r="23" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
</svg>  )
}

export default Logo