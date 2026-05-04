// src/components/ui/Icons.jsx
// Bibliothèque d'icônes SVG professionnels — utilisés sur toute la plateforme

const defaultProps = { width: 20, height: 20, stroke: 'currentColor', fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' };

const Svg = ({ size = 20, color, style, children, viewBox = '0 0 24 24', className }) => (
  <svg
    width={size} height={size} viewBox={viewBox}
    fill="none" stroke={color || 'currentColor'}
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
    style={style} className={className}
  >
    {children}
  </svg>
);

// ── Navigation & Layout ───────────────────────────────────────────────────────
export const IconHome        = (p) => <Svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></Svg>;
export const IconGrid        = (p) => <Svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Svg>;
export const IconMenu        = (p) => <Svg {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Svg>;
export const IconChevronLeft = (p) => <Svg {...p}><polyline points="15,18 9,12 15,6"/></Svg>;
export const IconChevronRight= (p) => <Svg {...p}><polyline points="9,18 15,12 9,6"/></Svg>;
export const IconChevronDown = (p) => <Svg {...p}><polyline points="6,9 12,15 18,9"/></Svg>;
export const IconChevronUp   = (p) => <Svg {...p}><polyline points="18,15 12,9 6,15"/></Svg>;
export const IconArrowLeft   = (p) => <Svg {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></Svg>;
export const IconArrowRight  = (p) => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></Svg>;
export const IconX           = (p) => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
export const IconSearch      = (p) => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
export const IconFilter      = (p) => <Svg {...p}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></Svg>;
export const IconSettings    = (p) => <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></Svg>;
export const IconLogout      = (p) => <Svg {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
export const IconExternalLink= (p) => <Svg {...p}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></Svg>;

// ── Workspace & Project ───────────────────────────────────────────────────────
export const IconWorkspace   = (p) => <Svg {...p}><rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/><rect x="9" y="3" width="6" height="6" rx="1"/><rect x="2" y="15" width="6" height="6" rx="1"/><rect x="16" y="15" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/></Svg>;
export const IconTable       = (p) => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></Svg>;
export const IconKanban      = (p) => <Svg {...p}><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="4" height="15" rx="1"/></Svg>;
export const IconFolder      = (p) => <Svg {...p}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></Svg>;
export const IconStar        = (p) => <Svg {...p}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></Svg>;

// ── Task & Content ────────────────────────────────────────────────────────────
export const IconTask        = (p) => <Svg {...p}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></Svg>;
export const IconCheck       = (p) => <Svg {...p}><polyline points="20,6 9,17 4,12"/></Svg>;
export const IconCheckCircle = (p) => <Svg {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></Svg>;
export const IconCircle      = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/></Svg>;
export const IconClock       = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></Svg>;
export const IconCalendar    = (p) => <Svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>;
export const IconFlag        = (p) => <Svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></Svg>;
export const IconTag         = (p) => <Svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></Svg>;
export const IconAlertCircle = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;
export const IconTrendingUp  = (p) => <Svg {...p}><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></Svg>;

// ── Social & Communication ────────────────────────────────────────────────────
export const IconUsers       = (p) => <Svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></Svg>;
export const IconUser        = (p) => <Svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>;
export const IconUserPlus    = (p) => <Svg {...p}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></Svg>;
export const IconMessageSquare=(p)=> <Svg {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></Svg>;
export const IconBell        = (p) => <Svg {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></Svg>;
export const IconMail        = (p) => <Svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Svg>;
export const IconShare       = (p) => <Svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></Svg>;

// ── Actions ───────────────────────────────────────────────────────────────────
export const IconPlus        = (p) => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
export const IconEdit        = (p) => <Svg {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>;
export const IconTrash       = (p) => <Svg {...p}><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></Svg>;
export const IconCopy        = (p) => <Svg {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></Svg>;
export const IconDownload    = (p) => <Svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
export const IconRefresh     = (p) => <Svg {...p}><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></Svg>;
export const IconMoreHoriz   = (p) => <Svg {...p}><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/></Svg>;
export const IconMoreVert    = (p) => <Svg {...p}><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></Svg>;
export const IconLock        = (p) => <Svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></Svg>;

// ── Data & Analytics ──────────────────────────────────────────────────────────
export const IconBarChart    = (p) => <Svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></Svg>;
export const IconPieChart    = (p) => <Svg {...p}><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></Svg>;
export const IconActivity    = (p) => <Svg {...p}><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></Svg>;
export const IconZap         = (p) => <Svg {...p}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></Svg>;
export const IconLayers      = (p) => <Svg {...p}><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></Svg>;
export const IconGlobe       = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></Svg>;
export const IconShield      = (p) => <Svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Svg>;
export const IconCpu         = (p) => <Svg {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></Svg>;
export const IconCode        = (p) => <Svg {...p}><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></Svg>;
export const IconCommand     = (p) => <Svg {...p}><path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z"/></Svg>;

// ── Status ────────────────────────────────────────────────────────────────────
export const IconInfo        = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Svg>;
export const IconCheckSquare = (p) => <Svg {...p}><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></Svg>;
export const IconMoveRight   = (p) => <Svg {...p}><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></Svg>;
export const IconMoveLeft    = (p) => <Svg {...p}><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></Svg>;
export const IconSparkle     = (p) => <Svg {...p}><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M5 3L5.5 4.5L7 5L5.5 5.5L5 7L4.5 5.5L3 5L4.5 4.5L5 3Z"/><path d="M19 17L19.5 18.5L21 19L19.5 19.5L19 21L18.5 19.5L17 19L18.5 18.5L19 17Z"/></Svg>;

export default {
  IconHome, IconGrid, IconMenu, IconChevronLeft, IconChevronRight, IconChevronDown, IconChevronUp,
  IconArrowLeft, IconArrowRight, IconX, IconSearch, IconFilter, IconSettings, IconLogout, IconExternalLink,
  IconWorkspace, IconTable, IconKanban, IconFolder, IconStar,
  IconTask, IconCheck, IconCheckCircle, IconCircle, IconClock, IconCalendar, IconFlag, IconTag, IconAlertCircle, IconTrendingUp,
  IconUsers, IconUser, IconUserPlus, IconMessageSquare, IconBell, IconMail, IconShare,
  IconPlus, IconEdit, IconTrash, IconCopy, IconDownload, IconRefresh, IconMoreHoriz, IconMoreVert, IconLock,
  IconBarChart, IconPieChart, IconActivity, IconZap, IconLayers, IconGlobe, IconShield, IconCpu, IconCode, IconCommand,
  IconInfo, IconCheckSquare, IconMoveRight, IconMoveLeft, IconSparkle,
};