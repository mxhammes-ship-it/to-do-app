// hifi-icons.jsx — SF Symbol-style line icons (24×24 viewBox)
// Stroke-based, currentColor — works on any background.

const Icon = ({ d, size = 16, sw = 1.6, fill = 'none', children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, display: 'block', ...style }} aria-hidden>
    {d ? <path d={d} /> : children}
  </svg>
);

const IconTray = (p) => (
  <Icon {...p}>
    <path d="M4 13l2.5-7a1.5 1.5 0 0 1 1.4-1h8.2a1.5 1.5 0 0 1 1.4 1L20 13" />
    <path d="M4 13v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    <path d="M4 13h4l1.2 2h5.6L16 13h4" />
  </Icon>
);

const IconSun = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
  </Icon>
);

const IconCalendar = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
);

const IconCalendarStack = (p) => (
  <Icon {...p}>
    <rect x="3" y="6" width="14" height="13" rx="2" />
    <path d="M3 10h14M7 4v4" />
    <path d="M9 9l4 3" opacity="0" />
    <path d="M19 8.5v9a1.5 1.5 0 0 1-1.5 1.5" />
    <path d="M21 6.5v9a1.5 1.5 0 0 1-1.5 1.5" opacity="0.5" />
  </Icon>
);

const IconCloud = (p) => (
  <Icon {...p}>
    <path d="M7 18a4 4 0 0 1-1-7.9A5 5 0 0 1 16 9.5 4 4 0 0 1 17 18H7z" />
  </Icon>
);

const IconFolder = (p) => (
  <Icon {...p}>
    <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3.4a2 2 0 0 1 1.3.5l1.3 1.1a2 2 0 0 0 1.3.5h5.7a2 2 0 0 1 2 2v7.4a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V7.5z" />
  </Icon>
);

const IconBell = (p) => (
  <Icon {...p}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5H4.5L6 16z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </Icon>
);

const IconSparkle = ({ size = 16, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: 'block', ...style }} aria-hidden>
    <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" fill={color} />
    <path d="M19 16l.7 2 2 .7-2 .7L19 22l-.7-2-2-.7 2-.7L19 16z" fill={color} opacity="0.7" />
  </svg>
);

const IconLock = (p) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);

const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

const IconSearch = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </Icon>
);

const IconSidebar = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M9 5v14" />
  </Icon>
);

const IconChevronDown = (p) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

const IconCheck = (p) => (
  <Icon {...p}>
    <path d="M5 12l5 5 9-11" />
  </Icon>
);

const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

const IconFlag = (p) => (
  <Icon {...p}>
    <path d="M5 21V4M5 5h11l-2 3.5L16 13H5" />
  </Icon>
);

const IconRepeat = (p) => (
  <Icon {...p}>
    <path d="M17 4l3 3-3 3" />
    <path d="M4 11V9a2 2 0 0 1 2-2h14" />
    <path d="M7 20l-3-3 3-3" />
    <path d="M20 13v2a2 2 0 0 1-2 2H4" />
  </Icon>
);

const IconTag = (p) => (
  <Icon {...p}>
    <path d="M3 12V4h8l10 10-8 8L3 12z" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
  </Icon>
);

const IconHashtag = (p) => (
  <Icon {...p}>
    <path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" />
  </Icon>
);

const IconArrowRight = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

const IconMore = (p) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </Icon>
);

const IconX = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6l-12 12" />
  </Icon>
);

const IconRefresh = (p) => (
  <Icon {...p}>
    <path d="M4 12a8 8 0 0 1 14-5.3L20 8" />
    <path d="M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-14 5.3L4 16" />
    <path d="M4 20v-4h4" />
  </Icon>
);

const IconPhone = (p) => (
  <Icon {...p}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2 16 16 0 0 1-15-15 2 2 0 0 1 2-2z" />
  </Icon>
);

const IconMail = (p) => (
  <Icon {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 8l9 6 9-6" />
  </Icon>
);

const IconBriefcase = (p) => (
  <Icon {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
  </Icon>
);

const IconHome = (p) => (
  <Icon {...p}>
    <path d="M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-4v-6h-4v6H6a2 2 0 0 1-2-2v-8z" />
  </Icon>
);

const IconBook = (p) => (
  <Icon {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h11v16H6a2 2 0 0 0-2 2V5z" />
    <path d="M4 19a2 2 0 0 1 2-2h11v4H6a2 2 0 0 1-2-2z" />
  </Icon>
);

Object.assign(window, {
  Icon, IconTray, IconSun, IconCalendar, IconCalendarStack, IconCloud, IconFolder,
  IconBell, IconSparkle, IconLock, IconPlus, IconSearch, IconSidebar, IconChevronDown,
  IconCheck, IconClock, IconFlag, IconRepeat, IconTag, IconHashtag, IconArrowRight,
  IconMore, IconX, IconRefresh, IconPhone, IconMail, IconBriefcase, IconHome, IconBook,
});


// ════════════════════════════════════════════════════

// hifi-chrome.jsx — macOS Tahoe dark window chrome
// - Dark wallpaper surround (subtle gradient + glow blobs)
// - Window with traffic lights, translucent sidebar, liquid glass toolbar
// - Reusable sidebar items, AI summary card, etc.

// Color tokens — exported via HIFI for screens
const HIFI = {
  // wallpaper / window bg
  wall1:    '#0d1612',
  wall2:    '#0a0e0d',
  windowBg: '#1c1e1d',
  surface:  'rgba(255,255,255,0.04)',
  surface2: 'rgba(255,255,255,0.07)',
  surface3: 'rgba(255,255,255,0.10)',
  divider:  'rgba(255,255,255,0.07)',
  divider2: 'rgba(255,255,255,0.12)',
  // text
  text:    'rgba(255,255,255,0.94)',
  text2:   'rgba(255,255,255,0.62)',
  text3:   'rgba(255,255,255,0.40)',
  text4:   'rgba(255,255,255,0.22)',
  // accents (forest set, dark-friendly)
  accent:  '#30c779',
  accent2: '#1c8a52',
  accentBg:'rgba(48,199,121,0.14)',
  accentBg2:'rgba(48,199,121,0.08)',
  // event / outlook
  cal:     '#5e9fff',
  calBg:   'rgba(94,159,255,0.14)',
  // due / warning
  warn:    '#ff9f4f',
  warnBg:  'rgba(255,159,79,0.12)',
  // danger
  danger:  '#ff5e5e',
};

// Window wallpaper — what shows around the window in our canvas mock
function Wallpaper({ width, height, children, vibe = 'aurora', accent }) {
  // subtle radial blobs simulate a Tahoe-style wallpaper without being noisy
  const blobs = vibe === 'aurora' ? (
    <>
      <div style={{ position: 'absolute', top: -40, left: -60, width: 420, height: 380, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}33 0%, transparent 60%)`, filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -60, width: 460, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, #1a4d70aa 0%, transparent 60%)', filter: 'blur(50px)' }} />
      <div style={{ position: 'absolute', top: '40%', left: '55%', width: 240, height: 240, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}1a 0%, transparent 70%)`, filter: 'blur(60px)' }} />
    </>
  ) : null;
  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      background: `linear-gradient(160deg, ${HIFI.wall1} 0%, ${HIFI.wall2} 100%)`,
    }}>
      {blobs}
      {children}
    </div>
  );
}

// Liquid glass pill / panel
function Glass({ children, style, radius = 14, dark = true, strong = false }) {
  return (
    <div style={{
      position: 'relative', borderRadius: radius, overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: strong ? 'rgba(28,30,29,0.72)' : 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: radius,
        border: '0.5px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// Traffic lights — real Tahoe colors
function TrafficLights({ inset, hover = false }) {
  const dot = (bg) => (
    <div style={{
      width: 12, height: 12, borderRadius: '50%', background: bg,
      boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.25)',
    }} />
  );
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', ...inset }}>
      {dot('#ff5f57')}{dot('#febc2e')}{dot('#28c840')}
    </div>
  );
}

// Tahoe window — wallpaper + window with sidebar + content
function TahoeWindow({ width, height, sidebar, children, accent, label, wallVibe = 'aurora', winInset = 24 }) {
  const winW = width - winInset * 2;
  const winH = height - winInset * 2;
  return (
    <Wallpaper width={width} height={height} accent={accent || HIFI.accent} vibe={wallVibe}>
      <div style={{
        position: 'absolute', top: winInset, left: winInset, width: winW, height: winH,
        borderRadius: 12, overflow: 'hidden',
        background: HIFI.windowBg,
        boxShadow: '0 0 0 0.5px rgba(255,255,255,0.10), 0 1px 1px rgba(0,0,0,0.4), 0 24px 60px rgba(0,0,0,0.45)',
        display: 'flex',
      }}>
        {sidebar}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          {children}
        </div>
      </div>
    </Wallpaper>
  );
}

// Translucent dark sidebar — Tahoe style
function TahoeSidebar({ children, width = 232 }) {
  return (
    <div style={{
      width, flexShrink: 0, position: 'relative',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
      borderRight: `0.5px solid ${HIFI.divider}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* traffic lights area */}
      <div style={{ height: 38, padding: '11px 14px', display: 'flex', alignItems: 'center' }}>
        <TrafficLights />
      </div>
      <div style={{ flex: 1, padding: '6px 0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

function SBSection({ title, children, mt = 14 }) {
  return (
    <div style={{ marginTop: mt }}>
      {title && (
        <div style={{
          padding: '6px 22px 6px', fontSize: 11, fontWeight: 600,
          color: HIFI.text3, letterSpacing: 0.2, textTransform: 'none',
        }}>{title}</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

function SBItem({ icon: Ico, label, count, badge, active, accent }) {
  const c = accent || HIFI.accent;
  return (
    <div style={{
      margin: '1px 10px', borderRadius: 7,
      padding: '7px 12px',
      display: 'flex', alignItems: 'center', gap: 9,
      background: active ? HIFI.surface3 : 'transparent',
      color: active ? HIFI.text : HIFI.text2,
      fontSize: 13.5, fontWeight: active ? 500 : 400,
    }}>
      {Ico && <Ico size={15} sw={1.7} style={{ color: active ? c : HIFI.text2 }} />}
      <span style={{ flex: 1, letterSpacing: -0.1 }}>{label}</span>
      {badge != null && (
        <span style={{
          fontSize: 10.5, fontWeight: 600, color: '#fff',
          background: c, padding: '1px 6px', borderRadius: 8, minWidth: 16, textAlign: 'center',
        }}>{badge}</span>
      )}
      {badge == null && count != null && (
        <span style={{ fontSize: 12, color: HIFI.text3, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
      )}
    </div>
  );
}

// Liquid-glass toolbar (top of content area)
function Toolbar({ title, subtitle, right, sticky = true }) {
  return (
    <div style={{
      position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 3,
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(28,30,29,0.55)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      borderBottom: `0.5px solid ${HIFI.divider}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: HIFI.text, letterSpacing: -0.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: HIFI.text3, marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// Glass icon button (sits in toolbar)
function GlassButton({ children, label, size = 30, primary, accent, onClick }) {
  const c = accent || HIFI.accent;
  return (
    <div style={{
      height: size, padding: label ? '0 12px' : 0, minWidth: size,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      borderRadius: size / 2,
      background: primary ? c : HIFI.surface2,
      color: primary ? '#fff' : HIFI.text,
      fontSize: 12.5, fontWeight: 500, letterSpacing: -0.1,
      boxShadow: primary
        ? `0 0 0 0.5px ${c}, inset 0 1px 0 rgba(255,255,255,0.18)`
        : `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px rgba(255,255,255,0.06)`,
      cursor: 'default',
    }} onClick={onClick}>
      {children}
      {label && <span>{label}</span>}
    </div>
  );
}

// Animated/static check circle (interactive look)
function Check({ checked, size = 18, accent, faint }) {
  const c = accent || HIFI.accent;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: checked ? c : 'transparent',
      border: `1.5px solid ${checked ? c : (faint ? HIFI.text4 : HIFI.text3)}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'all .15s',
    }}>
      {checked && <IconCheck size={size - 6} sw={2.4} style={{ color: '#fff' }} />}
    </div>
  );
}

// Common "Standard sidebar" used in app screens
function StandardSidebar({ active = 'today', inboxCount = 7, counts, accent }) {
  const c = { today: 6, upcoming: 12, someday: 3, ...(counts || {}) };
  return (
    <TahoeSidebar>
      {/* Quick add cell at top */}
      <div style={{ padding: '6px 12px 8px' }}>
        <div style={{
          height: 30, borderRadius: 8,
          background: HIFI.surface2, color: HIFI.text3,
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', fontSize: 12.5,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.06)`,
        }}>
          <IconSearch size={13} sw={1.7} style={{ color: HIFI.text3 }} />
          <span style={{ flex: 1 }}>Search or capture…</span>
          <span style={{ fontSize: 10, color: HIFI.text4, fontFamily: 'ui-monospace, SF Mono, Menlo, monospace' }}>⌘K</span>
        </div>
      </div>

      <SBSection mt={2}>
        <SBItem icon={IconTray} label="Inbox" badge={inboxCount || undefined} active={active === 'inbox'} accent={accent} />
      </SBSection>

      <SBSection title="Smart">
        <SBItem icon={IconSun}           label="Today"    count={c.today}    active={active === 'today'}    accent={accent} />
        <SBItem icon={IconCalendarStack} label="Upcoming" count={c.upcoming} active={active === 'upcoming'} accent={accent} />
        <SBItem icon={IconCloud}         label="Someday"  count={c.someday}  active={active === 'someday'}  accent={accent} />
      </SBSection>

      <SBSection title="Projects">
        <SBItem icon={IconBriefcase} label="Work"     count="22" accent={accent} />
        <SBItem icon={IconHome}      label="Personal" count="14" accent={accent} />
        <SBItem icon={IconHome}      label="Home"     count="6"  accent={accent} />
        <SBItem icon={IconBook}      label="Reading"  count="9"  accent={accent} />
      </SBSection>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* connected account at bottom */}
      <div style={{
        margin: '10px 12px', padding: '8px 10px', borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 10,
        background: HIFI.surface, fontSize: 12,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent || HIFI.accent}, ${HIFI.cal})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff',
        }}>DH</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: HIFI.text, fontWeight: 500, letterSpacing: -0.1 }}>Daniel</div>
          <div style={{ color: HIFI.text3, fontSize: 10.5, marginTop: 1 }}>Outlook · synced 2m ago</div>
        </div>
      </div>
    </TahoeSidebar>
  );
}

Object.assign(window, {
  HIFI, Wallpaper, Glass, TrafficLights, TahoeWindow, TahoeSidebar,
  SBSection, SBItem, Toolbar, GlassButton, Check, StandardSidebar,
});


// ════════════════════════════════════════════════════

// hifi-screens.jsx — Today, Notification, Inbox screens

const W_WIN = 1080, H_WIN = 720;

// ─────────────────────────────────────────────────────────────
// SCREEN · Today / AI day plan
// ─────────────────────────────────────────────────────────────
function HF_Today({ accent, density = 'balanced' }) {
  const items = [
    { time: '09:00', kind: 'event', title: 'Stand-up · Design crew',          dur: '30 min', meta: 'Outlook · Teams call',                  lock: true },
    { time: '09:30', kind: 'task',  title: "Reply to Naomi's spec review",    dur: '20 min', meta: 'Work · AI scheduled', project: 'Work' },
    { time: '10:00', kind: 'event', title: 'Design review · Q3 roadmap',     dur: '60 min', meta: 'Outlook · Studio A',                    lock: true },
    { time: '11:00', kind: 'task',  title: 'Draft Q3 OKRs',                  dur: '45 min', meta: 'Work · AI scheduled', project: 'Work' },
    { time: '12:00', kind: 'event', title: 'Lunch · Anna',                   dur: '60 min', meta: 'Outlook · Café Lumière',                lock: true },
    { time: '14:00', kind: 'task',  title: 'Pay rent',                       dur: '5 min',  meta: 'Personal · monthly',  project: 'Personal', due: true },
    { time: '14:15', kind: 'task',  title: 'Pick up dry cleaning',           dur: '15 min', meta: 'Personal · on the way home', project: 'Personal' },
    { time: '15:00', kind: 'task',  title: 'Email Lars re: contract draft',  dur: '25 min', meta: 'Work · AI scheduled', project: 'Work' },
  ];

  const rowGap = density === 'dense' ? 8 : (density === 'spacious' ? 16 : 11);

  return (
    <TahoeWindow width={W_WIN} height={H_WIN} accent={accent}
      sidebar={<StandardSidebar active="today" accent={accent} />}>

      <Toolbar
        title="Today"
        subtitle={<span><span style={{ color: HIFI.text2 }}>Tue · May 19</span> &nbsp;·&nbsp; 6 tasks · 3h 10m free</span>}
        right={
          <div style={{ display: 'flex', gap: 6 }}>
            <GlassButton><IconRefresh size={14} sw={1.8} style={{ color: HIFI.text2 }} /></GlassButton>
            <GlassButton><IconSearch  size={14} sw={1.8} style={{ color: HIFI.text2 }} /></GlassButton>
            <GlassButton><IconSidebar size={14} sw={1.8} style={{ color: HIFI.text2 }} /></GlassButton>
            <GlassButton primary accent={accent} label="New task">
              <IconPlus size={13} sw={2} />
            </GlassButton>
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 80px' }}>
        {/* AI summary card — subtle */}
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: HIFI.surface, border: `0.5px solid ${HIFI.divider2}`,
          display: 'flex', gap: 14, marginBottom: 22,
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            borderRadius: 8, background: HIFI.accentBg2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `0.5px solid ${HIFI.accent2}`,
          }}>
            <IconSparkle size={15} color={accent} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: HIFI.text, letterSpacing: -0.1 }}>Good morning, Daniel.</div>
              <div style={{ fontSize: 10, color: HIFI.text3, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Apple Intelligence</div>
            </div>
            <div style={{ fontSize: 13, color: HIFI.text2, lineHeight: 1.5, marginTop: 4, maxWidth: 640 }}>
              Three meetings locked from Outlook. I slotted four todos into your free windows — the biggest block is 13:00–17:00 after lunch. <span style={{ color: accent, fontWeight: 500 }}>Pay rent</span> is due today, so I put it first in the afternoon.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: 'flex-start' }}>
            <GlassButton size={26} label="Replan"><IconRefresh size={11} sw={1.8} style={{ color: HIFI.text2 }} /></GlassButton>
            <GlassButton size={26} label="Tweak"><IconMore size={11} style={{ color: HIFI.text2 }} /></GlassButton>
          </div>
        </div>

        {/* Timeline */}
        <div>
          {items.map((it, i) => (
            <TLRow key={i} {...it} accent={accent} gap={rowGap} prev={items[i-1]} />
          ))}
          {/* end-of-day */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0 4px', marginLeft: 4 }}>
            <div style={{ fontSize: 11, color: HIFI.text4, fontVariantNumeric: 'tabular-nums', width: 48 }}>17:00</div>
            <div style={{ flex: 1, height: 1, background: HIFI.divider }} />
            <div style={{ fontSize: 11, color: HIFI.text4 }}>End of work day</div>
          </div>
        </div>
      </div>
    </TahoeWindow>
  );
}

function TLRow({ time, kind, title, dur, meta, lock, due, project, accent, gap, prev }) {
  const isEvent = kind === 'event';
  const showHourLabel = !prev || prev.time.slice(0,2) !== time.slice(0,2);

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: gap }}>
      {/* time column */}
      <div style={{ width: 56, flexShrink: 0, paddingTop: 14, fontSize: 11.5, fontVariantNumeric: 'tabular-nums', color: HIFI.text3 }}>
        {time}
      </div>
      {/* rail */}
      <div style={{ width: 22, flexShrink: 0, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 9, top: -gap, bottom: -gap,
          width: 1, background: HIFI.divider,
        }} />
        <div style={{
          position: 'absolute', left: 5, top: 16, width: 10, height: 10, borderRadius: '50%',
          background: due ? accent : (isEvent ? HIFI.cal : HIFI.windowBg),
          border: `1.5px solid ${isEvent ? HIFI.cal : (due ? accent : HIFI.text3)}`,
          boxShadow: due ? `0 0 0 3px ${HIFI.accentBg}` : (isEvent ? `0 0 0 3px ${HIFI.calBg}` : 'none'),
        }} />
      </div>
      {/* card */}
      <div style={{
        flex: 1, marginLeft: 6, borderRadius: 10,
        background: isEvent ? HIFI.calBg : (due ? HIFI.accentBg : HIFI.surface),
        border: `0.5px solid ${isEvent ? 'rgba(94,159,255,0.30)' : (due ? 'rgba(48,199,121,0.36)' : HIFI.divider2)}`,
        padding: '11px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isEvent ? (
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              background: 'rgba(94,159,255,0.18)',
              border: '0.5px solid rgba(94,159,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: HIFI.cal,
            }}>
              {lock ? <IconLock size={10} sw={2} /> : <IconCalendar size={10} sw={2} />}
            </div>
          ) : (
            <Check accent={accent} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13.5, fontWeight: due ? 600 : 500,
              color: isEvent ? '#bcd5ff' : HIFI.text,
              letterSpacing: -0.1, lineHeight: 1.25,
            }}>{title}</div>
            <div style={{
              fontSize: 11, color: isEvent ? 'rgba(188,213,255,0.6)' : HIFI.text3,
              marginTop: 2, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>{dur}</span>
              <span style={{ width: 2, height: 2, borderRadius: 1, background: 'currentColor', opacity: 0.6 }} />
              <span>{meta}</span>
            </div>
          </div>
          {due && (
            <span style={{
              fontSize: 9.5, fontWeight: 700, color: accent,
              padding: '2px 7px', borderRadius: 4,
              background: HIFI.accentBg, border: `0.5px solid ${accent}`,
              letterSpacing: 0.6, textTransform: 'uppercase',
            }}>Due today</span>
          )}
          {!isEvent && !due && (
            <IconMore size={14} style={{ color: HIFI.text4 }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN · Notification (stack + snooze)
// ─────────────────────────────────────────────────────────────
function HF_Notification({ accent }) {
  return (
    <Wallpaper width={W_WIN} height={H_WIN} accent={accent}>
      {/* Menu bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 26,
        background: 'rgba(20,22,21,0.55)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 18,
        fontSize: 12.5, color: HIFI.text,
      }}>
        <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden style={{ marginTop: -1 }}>
          <path d="M9.8 8.4c0-1.8 1.5-2.7 1.6-2.7-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.6-1.3 0-2.5.8-3.1 1.9-1.3 2.3-.3 5.7.9 7.6.6.9 1.4 1.9 2.4 1.9 1 0 1.3-.6 2.5-.6 1.1 0 1.5.6 2.5.6 1 0 1.7-.9 2.3-1.9.7-1 1-2.1 1.1-2.1-.1 0-2.2-.8-2.2-3.3zM8 2.7c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.4.8.1 1.7-.5 2.2-1.2z" />
        </svg>
        <span style={{ fontWeight: 700 }}>To Do</span>
        <span style={{ color: HIFI.text2 }}>File</span>
        <span style={{ color: HIFI.text2 }}>Edit</span>
        <span style={{ color: HIFI.text2 }}>View</span>
        <span style={{ color: HIFI.text2 }}>Window</span>
        <span style={{ color: HIFI.text2 }}>Help</span>
        <div style={{ flex: 1 }} />
        <IconBell size={13} sw={1.8} style={{ color: HIFI.text }} />
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>Tue 19 May  13:59</span>
      </div>

      {/* Notification stack (back-to-front) */}
      <NotifBack accent={accent}  top={158} title="Email Lars re: contract draft" project="Work · 2h overdue"     icon={IconMail}  rotate={2.5} dx={26} opacity={0.78} />
      <NotifBack accent={accent}  top={124} title="Call dentist about Saturday"   project="Personal · due 14:00"    icon={IconPhone} rotate={-1.5} dx={14} opacity={0.92} />

      {/* Active (front) notification */}
      <div style={{
        position: 'absolute', top: 60, right: 22, width: 360, zIndex: 5,
        borderRadius: 18, overflow: 'hidden',
      }}>
        <Glass radius={18} strong>
          <div style={{ padding: '14px 16px 14px' }}>
            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
              }}>
                <IconCheck size={13} sw={2.4} style={{ color: '#fff' }} />
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: HIFI.text }}>To Do</span>
              <span style={{ fontSize: 11, color: HIFI.text3 }}>Reminder</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: HIFI.text3 }}>now</span>
              <IconX size={11} sw={2.2} style={{ color: HIFI.text3 }} />
            </div>

            {/* task */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: HIFI.accentBg, border: `0.5px solid ${HIFI.accent2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
              }}><IconBell size={17} sw={1.8} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: HIFI.text, letterSpacing: -0.2 }}>Pay rent</div>
                <div style={{ fontSize: 12, color: HIFI.text2, marginTop: 2 }}>
                  Due in <span style={{ color: accent, fontWeight: 500 }}>1 hour</span> · 14:00 · Personal
                </div>
              </div>
            </div>

            {/* actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <NotifBtn primary accent={accent}><IconCheck size={11} sw={2.4} style={{ color: '#fff', marginRight: 4 }} /> Mark done</NotifBtn>
              <NotifBtn>Open</NotifBtn>
              <div style={{ flex: 1 }} />
              <NotifBtn accent={accent} highlight>Snooze <IconChevronDown size={10} sw={2.4} style={{ marginLeft: 2 }} /></NotifBtn>
            </div>
          </div>
        </Glass>
      </div>

      {/* Snooze menu — popover from the Snooze button */}
      <div style={{
        position: 'absolute', top: 196, right: 22, width: 218, zIndex: 6,
        borderRadius: 14, overflow: 'hidden',
      }}>
        <Glass radius={14} strong>
          <div style={{ padding: 6 }}>
            <div style={{
              padding: '8px 12px 4px', fontSize: 10.5, fontWeight: 600,
              color: HIFI.text3, letterSpacing: 0.4, textTransform: 'uppercase',
            }}>Remind again in</div>
            {[
              { label: '15 minutes', kbd: '1' },
              { label: '30 minutes', kbd: '2' },
              { label: '1 hour',     kbd: '3', active: true },
              { label: '2 hours',    kbd: '4' },
              { label: '4 hours',    kbd: '5' },
              { label: '1 day',      kbd: '6' },
              { label: '2 days',     kbd: '7' },
            ].map((s) => (
              <div key={s.label} style={{
                margin: '1px 0', padding: '7px 12px', borderRadius: 7,
                fontSize: 13, fontWeight: 500, letterSpacing: -0.1,
                color: s.active ? '#fff' : HIFI.text,
                background: s.active ? accent : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                whiteSpace: 'nowrap',
              }}>
                <span>{s.label}</span>
                <span style={{
                  fontSize: 10, fontFamily: 'ui-monospace, SF Mono, Menlo, monospace',
                  color: s.active ? 'rgba(255,255,255,0.85)' : HIFI.text3,
                }}>{s.kbd}</span>
              </div>
            ))}
            <div style={{ height: 1, background: HIFI.divider, margin: '4px 8px' }} />
            <div style={{
              margin: '1px 0', padding: '7px 12px', borderRadius: 7,
              fontSize: 13, fontWeight: 500, color: HIFI.text2,
              display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
            }}>
              <IconClock size={12} sw={1.8} />
              <span>Pick a time…</span>
            </div>
          </div>
        </Glass>
      </div>

      {/* stack indicator */}
      <div style={{
        position: 'absolute', top: 38, right: 22,
        fontSize: 10.5, color: HIFI.text2, fontWeight: 500,
        padding: '3px 10px', borderRadius: 10,
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        3 reminders <IconChevronDown size={9} sw={2.2} />
      </div>

      {/* Dock */}
      <Dock accent={accent} />
    </Wallpaper>
  );
}

function NotifBack({ accent, top, title, project, icon: Ico, rotate, dx, opacity }) {
  return (
    <div style={{
      position: 'absolute', top, right: 22 + dx, width: 360, zIndex: 3,
      transform: `rotate(${rotate}deg)`, transformOrigin: 'top right',
      opacity, borderRadius: 18, overflow: 'hidden',
    }}>
      <Glass radius={18} strong>
        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: HIFI.surface2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: HIFI.text2,
          }}><Ico size={15} sw={1.8} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: HIFI.text }}>To Do</span>
              <span style={{ fontSize: 10.5, color: HIFI.text3 }}>Reminder</span>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: HIFI.text, marginTop: 1, letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
            <div style={{ fontSize: 11, color: HIFI.text3, marginTop: 1 }}>{project}</div>
          </div>
        </div>
      </Glass>
    </div>
  );
}

function NotifBtn({ children, primary, accent, highlight }) {
  return (
    <div style={{
      height: 28, padding: '0 12px', borderRadius: 8,
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12.5, fontWeight: 500, letterSpacing: -0.1,
      background: primary ? accent : (highlight ? HIFI.accentBg : 'rgba(255,255,255,0.10)'),
      color: primary ? '#fff' : (highlight ? accent : HIFI.text),
      boxShadow: primary
        ? 'inset 0 1px 0 rgba(255,255,255,0.18)'
        : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 0.5px rgba(255,255,255,0.06)',
      whiteSpace: 'nowrap',
    }}>{children}</div>
  );
}

function Dock({ accent }) {
  const apps = [
    { bg: '#5e9fff', label: 'F', name: 'Finder' },
    { bg: '#ff5e5e', label: '◐', name: 'Safari' },
    { bg: accent,    label: '✓', name: 'To Do', badge: 3 },
    { bg: '#7a5ae0', label: '✉', name: 'Mail' },
    { bg: '#f5b400', label: '🗓', name: 'Calendar' },
    { bg: '#888',    label: '⚙', name: 'Settings' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      padding: '8px 10px', borderRadius: 22, display: 'flex', gap: 10,
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 30px rgba(0,0,0,0.4)',
    }}>
      {apps.map((a, i) => (
        <div key={i} style={{
          width: 44, height: 44, borderRadius: 11, position: 'relative',
          background: `linear-gradient(135deg, ${a.bg}, ${a.bg}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 18, fontWeight: 600,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.3)',
        }}>
          <span>{a.label}</span>
          {a.badge && (
            <div style={{
              position: 'absolute', top: -3, right: -3,
              minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
              background: '#ff3b30', color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1.5px rgba(255,255,255,0.95)',
            }}>{a.badge}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN · Inbox processing
// ─────────────────────────────────────────────────────────────
function HF_Inbox({ accent, density = 'balanced' }) {
  return (
    <TahoeWindow width={W_WIN} height={H_WIN} accent={accent}
      sidebar={<StandardSidebar active="inbox" inboxCount={7} accent={accent} />}>

      <Toolbar
        title="Inbox"
        subtitle={<span><span style={{ color: HIFI.text2 }}>7 to process</span> &nbsp;·&nbsp; captured today + 2 from yesterday</span>}
        right={
          <div style={{ display: 'flex', gap: 6 }}>
            <GlassButton><IconMore size={14} style={{ color: HIFI.text2 }} /></GlassButton>
            <GlassButton primary accent={accent} label="Process with AI">
              <IconSparkle size={11} color="#fff" />
            </GlassButton>
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 28px 80px' }}>
        {/* progress card */}
        <div style={{
          padding: '12px 16px', borderRadius: 12, marginBottom: 20,
          background: HIFI.surface, border: `0.5px solid ${HIFI.divider2}`,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: HIFI.text }}>Tonight's review</span>
              <span style={{ fontSize: 11, color: HIFI.text3 }}>2 of 7 sorted</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: HIFI.text3 }}>~ 3 min left</span>
            </div>
            <div style={{
              height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
              <div style={{ height: '100%', width: '28%', background: accent, borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* expanded item being processed */}
        <ExpandedInboxItem accent={accent} />

        {/* upcoming queue */}
        <div style={{ fontSize: 10.5, fontWeight: 600, color: HIFI.text3, letterSpacing: 0.4, textTransform: 'uppercase', margin: '20px 0 10px' }}>
          Up next
        </div>

        <InboxRow accent={accent} icon={IconPhone} title="Call dentist about Saturday" meta="captured today · 10:02"  />
        <InboxRow accent={accent} icon={IconTag}   title="Buy birthday card for mom"    meta="captured today · 09:48"  />
        <InboxRow accent={accent} icon={IconFlag}  title="Renew gym membership"         meta="captured yesterday · 18:30"  />

        <div style={{ fontSize: 10.5, fontWeight: 600, color: HIFI.text3, letterSpacing: 0.4, textTransform: 'uppercase', margin: '24px 0 10px' }}>
          Sorted today
        </div>

        <InboxRow accent={accent} icon={IconMail}  title="Email Lars re: contract draft" meta="Work · due Wed"      sorted />
        <InboxRow accent={accent} icon={IconHome}  title="Pick up package from neighbour" meta="Home · due tomorrow" sorted />
      </div>
    </TahoeWindow>
  );
}

function ExpandedInboxItem({ accent }) {
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      background: HIFI.surface2,
      border: `0.5px solid ${HIFI.accent}`,
      boxShadow: `0 0 0 3px ${HIFI.accentBg2}, 0 10px 30px rgba(0,0,0,0.3)`,
    }}>
      {/* head */}
      <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Check accent={accent} size={20} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: HIFI.text, letterSpacing: -0.2 }}>Book flight to Berlin for design summit</div>
          <div style={{ fontSize: 11.5, color: HIFI.text3, marginTop: 3, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>captured 11:14</span>
            <span style={{ width: 2, height: 2, borderRadius: 1, background: HIFI.text4 }} />
            <span>iPhone · Drafts shortcut</span>
            <span style={{ width: 2, height: 2, borderRadius: 1, background: HIFI.text4 }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: accent }}>
              <IconSparkle size={10} color={accent} /> AI suggested fields
            </span>
          </div>
        </div>
        <div style={{
          fontSize: 9.5, fontWeight: 700, color: accent,
          padding: '3px 8px', borderRadius: 4,
          background: HIFI.accentBg, border: `0.5px solid ${accent}`,
          letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 2,
        }}>Editing</div>
      </div>

      {/* fields */}
      <div style={{ padding: '4px 18px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <FieldRow label="Project"   value={<ProjectChip icon={IconBriefcase} label="Work"            accent={accent} />} />
        <FieldRow label="Due date"  value={<ProjectChip icon={IconCalendar}  label="Mon, Jun 2"      accent={accent} />} hint="suggested by AI" accent={accent} />
        <FieldRow label="Remind"    value={<ProjectChip icon={IconBell}      label="1 day before"    accent={accent} />} />
        <FieldRow label="Est. time" value={<ProjectChip icon={IconClock}     label="30 min"          accent={accent} />} />
        <FieldRow label="Tags"      value={
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <ProjectChip icon={IconHashtag} label="travel" accent={accent} ghost />
            <ProjectChip icon={IconPlus}    label="Add tag" accent={accent} muted />
          </div>
        } />
      </div>

      {/* footer */}
      <div style={{
        padding: '11px 18px', borderTop: `0.5px solid ${HIFI.divider}`,
        background: HIFI.surface,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <GlassButton size={28} primary accent={accent} label="Save & next">
          <IconArrowRight size={11} sw={2} />
        </GlassButton>
        <GlassButton size={28} label="Skip" />
        <GlassButton size={28} label="Delete" />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, color: HIFI.text3, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Kbd label="⌘↵" /> save
          <Kbd label="esc" /> close
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value, hint, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 92, fontSize: 11, fontWeight: 600, color: HIFI.text3,
        letterSpacing: 0.4, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        {value}
        {hint && (
          <span style={{ fontSize: 11, color: accent, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconSparkle size={10} color={accent} />{hint}
          </span>
        )}
      </div>
    </div>
  );
}

function ProjectChip({ icon: Ico, label, accent, ghost, muted }) {
  return (
    <div style={{
      height: 26, padding: '0 10px', borderRadius: 13,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12.5, fontWeight: 500, letterSpacing: -0.1,
      color: muted ? HIFI.text3 : (ghost ? HIFI.text : HIFI.text),
      background: ghost ? HIFI.surface2 : HIFI.accentBg,
      border: ghost ? `0.5px solid ${HIFI.divider2}` : (muted ? `0.5px dashed ${HIFI.text4}` : `0.5px solid ${HIFI.accent2}`),
    }}>
      <Ico size={12} sw={1.9} style={{ color: muted ? HIFI.text3 : (ghost ? HIFI.text2 : accent) }} />
      <span>{label}</span>
      {!muted && <IconChevronDown size={9} sw={2.2} style={{ color: HIFI.text3, marginLeft: 2 }} />}
    </div>
  );
}

function Kbd({ label }) {
  return (
    <span style={{
      fontFamily: 'ui-monospace, SF Mono, Menlo, monospace', fontSize: 10,
      padding: '1px 6px', borderRadius: 4,
      background: HIFI.surface2, color: HIFI.text2,
      boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.06)',
    }}>{label}</span>
  );
}

function InboxRow({ icon: Ico, title, meta, accent, sorted }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10, marginBottom: 6,
      background: sorted ? 'transparent' : HIFI.surface,
      border: `0.5px solid ${sorted ? 'transparent' : HIFI.divider2}`,
      display: 'flex', alignItems: 'center', gap: 12,
      opacity: sorted ? 0.55 : 1,
    }}>
      <Check accent={accent} checked={sorted} size={18} faint={!sorted} />
      <div style={{
        width: 26, height: 26, borderRadius: 7,
        background: HIFI.surface2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: HIFI.text2, flexShrink: 0,
      }}><Ico size={14} sw={1.8} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 500, color: HIFI.text, letterSpacing: -0.1,
          textDecoration: sorted ? 'line-through' : 'none',
        }}>{title}</div>
        <div style={{ fontSize: 11, color: HIFI.text3, marginTop: 2 }}>{meta}</div>
      </div>
      {!sorted && (
        <span style={{
          fontSize: 9.5, fontWeight: 700, color: HIFI.warn,
          padding: '2px 7px', borderRadius: 4,
          background: HIFI.warnBg, border: `0.5px solid rgba(255,159,79,0.35)`,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>Needs sort</span>
      )}
      <IconChevronDown size={13} sw={1.8} style={{ color: HIFI.text4, transform: 'rotate(-90deg)' }} />
    </div>
  );
}

Object.assign(window, { HF_Today, HF_Notification, HF_Inbox, W_WIN, H_WIN });


// ════════════════════════════════════════════════════

// hifi-app.jsx — design canvas with 3 hi-fi screens

const HIFI_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#30c779",
  "density": "balanced"
}/*EDITMODE-END*/;

function HiFiApp() {
  const [t, setTweak] = useTweaks(HIFI_TWEAK_DEFAULTS);
  const accent = t.accent;
  const density = t.density;

  return (
    <>
      <DesignCanvas>
        <DCSection id="intro" title="To Do · Hi-Fi" subtitle="macOS Tahoe · dark mode · SF Pro · forest accent">
          <DCArtboard id="cover" label="Visual system" width={520} height={H_WIN}>
            <Cover accent={accent} />
          </DCArtboard>
        </DCSection>

        <DCSection id="screens" title="Three priority screens" subtitle="Today (AI day plan) · Notification (stack + snooze) · Inbox (evening process)">
          <DCArtboard id="today" label="① Today — AI day plan" width={W_WIN} height={H_WIN}>
            <HF_Today accent={accent} density={density} />
          </DCArtboard>
          <DCArtboard id="notif" label="② Reminder · stack + snooze" width={W_WIN} height={H_WIN}>
            <HF_Notification accent={accent} />
          </DCArtboard>
          <DCArtboard id="inbox" label="③ Inbox processing" width={W_WIN} height={H_WIN}>
            <HF_Inbox accent={accent} density={density} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Look" />
        <TweakColor label="Accent" value={accent}
          options={['#30c779', '#5e9fff', '#d97757', '#a98bff', '#f5b400', '#ff5e5e']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={density}
          options={['spacious', 'balanced', 'dense']}
          onChange={(v) => setTweak('density', v)} />
      </TweaksPanel>
    </>
  );
}

function Cover({ accent }) {
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      background: 'linear-gradient(160deg, #0d1612 0%, #0a0e0d 100%)',
      padding: 32, color: HIFI.text,
      display: 'flex', flexDirection: 'column', gap: 22, position: 'relative', overflow: 'hidden',
    }}>
      {/* aurora glow */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}33 0%, transparent 60%)`, filter: 'blur(40px)' }} />

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: HIFI.text3, letterSpacing: 1, textTransform: 'uppercase' }}>To Do · macOS</div>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.8, marginTop: 6 }}>A calm assistant<br/>for your day.</div>
        <div style={{ fontSize: 14, color: HIFI.text2, marginTop: 10, lineHeight: 1.5, maxWidth: 380 }}>
          Capture in seconds. Sort once at night. Let Apple Intelligence plan tomorrow with your Outlook calendar.
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SystemRow label="Window" value="macOS Tahoe · dark mode" />
        <SystemRow label="Type" value="SF Pro Display / Text" />
        <SystemRow label="Accent" value={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: accent, boxShadow: `0 0 0 0.5px rgba(255,255,255,0.2)` }} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{accent}</span>
          </span>
        } />
        <SystemRow label="Surface" value="rgba(255,255,255,.04 → .10)" />
        <SystemRow label="Chrome" value="Liquid glass · 40px blur · 180% sat" />
        <SystemRow label="Radius" value="card 10 · pill 22 · window 12" />
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: HIFI.text3, letterSpacing: 0.6, textTransform: 'uppercase' }}>States used</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Pill bg={HIFI.calBg}      border="rgba(94,159,255,0.30)"     fg="#bcd5ff" label="Outlook event" />
          <Pill bg={HIFI.accentBg}   border="rgba(48,199,121,0.36)"     fg={accent}   label="Due today" />
          <Pill bg={HIFI.surface}    border={HIFI.divider2}             fg={HIFI.text} label="Task" />
          <Pill bg={HIFI.warnBg}     border="rgba(255,159,79,0.35)"     fg={HIFI.warn} label="Needs sort" />
        </div>
      </div>
    </div>
  );
}

function SystemRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0', borderBottom: `0.5px solid ${HIFI.divider}` }}>
      <div style={{ width: 80, fontSize: 11, color: HIFI.text3, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, color: HIFI.text, letterSpacing: -0.1 }}>{value}</div>
    </div>
  );
}

function Pill({ bg, border, fg, label }) {
  return (
    <span style={{
      padding: '5px 10px', borderRadius: 12,
      background: bg, border: `0.5px solid ${border}`, color: fg,
      fontSize: 11.5, fontWeight: 500,
    }}>{label}</span>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HiFiApp />);
