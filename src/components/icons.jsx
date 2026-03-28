// icons.jsx
<<<<<<< HEAD
=======
// Ícones locais em SVG — substitui lucide-react.
>>>>>>> 52cabf2 (feat(icons): replace lucide-react with local SVG components)
// Paths extraídos do Lucide Icons v0.x (ISC License).
// viewBox padrão: "0 0 24 24", stroke-width: 2, stroke-linecap/linejoin: round.
// Uso: <AlertCircle size={20} className="text-blue-600" />

import React from "react";

const Icon = ({ size = 24, className = "", strokeWidth = 2, children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const AlertCircle = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);

export const Book = (props) => (
  <Icon {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Icon>
);

export const Check = (props) => (
  <Icon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

export const CheckCircle2 = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);

export const ChevronDown = (props) => (
  <Icon {...props}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

export const ChevronUp = (props) => (
  <Icon {...props}>
    <polyline points="18 15 12 9 6 15" />
  </Icon>
);

export const Download = (props) => (
  <Icon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);

export const Edit3 = (props) => (
  <Icon {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </Icon>
);

export const Hammer = (props) => (
  <Icon {...props}>
    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5L2.5 7.5a1.7 1.7 0 0 0 0 2.4l11.6 11.6a1.7 1.7 0 0 0 2.4 0l5-5a1.7 1.7 0 0 0 0-2.4L8.9 2.5" />
    <path d="M15 2v4" />
    <path d="M19 6H15" />
  </Icon>
);

export const Lock = (props) => (
  <Icon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

export const Package = (props) => (
  <Icon {...props}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);

export const Plus = (props) => (
  <Icon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

export const Search = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

export const Sparkles = (props) => (
  <Icon {...props}>
    <path d="M12 3c-1 2.5-3 4-5 4 2 0 4 1.5 5 4 1-2.5 3-4 5-4-2 0-4-1.5-5-4z" />
    <path d="M5 11c-.67 1.67-2 2.67-3.33 2.67C3 13.67 4 14.67 5 16.33 5.67 14.67 7 13.67 8.33 13.67 7 13.67 5.67 12.67 5 11z" />
    <path d="M19 11c-.67 1.67-2 2.67-3.33 2.67C17 13.67 18 14.67 19 16.33c.67-1.67 2-2.67 3.33-2.67C21 13.67 19.67 12.67 19 11z" />
  </Icon>
);

export const Sword = (props) => (
  <Icon {...props}>
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
    <line x1="13" y1="19" x2="19" y2="13" />
    <line x1="16" y1="16" x2="20" y2="20" />
    <line x1="19" y1="21" x2="21" y2="19" />
  </Icon>
);

export const Trash2 = (props) => (
  <Icon {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </Icon>
);

export const Unlock = (props) => (
  <Icon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </Icon>
);

export const Upload = (props) => (
  <Icon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </Icon>
);

export const X = (props) => (
  <Icon {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);