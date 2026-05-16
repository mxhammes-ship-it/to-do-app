// wireframes.jsx — Sketchy macOS To Do wireframes (Direction A, expanded)
// AI day plan · Inbox processing · stacked reminders with full snooze menu

const WF = {
  ink:    '#1a1a1a',
  ink2:   '#3a3a3a',
  muted:  '#7a7a7a',
  faint:  '#c8c4bc',
  faint2: '#e6e1d6',
  paper:  '#fbfaf6',
  panel:  '#f1ede4',
  cal:    '#6b7f9b',
  accent: '#d97757',
  hand:   "'Kalam', 'Caveat', sans-serif",
  mono:   "'JetBrains Mono', 'Courier New', monospace",
  scrip:  "'Caveat', cursive",
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d97757",
  "showNotes": true
}/*EDITMODE-END*/;

// ─── Primitives ───────────────────────────────────────────────
function Wobble({ w, h, r = 6, stroke = WF.ink, sw = 1.6, fill = 'transparent', dash = null, style }) {
  const seed = (w * 31 + h * 17 + r) % 97;
  const j = (i) => (((seed * (i + 1) * 13) % 7) - 3) * 0.35;
  const x1 = j(1), y1 = j(2), x2 = w + j(3), y2 = j(4);
  const x3 = w + j(5), y3 = h + j(6), x4 = j(7), y4 = h + j(8);
  const d = `M ${x1+r},${y1} L ${x2-r},${y2} Q ${x2},${y2} ${x2},${y2+r} L ${x3},${y3-r} Q ${x3},${y3} ${x3-r},${y3} L ${x4+r},${y4} Q ${x4},${y4} ${x4},${y4-r} L ${x1},${y1+r} Q ${x1},${y1} ${x1+r},${y1} Z`;
  return (
    <svg width={w} height={h} viewBox={`-2 -2 ${w+4} ${h+4}`} style={{ display: 'block', ...style }} aria-hidden>
      <path d={d} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill={fill} strokeDasharray={dash || undefined} />
    </svg>
  );
}

function Squiggle({ w, h = 8, sw = 1.4, stroke = WF.ink, style }) {
  const segs = Math.max(2, Math.floor(w / 14));
  let d = `M 0 ${h/2}`;
  for (let i = 1; i <= segs; i++) {
    const x = (w * i) / segs;
    const y = h/2 + (i % 2 === 0 ? -h/3 : h/3);
    d += ` Q ${x - w/(segs*2)} ${y} ${x} ${h/2}`;
  }
  return <svg width={w} height={h} style={{ display: 'block', ...style }} aria-hidden><path d={d} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" /></svg>;
}

function CheckCircle({ size = 16, checked = false, accent = WF.accent, stroke = WF.ink2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, display: 'block' }} aria-hidden>
      <circle cx="10" cy="10" r="8.2" fill="none" stroke={checked ? accent : stroke} strokeWidth="1.5" strokeDasharray={checked ? null : '1.5 2'} />
      {checked && <path d="M5.5 10 L 9 13.5 L 14.5 7" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

function Note({ children, top, left, right, bottom, rotate = -3, w = 150, color = '#fde68a' }) {
  return (
    <div style={{
      position: 'absolute', top, left, right, bottom, width: w, zIndex: 5,
      background: color, padding: '8px 10px', transform: `rotate(${rotate}deg)`,
      fontFamily: WF.scrip, fontSize: 15, lineHeight: 1.2, color: '#5a4a2a',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)',
    }}>{children}</div>
  );
}

// ─── Mac chrome ───────────────────────────────────────────────
function MacFrame({ width, height, title, children, sidebar }) {
  return (
    <div style={{
      width, height, background: WF.paper, position: 'relative',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: WF.hand,
    }}>
      <div style={{
        height: 36, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px',
        borderBottom: `1px dashed ${WF.faint}`, flexShrink: 0, background: WF.panel,
      }}>
        <svg width="56" height="14" viewBox="0 0 56 14" aria-hidden>
          {[8, 24, 40].map((cx, i) => (
            <circle key={i} cx={cx} cy="7" r="5" fill="none" stroke={WF.ink2} strokeWidth="1.2" strokeDasharray="2 1.5" />
          ))}
        </svg>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: WF.hand, fontSize: 14, color: WF.muted, letterSpacing: 0.3 }}>{title}</div>
        <div style={{ width: 56 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {sidebar && (
          <div style={{
            width: 180, background: WF.panel, borderRight: `1px dashed ${WF.faint}`,
            flexShrink: 0, padding: '12px 0', display: 'flex', flexDirection: 'column',
          }}>{sidebar}</div>
        )}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
}

function SBItem({ label, count, active, accent, badge, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 14px', margin: '1px 8px',
      position: 'relative', fontFamily: WF.hand, fontSize: 15,
      color: active ? WF.ink : WF.ink2,
    }}>
      {active && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Wobble w={164} h={28} r={6} stroke={accent} sw={1.3} fill="rgba(217,119,87,0.08)" />
        </div>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          {icon === 'inbox' ? (
            <path d="M2 6 L 2 11 L 12 11 L 12 6 L 9 6 L 8 8 L 6 8 L 5 6 Z M3 3 L 5.5 6 M11 3 L 8.5 6"
              fill="none" stroke={active ? accent : WF.ink2} strokeWidth="1.2" strokeLinejoin="round" />
          ) : icon === 'today' ? (
            <>
              <rect x="2" y="3" width="10" height="9" fill="none" stroke={active ? accent : WF.ink2} strokeWidth="1.2" />
              <line x1="2" y1="6" x2="12" y2="6" stroke={active ? accent : WF.ink2} strokeWidth="1.2" />
              <circle cx="7" cy="9" r="1.2" fill={active ? accent : WF.muted} />
            </>
          ) : icon === 'upcoming' ? (
            <path d="M2 7 L 7 12 L 12 7 M7 12 L 7 2" stroke={active ? accent : WF.ink2} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          ) : icon === 'someday' ? (
            <path d="M3 10 Q 7 4 11 10" stroke={active ? accent : WF.ink2} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="2 1.5" />
          ) : icon === 'folder' ? (
            <path d="M2 5 L 6 5 L 7.5 4 L 12 4 L 12 11 L 2 11 Z" fill="none" stroke={WF.muted} strokeWidth="1.1" strokeLinejoin="round" />
          ) : (
            <circle cx="7" cy="7" r="5.5" fill="none" stroke={active ? accent : WF.muted} strokeWidth="1.3" strokeDasharray="2 1.5" />
          )}
        </svg>
        <span style={{ flex: 1 }}>{label}</span>
        {badge ? (
          <span style={{
            fontSize: 10, fontFamily: WF.mono, color: '#fff',
            background: accent, padding: '1px 6px', borderRadius: 8, lineHeight: 1.4,
          }}>{badge}</span>
        ) : count != null && (
          <span style={{ fontSize: 12, color: WF.muted, fontFamily: WF.mono }}>{count}</span>
        )}
      </div>
    </div>
  );
}

function SBHeader({ label }) {
  return <div style={{
    padding: '12px 22px 4px', fontFamily: WF.mono, fontSize: 10,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: WF.muted,
  }}>{label}</div>;
}

function StandardSidebar({ accent, active = 'today', inboxCount = 7, counts = {} }) {
  const c = { today: 6, upcoming: 12, someday: 3, ...counts };
  return (
    <>
      <SBItem label="Inbox" badge={inboxCount || null} active={active === 'inbox'} accent={accent} icon="inbox" />
      <div style={{ height: 6 }} />
      <SBHeader label="Smart" />
      <SBItem label="Today"    count={c.today}    active={active === 'today'}    accent={accent} icon="today" />
      <SBItem label="Upcoming" count={c.upcoming} active={active === 'upcoming'} accent={accent} icon="upcoming" />
      <SBItem label="Someday"  count={c.someday}  active={active === 'someday'}  accent={accent} icon="someday" />
      <SBHeader label="Projects" />
      <SBItem label="Personal" count="14" icon="folder" />
      <SBItem label="Work"     count="22" icon="folder" />
      <SBItem label="Home"     count="6"  icon="folder" />
      <SBItem label="Reading"  count="9"  icon="folder" />
    </>
  );
}

function TaskRow({ text, time, checked = false, accent, hint, dense = false, est, project }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: dense ? '8px 18px' : '10px 22px',
      borderBottom: `1px dashed ${WF.faint}`,
      fontFamily: WF.hand,
    }}>
      <div style={{ paddingTop: 2 }}><CheckCircle size={17} checked={checked} accent={accent} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, lineHeight: 1.25, color: checked ? WF.muted : WF.ink,
          textDecoration: checked ? 'line-through' : 'none',
        }}>{text}</div>
        {(time || hint || est || project) && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 3, flexWrap: 'wrap' }}>
            {time    && <span style={{ fontFamily: WF.mono, fontSize: 11, color: accent }}>◷ {time}</span>}
            {est     && <span style={{ fontFamily: WF.mono, fontSize: 11, color: WF.muted }}>⏱ {est}</span>}
            {project && <span style={{ fontFamily: WF.mono, fontSize: 11, color: WF.muted }}>▢ {project}</span>}
            {hint    && <span style={{ fontFamily: WF.mono, fontSize: 11, color: WF.muted }}>{hint}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function PlusFab({ accent, size = 52, label = '+', style }) {
  return (
    <div style={{
      position: 'absolute', ...style,
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4,
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <circle cx={size/2} cy={size/2} r={size/2 - 2} fill="#fff" stroke={accent} strokeWidth="1.7" />
          <circle cx={size/2} cy={size/2} r={size/2 - 5} fill="none" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.5" />
        </svg>
      </div>
      <div style={{
        position: 'relative', fontFamily: WF.hand, fontSize: 30, fontWeight: 400,
        color: accent, lineHeight: 1, marginTop: -3,
      }}>{label}</div>
    </div>
  );
}

function MiniBtn({ label, accent, primary, ghost }) {
  return (
    <div style={{ position: 'relative', height: 24, padding: '0 10px', display: 'inline-flex', alignItems: 'center' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 24" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <rect x="1" y="1" width="98" height="22" rx="6"
          fill={primary ? accent : 'transparent'}
          stroke={primary ? accent : (ghost ? WF.faint : WF.muted)}
          strokeWidth="1.2"
          strokeDasharray={primary ? null : '2 1.5'} />
      </svg>
      <span style={{ position: 'relative', fontFamily: WF.hand, fontSize: 12, color: primary ? '#fff' : (ghost ? WF.muted : WF.ink2) }}>{label}</span>
    </div>
  );
}

function PillBtn({ label, accent, primary }) {
  return (
    <div style={{ position: 'relative', flex: 1, height: 30 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <rect x="1.5" y="1.5" width="97" height="27" rx="6" fill={primary ? accent : 'transparent'} stroke={primary ? accent : WF.ink2} strokeWidth="1.4" strokeDasharray={primary ? null : '2 1.5'} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: WF.hand, fontSize: 14, color: primary ? '#fff' : WF.ink2 }}>{label}</div>
    </div>
  );
}

function Field({ label, value, accent, placeholder }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, width: 70, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontFamily: WF.hand, fontSize: 14, color: placeholder ? WF.muted : (accent || WF.ink2), flex: 1, fontStyle: placeholder ? 'italic' : 'normal' }}>{value}</div>
    </div>
  );
}

const W = 780, H = 540;

// ─── A1 · Today (AI Day Plan) ──────────────────────────────────
function A_Today({ accent, showNotes }) {
  const items = [
    { time: '09:00', kind: 'event', title: 'Stand-up · Design crew',          meta: '30 min · Outlook',              lock: true },
    { time: '09:30', kind: 'task',  title: "Reply to Naomi's spec review",    meta: 'AI slotted · 20 min · Work' },
    { time: '10:00', kind: 'event', title: 'Design review · Q3 roadmap',     meta: '60 min · Outlook',              lock: true },
    { time: '11:00', kind: 'task',  title: 'Draft Q3 OKRs',                  meta: 'AI slotted · 45 min · Work' },
    { time: '12:00', kind: 'event', title: 'Lunch · Anna',                   meta: '60 min · Outlook',              lock: true },
    { time: '14:00', kind: 'task',  title: 'Pay rent',                       meta: 'Due today · 5 min · Personal', due: true },
    { time: '14:15', kind: 'task',  title: 'Pick up dry cleaning',           meta: 'On the way home · 15 min' },
  ];

  return (
    <MacFrame width={W} height={H} title="To Do" sidebar={<StandardSidebar accent={accent} active="today" />}>
      <div style={{ padding: '14px 22px 8px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <div style={{ fontFamily: WF.hand, fontSize: 26, fontWeight: 700, color: WF.ink }}>Today</div>
        <div style={{ fontFamily: WF.mono, fontSize: 12, color: WF.muted }}>Tue · May 19</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: WF.mono, fontSize: 11, color: WF.muted }}>6 tasks · 3h 10m free</div>
      </div>

      <div style={{ margin: '0 22px 10px', position: 'relative' }}>
        <Wobble w={W - 180 - 44} h={70} r={10} stroke={accent} sw={1.4} fill="rgba(217,119,87,0.06)" />
        <div style={{ position: 'absolute', inset: 0, padding: '10px 14px', display: 'flex', gap: 12 }}>
          <div style={{ width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: WF.hand, fontSize: 18, color: accent }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontFamily: WF.hand, fontSize: 14, fontWeight: 700, color: WF.ink }}>Good morning, Daniel.</div>
              <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Apple Intelligence</div>
            </div>
            <div style={{ fontFamily: WF.hand, fontSize: 13, color: WF.ink2, lineHeight: 1.35, marginTop: 2 }}>
              You have <b>3 meetings</b> locked from Outlook. I slotted <b>4 todos</b> into your free windows — biggest block is 13:00–17:00 after lunch. <span style={{ color: accent }}>Pay rent</span> is due today; I put it first in the afternoon.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: 'center' }}>
            <MiniBtn label="Replan ↻" ghost />
            <MiniBtn label="Tweak" ghost />
          </div>
        </div>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 168px)', padding: '4px 0 60px' }}>
        {items.map((it, i) => <TimelineRow key={i} {...it} accent={accent} />)}
      </div>

      <PlusFab accent={accent} style={{ right: 22, bottom: 22 }} />

      {showNotes && (
        <>
          <Note top={84} right={210} rotate={4} w={150}>AI summary — tone of a calm assistant, not a chatbot</Note>
          <Note top={220} left={196} rotate={-3} w={140}>blue blocks = Outlook events, locked</Note>
          <Note bottom={70} left={196} rotate={3} w={150}>orange = AI slotted todos in free time, draggable</Note>
        </>
      )}
    </MacFrame>
  );
}

function TimelineRow({ time, kind, title, meta, lock, due, accent }) {
  const isEvent = kind === 'event';
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', padding: '0 22px' }}>
      <div style={{ width: 50, fontFamily: WF.mono, fontSize: 11, color: WF.muted, paddingTop: 8, flexShrink: 0 }}>{time}</div>
      <div style={{ width: 18, position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, borderLeft: `1px dashed ${WF.faint}` }} />
        <div style={{
          position: 'absolute', left: 4, top: 10, width: 8, height: 8, borderRadius: '50%',
          background: isEvent ? WF.cal : (due ? accent : '#fff'),
          border: `1.4px solid ${isEvent ? WF.cal : accent}`,
        }} />
      </div>
      <div style={{ flex: 1, padding: '6px 0 10px 4px' }}>
        <div style={{
          padding: '8px 12px',
          background: isEvent ? 'rgba(107,127,155,0.10)' : (due ? 'rgba(217,119,87,0.06)' : 'transparent'),
          border: isEvent ? 'none' : (due ? `1px dashed ${accent}` : 'none'),
          borderRadius: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isEvent
              ? <span style={{ fontFamily: WF.hand, fontSize: 14, color: WF.cal }}>{lock ? '🔒' : ''}</span>
              : <CheckCircle size={15} accent={accent} />}
            <div style={{
              fontFamily: WF.hand, fontSize: 14, color: isEvent ? WF.cal : WF.ink, flex: 1,
              fontWeight: due ? 700 : 400,
            }}>{title}</div>
            {due && <span style={{ fontFamily: WF.mono, fontSize: 10, color: accent, border: `1px dashed ${accent}`, padding: '1px 5px', borderRadius: 3 }}>DUE</span>}
          </div>
          <div style={{ fontFamily: WF.mono, fontSize: 10, color: isEvent ? WF.cal : WF.muted, marginTop: 2, marginLeft: 22 }}>{meta}</div>
        </div>
      </div>
    </div>
  );
}

// ─── A2 · Inbox ─────────────────────────────────────────────────
function A_Inbox({ accent, showNotes }) {
  return (
    <MacFrame width={W} height={H} title="To Do" sidebar={<StandardSidebar accent={accent} active="inbox" inboxCount={7} />}>
      <div style={{ padding: '14px 22px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{ fontFamily: WF.hand, fontSize: 26, fontWeight: 700, color: WF.ink }}>Inbox</div>
          <div style={{ fontFamily: WF.mono, fontSize: 12, color: WF.muted }}>7 to process</div>
          <div style={{ flex: 1 }} />
          <MiniBtn label="Process all ✦" accent={accent} primary />
        </div>
        <div style={{ fontFamily: WF.hand, fontSize: 14, color: WF.muted, marginTop: 4 }}>
          Quick captures from today. Add project, due date, reminder — then they move into your plan.
        </div>
      </div>

      <div style={{ margin: '6px 22px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 6, background: WF.faint2, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '28%', background: accent, borderRadius: 3 }} />
        </div>
        <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted }}>2 / 7 sorted</div>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: 'calc(100% - 130px)', padding: '0 22px 40px' }}>
        <InboxItem accent={accent} text="Book flight to Berlin for design summit" captured="captured 11:14 · iPhone" expanded
          fields={{ project: 'Work', due: 'Mon · Jun 2', reminder: '1 day before', est: '30 min' }} />
        <InboxItem accent={accent} text="Call dentist about Saturday" captured="captured 10:02" needsReview />
        <InboxItem accent={accent} text="Buy birthday card for mom" captured="captured 09:48" needsReview />
        <InboxItem accent={accent} text="Renew gym membership" captured="captured Mon · 18:30" needsReview />
        <InboxItem accent={accent} text="Email Lars re: contract draft" captured="captured 08:30" sorted project="Work" due="Wed" />
        <InboxItem accent={accent} text="Pick up package from neighbour" captured="captured Mon · 14:10" sorted project="Home" due="Tomorrow" />
      </div>

      {showNotes && (
        <>
          <Note top={70} right={32} rotate={-5} w={150}>"Process all" → AI guesses fields, you review fast</Note>
          <Note top={210} right={28} rotate={4} w={130}>tap any chip to edit inline</Note>
          <Note bottom={60} left={196} rotate={-4} w={140}>sorted rows dim — visual progress signal</Note>
        </>
      )}
    </MacFrame>
  );
}

function InboxItem({ text, captured, accent, expanded, needsReview, sorted, fields, project, due }) {
  const cardW = W - 180 - 44;
  return (
    <div style={{ position: 'relative', marginBottom: 8, opacity: sorted ? 0.45 : 1 }}>
      <Wobble w={cardW} h={expanded ? 138 : 50} r={8}
        stroke={expanded ? accent : (sorted ? WF.faint : WF.ink2)}
        sw={expanded ? 1.5 : 1.2}
        fill={expanded ? '#fff' : (sorted ? 'transparent' : '#fff')} />
      <div style={{ position: 'absolute', inset: 0, padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <CheckCircle size={16} accent={accent} checked={sorted} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: WF.hand, fontSize: 15, color: WF.ink, lineHeight: 1.2 }}>{text}</div>
            <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, marginTop: 2 }}>{captured}</div>
          </div>
          {needsReview && (
            <span style={{
              fontFamily: WF.mono, fontSize: 9, color: accent,
              border: `1px dashed ${accent}`, padding: '2px 6px', borderRadius: 3,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>needs sort</span>
          )}
          {sorted && <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted }}>{project} · {due}</span>}
        </div>

        {expanded && (
          <div style={{ marginTop: 14, marginLeft: 26, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FieldChip label="Project"   value={fields.project}  accent={accent} />
            <FieldChip label="Due date"  value={fields.due}      accent={accent} />
            <FieldChip label="Remind"    value={fields.reminder} accent={accent} />
            <FieldChip label="Est. time" value={fields.est}      accent={accent} />
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <MiniBtn label="Save & next →" accent={accent} primary />
              <MiniBtn label="Skip" />
              <MiniBtn label="Delete" />
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, alignSelf: 'center' }}>⌘↵ to save</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldChip({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, width: 70, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ position: 'relative', padding: '3px 12px', display: 'inline-flex', alignItems: 'center' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 22" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }} aria-hidden>
          <rect x="1" y="1" width="98" height="20" rx="10" fill="rgba(217,119,87,0.08)" stroke={accent} strokeWidth="1" strokeDasharray="2 1.5" />
        </svg>
        <span style={{ position: 'relative', fontFamily: WF.hand, fontSize: 13, color: accent }}>{value}</span>
      </div>
    </div>
  );
}

// ─── A3 · Task detail ───────────────────────────────────────────
function A_Detail({ accent, showNotes }) {
  return (
    <MacFrame width={W} height={H} title="To Do" sidebar={<StandardSidebar accent={accent} active="today" />}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1, opacity: 0.4, overflow: 'hidden' }}>
          <div style={{ padding: '14px 22px 8px', fontFamily: WF.hand, fontSize: 24, fontWeight: 700 }}>Today</div>
          <TaskRow text="Stand-up · Design crew"  time="09:00" accent={accent} dense est="30m" />
          <TaskRow text="Reply to Naomi's review" time="09:30" accent={accent} dense est="20m" />
          <div style={{ margin: '0 12px', padding: '11px 14px', background: '#fff', boxShadow: `0 0 0 1.5px ${accent}` }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <CheckCircle size={17} accent={accent} />
              <div style={{ fontFamily: WF.hand, fontSize: 15, color: WF.ink, fontWeight: 700 }}>Pay rent</div>
            </div>
          </div>
          <TaskRow text="Pick up dry cleaning" accent={accent} dense est="15m" />
        </div>

        <div style={{ width: 280, borderLeft: `1px dashed ${WF.faint}`, background: WF.paper, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} accent={accent} />
            <div style={{ fontFamily: WF.hand, fontSize: 19, fontWeight: 700, color: WF.ink, flex: 1 }}>Pay rent</div>
            <span style={{ fontFamily: WF.hand, fontSize: 18, color: WF.muted }}>×</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Field label="Project"    value="Personal" />
            <Field label="Due"        value="Today · 17:00" accent={accent} />
            <Field label="Est. time"  value="5 min" />
            <Field label="Remind"     value="1 hr before · 16:00" />
            <Field label="Repeat"     value="Monthly · 1st" />
            <Field label="Tags"       value="#money  #recur" />
          </div>

          <div>
            <div style={{ fontFamily: WF.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: WF.muted, marginBottom: 6 }}>Notes</div>
            <Squiggle w={232} /><div style={{ height: 5 }} />
            <Squiggle w={210} /><div style={{ height: 5 }} />
            <Squiggle w={160} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <PillBtn label="Done"   accent={accent} primary />
            <PillBtn label="Delete" />
          </div>
        </div>
      </div>

      {showNotes && (
        <>
          <Note top={62} right={232} rotate={3} w={130}>est. time feeds the AI day plan</Note>
          <Note bottom={48} left={206} rotate={-4} w={140}>esc / click out closes panel</Note>
        </>
      )}
    </MacFrame>
  );
}

// ─── A4 · Empty / first run ─────────────────────────────────────
function A_Empty({ accent, showNotes }) {
  return (
    <MacFrame width={W} height={H} title="To Do" sidebar={<StandardSidebar accent={accent} active="today" inboxCount={0} counts={{ today: 0, upcoming: 0, someday: 0 }} />}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <svg width="160" height="90" viewBox="0 0 160 90" aria-hidden>
          <path d="M 20 60 Q 80 80 140 60" stroke={WF.muted} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M 20 60 L 30 35 Q 80 25 130 35 L 140 60" stroke={WF.ink2} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="25" r="2.5" fill={accent} opacity="0.7" />
        </svg>
        <div style={{ marginTop: 18, fontFamily: WF.hand, fontSize: 22, color: WF.ink }}>Nothing scheduled.</div>
        <div style={{ marginTop: 6, fontFamily: WF.hand, fontSize: 15, color: WF.muted, maxWidth: 380, lineHeight: 1.35 }}>
          Capture anything to your Inbox — I'll help slot it once your Outlook calendar is connected.
        </div>

        <div style={{ marginTop: 22, position: 'relative', width: 420 }}>
          <Wobble w={420} h={44} r={22} stroke={accent} sw={1.6} fill="#fff" />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
            <span style={{ fontFamily: WF.hand, fontSize: 20, color: accent }}>+</span>
            <span style={{ fontFamily: WF.hand, fontSize: 15, color: WF.muted, flex: 1 }}>
              Try: <span style={{ color: WF.ink2, fontFamily: WF.mono, fontSize: 13 }}>pay rent fri 5pm</span>
            </span>
            <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, border: `1px dashed ${WF.faint}`, padding: '1px 6px', borderRadius: 4 }}>⌘N</span>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          <MiniBtn label="Connect Outlook" accent={accent} primary />
          <MiniBtn label="Skip for now" ghost />
        </div>
      </div>

      {showNotes && <Note top={70} right={32} rotate={-4} w={150}>onboarding asks for calendar perms early — AI needs it</Note>}
    </MacFrame>
  );
}

// ─── A5 · Notification (stack + full snooze) ────────────────────
function A_Notification({ accent, showNotes }) {
  return (
    <div style={{
      width: W, height: H, background: '#cdd6e0',
      position: 'relative', overflow: 'hidden', fontFamily: WF.hand,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 22, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 14, fontFamily: WF.mono, fontSize: 11, color: WF.ink2 }}>
        <span style={{ fontWeight: 700 }}></span>
        <span>To Do</span>
        <span style={{ color: WF.muted }}>File</span>
        <span style={{ color: WF.muted }}>Edit</span>
        <div style={{ flex: 1 }} />
        <span>Tue 13:59</span>
      </div>

      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.18 }} aria-hidden>
        <path d="M 0 400 Q 200 340 400 380 T 780 360" stroke="#fff" strokeWidth="2" fill="none" />
        <path d="M 0 440 Q 200 400 400 430 T 780 420" stroke="#fff" strokeWidth="2" fill="none" />
      </svg>

      <div style={{ position: 'absolute', top: 38, right: 32, fontFamily: WF.mono, fontSize: 10, color: WF.ink2, background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: 8 }}>
        3 reminders ▾
      </div>

      <NotifCard accent={accent} top={156} right={84} scale={0.9} dim title="Email Lars re: contract" meta="overdue 2h · Work" emoji="📧" rotate={2} />
      <NotifCard accent={accent} top={114} right={58} scale={0.95} dim title="Call dentist about Saturday" meta="due 14:00 · Personal" emoji="📞" rotate={-1} />

      <div style={{ position: 'absolute', top: 60, right: 32, width: 340, height: 108, zIndex: 3 }}>
        <Wobble w={340} h={108} r={14} stroke={accent} sw={1.7} fill={WF.paper} />
        <div style={{ position: 'absolute', inset: 0, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <div style={{ fontFamily: WF.hand, fontWeight: 700, fontSize: 13, color: accent }}>✓ To Do · Reminder</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted }}>now</div>
            <span style={{ fontFamily: WF.hand, fontSize: 16, color: WF.muted, marginLeft: 4 }}>×</span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: WF.hand, fontSize: 16, color: accent, marginTop: 2 }}>🔔</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: WF.hand, fontSize: 16, fontWeight: 700, color: WF.ink, lineHeight: 1.15 }}>Pay rent</div>
              <div style={{ fontFamily: WF.mono, fontSize: 11, color: WF.muted, marginTop: 2 }}>due in 1 hour · 14:00 · Personal</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <MiniBtn label="Mark done" accent={accent} primary />
            <MiniBtn label="Open" />
            <div style={{ flex: 1 }} />
            <MiniBtn label="Snooze ▾" accent={accent} />
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 174, right: 32, width: 204, zIndex: 4 }}>
        <Wobble w={204} h={240} r={10} stroke={WF.ink2} sw={1.5} fill="#fff" />
        <div style={{ position: 'absolute', inset: 0, padding: '8px 6px' }}>
          <div style={{ fontFamily: WF.mono, fontSize: 9, color: WF.muted, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 10px 6px' }}>Remind again in…</div>
          {[
            { label: '15 minutes' },
            { label: '30 minutes' },
            { label: '1 hour', active: true },
            { label: '2 hours' },
            { label: '4 hours' },
            { label: '1 day' },
            { label: '2 days' },
          ].map((s) => (
            <div key={s.label} style={{
              padding: '5px 10px', fontFamily: WF.hand, fontSize: 13,
              color: s.active ? '#fff' : WF.ink2,
              background: s.active ? accent : 'transparent',
              borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              whiteSpace: 'nowrap',
            }}>
              <span>{s.label}</span>
              {s.active && <span style={{ fontFamily: WF.mono, fontSize: 10 }}>↵</span>}
            </div>
          ))}
          <div style={{ borderTop: `1px dashed ${WF.faint}`, margin: '4px 6px' }} />
          <div style={{ padding: '5px 10px', fontFamily: WF.hand, fontSize: 13, color: WF.muted, whiteSpace: 'nowrap' }}>Pick a time…</div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 280, height: 44 }}>
        <Wobble w={280} h={44} r={14} stroke="rgba(255,255,255,0.8)" sw={1.4} fill="rgba(255,255,255,0.4)" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: 6,
              background: i === 3 ? accent : 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.1)', position: 'relative',
            }}>
              {i === 3 && (
                <div style={{
                  position: 'absolute', top: -4, right: -4, width: 14, height: 14,
                  borderRadius: '50%', background: '#e34a4a', color: '#fff',
                  fontFamily: WF.mono, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>3</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showNotes && (
        <>
          <Note top={48} left={16}  rotate={-4} w={150}>stack: each reminder = own card, task title obvious</Note>
          <Note top={200} left={16} rotate={3}  w={150}>menu opens from button — same 7 presets + custom</Note>
          <Note bottom={70} left={16} rotate={-3} w={130}>dock badge = unresolved count</Note>
        </>
      )}
    </div>
  );
}

function NotifCard({ accent, top, right, scale, dim, title, meta, emoji, rotate = 0 }) {
  return (
    <div style={{ position: 'absolute', top, right, width: 340, transform: `scale(${scale}) rotate(${rotate}deg)`, transformOrigin: 'top right', opacity: dim ? 0.85 : 1, zIndex: 2 }}>
      <Wobble w={340} h={70} r={14} stroke={WF.ink2} sw={1.4} fill={WF.paper} />
      <div style={{ position: 'absolute', inset: 0, padding: '10px 14px', display: 'flex', gap: 10 }}>
        <div style={{ fontFamily: WF.hand, fontSize: 18, marginTop: 2 }}>{emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: WF.hand, fontWeight: 700, fontSize: 12, color: accent }}>To Do</span>
            <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, flex: 1 }}>· reminder</span>
          </div>
          <div style={{ fontFamily: WF.hand, fontSize: 14, color: WF.ink, fontWeight: 700, marginTop: 1 }}>{title}</div>
          <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, marginTop: 1 }}>{meta}</div>
        </div>
      </div>
    </div>
  );
}

// ─── A6 · Quick capture ─────────────────────────────────────────
function A_QuickCapture({ accent, showNotes }) {
  return (
    <MacFrame width={W} height={H} title="To Do" sidebar={<StandardSidebar accent={accent} active="today" inboxCount={8} />}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
        <div style={{ padding: '14px 22px 8px', fontFamily: WF.hand, fontSize: 24, fontWeight: 700 }}>Today</div>
        <TaskRow text="Stand-up · Design crew" time="09:00" accent={accent} est="30m" />
        <TaskRow text="Reply to Naomi's review" time="09:30" accent={accent} est="20m" />
        <TaskRow text="Draft Q3 OKRs" time="11:00" accent={accent} est="45m" />
        <TaskRow text="Pay rent" time="14:00" accent={accent} est="5m" />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,14,0.18)' }} />

      <div style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', width: 480, height: 170 }}>
        <Wobble w={480} h={170} r={14} stroke={accent} sw={1.7} fill="#fff" />
        <div style={{ position: 'absolute', inset: 0, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, whiteSpace: 'nowrap', flexWrap: 'nowrap' }}>
            <span style={{ fontFamily: WF.hand, fontSize: 13, color: WF.muted }}>Capture to</span>
            <span style={{
              fontFamily: WF.hand, fontSize: 13, color: accent,
              padding: '1px 8px', border: `1px dashed ${accent}`, borderRadius: 10,
            }}>📥 Inbox</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, border: `1px dashed ${WF.faint}`, padding: '1px 6px', borderRadius: 3 }}>⌃⌥ Space</span>
          </div>

          <div style={{ position: 'relative', height: 38, marginBottom: 10 }}>
            <Wobble w={440} h={38} r={8} stroke={WF.faint} sw={1.2} fill={WF.paper} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 12px', fontFamily: WF.hand, fontSize: 16, color: WF.ink, whiteSpace: 'nowrap' }}>
              Call dentist about Saturday<span style={{ borderLeft: `1.5px solid ${accent}`, height: 18, marginLeft: 2 }} />
            </div>
          </div>

          <div style={{ fontFamily: WF.hand, fontSize: 13, color: WF.muted, lineHeight: 1.35 }}>
            Don't worry about details now — sort it tonight in your Inbox.
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <MiniBtn label="Save to Inbox" accent={accent} primary />
            <MiniBtn label="+ details…" />
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, alignSelf: 'center' }}>↵ save · esc cancel</span>
          </div>
        </div>
      </div>

      {showNotes && (
        <>
          <Note top={80} right={28} rotate={4} w={150}>global hotkey, works from anywhere</Note>
          <Note bottom={50} left={196} rotate={-3} w={150}>defaults to Inbox · "+ details" expands fields</Note>
        </>
      )}
    </MacFrame>
  );
}

// ─── Flow diagram ───────────────────────────────────────────────
function FlowStep({ time, emoji, title, body, accent, highlight }) {
  return (
    <div style={{ flex: 1, position: 'relative', minHeight: 170 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <rect x="1" y="1" width="98" height="98" rx="10"
          fill={highlight ? 'rgba(217,119,87,0.06)' : '#fff'}
          stroke={highlight ? accent : WF.ink2}
          strokeWidth="1.4" strokeDasharray="2 1.5" />
      </svg>
      <div style={{ position: 'relative', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 6, height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: WF.mono, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: WF.muted }}>{time}</div>
        <div style={{ fontFamily: WF.hand, fontSize: 22 }}>{emoji}</div>
        <div style={{ fontFamily: WF.hand, fontSize: 15, fontWeight: 700, color: highlight ? accent : WF.ink }}>{title}</div>
        <div style={{ fontFamily: WF.hand, fontSize: 13, color: WF.ink2, lineHeight: 1.3 }}>{body}</div>
      </div>
    </div>
  );
}

function FlowDiagram({ accent }) {
  return (
    <div style={{ padding: 24, fontFamily: WF.hand, background: WF.paper, height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: WF.ink, marginBottom: 4 }}>The daily loop</div>
      <div style={{ fontSize: 14, color: WF.ink2, marginBottom: 24, lineHeight: 1.4 }}>
        Capture fast all day → process at night → AI plans tomorrow morning → reminders nudge through the day.
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        <FlowStep accent={accent} time="During day" emoji="⚡" title="Quick capture" body="⌃⌥ Space → text only → Inbox" />
        <div style={{ display: 'flex', alignItems: 'center', color: WF.muted, fontFamily: WF.hand, fontSize: 22 }}>→</div>
        <FlowStep accent={accent} time="Evening" emoji="📥" title="Process Inbox" body="Add project, due, est. time, reminder" highlight />
        <div style={{ display: 'flex', alignItems: 'center', color: WF.muted, fontFamily: WF.hand, fontSize: 22 }}>→</div>
        <FlowStep accent={accent} time="Morning" emoji="✦" title="AI day plan" body="Outlook calendar + todos = timeline" />
        <div style={{ display: 'flex', alignItems: 'center', color: WF.muted, fontFamily: WF.hand, fontSize: 22 }}>→</div>
        <FlowStep accent={accent} time="Throughout" emoji="🔔" title="Reminders" body="Snooze 15m / 30m / 1h / 2h / 4h / 1d / 2d" />
      </div>

      <svg style={{ position: 'absolute', left: 24, right: 24, bottom: 60, width: 'calc(100% - 48px)', height: 60, pointerEvents: 'none' }} viewBox="0 0 800 60" preserveAspectRatio="none" aria-hidden>
        <defs>
          <marker id="flow-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M0,0 L8,4.5 L0,9 z" fill={accent} />
          </marker>
        </defs>
        <path d="M 750 8 Q 790 40 700 50 L 100 50 Q 10 50 50 8" stroke={accent} strokeWidth="1.4" fill="none" strokeDasharray="4 4" markerEnd="url(#flow-arrow)" />
        <text x="370" y="44" fontFamily={WF.scrip} fontSize="16" fill={accent}>repeat tomorrow</text>
      </svg>
    </div>
  );
}

// ─── Legend ──────────────────────────────────────────────────────
function Legend({ accent }) {
  return (
    <div style={{ padding: 24, fontFamily: WF.hand, color: WF.ink, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10, background: WF.paper }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>To Do · macOS · v2</div>
      <div style={{ fontSize: 14, color: WF.ink2, lineHeight: 1.45 }}>
        Personal assistant for your day. AI-generated plan from Outlook + your todos. Capture in seconds, sort once a day, never lose anything.
      </div>

      <div style={{ marginTop: 6, fontFamily: WF.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: WF.muted }}>New in this version</div>
      <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 13.5, lineHeight: 1.5, color: WF.ink2 }}>
        <li><b>Inbox</b> top of sidebar with count badge</li>
        <li><b>AI day plan</b> timeline = Outlook events + free-time todos</li>
        <li><b>Est. time</b> field on every task → feeds the planner</li>
        <li><b>Reminder snooze</b>: 15m · 30m · 1h · 2h · 4h · 1d · 2d · custom</li>
        <li><b>Stacked reminders</b>, each clearly tagged with its task</li>
        <li><b>Quick capture</b> via global hotkey (⌃⌥ Space) → Inbox</li>
      </ul>

      <div style={{ marginTop: 10, fontFamily: WF.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: WF.muted }}>Legend</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: WF.ink2 }}>
        <LegRow swatch={<div style={{ width: 18, height: 14, borderRadius: 3, background: 'rgba(107,127,155,0.18)', border: `1px solid ${WF.cal}` }} />} label="Outlook event (locked)" />
        <LegRow swatch={<CheckCircle size={16} accent={accent} />} label="Task — movable, completable" />
        <LegRow swatch={<div style={{ fontFamily: WF.mono, fontSize: 10, color: accent, border: `1px dashed ${accent}`, padding: '1px 5px', borderRadius: 3 }}>DUE</div>} label="Due today — pinned first" />
        <LegRow swatch={<span style={{ fontFamily: WF.scrip, color: '#5a4a2a', background: '#fde68a', padding: '1px 6px' }}>note</span>} label="Sticky = design rationale" />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.muted, borderTop: `1px dashed ${WF.faint}`, paddingTop: 8 }}>
        Change accent + toggle notes in Tweaks ↘
      </div>
    </div>
  );
}

function LegRow({ swatch, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 80, display: 'flex' }}>{swatch}</div>
      <div>{label}</div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = t.accent;
  const showNotes = t.showNotes;

  return (
    <>
      <DesignCanvas>
        <DCSection id="intro" title="To Do · macOS · v2" subtitle="Direction A, expanded. AI day plan · Inbox flow · stacked reminders.">
          <DCArtboard id="legend" label="What's new" width={520} height={H}><Legend accent={accent} /></DCArtboard>
          <DCArtboard id="flow"   label="Daily loop · capture → process → plan → remind" width={W + 80} height={H}><FlowDiagram accent={accent} /></DCArtboard>
        </DCSection>

        <DCSection id="planner" title="Daily plan & inbox flow" subtitle="Morning: AI assembles your day. Evening: you process what landed in the inbox.">
          <DCArtboard id="today"   label="① Today — AI day plan (morning)" width={W} height={H}><A_Today accent={accent} showNotes={showNotes} /></DCArtboard>
          <DCArtboard id="capture" label="② Quick capture (anytime)"        width={W} height={H}><A_QuickCapture accent={accent} showNotes={showNotes} /></DCArtboard>
          <DCArtboard id="inbox"   label="③ Inbox processing (evening)"     width={W} height={H}><A_Inbox accent={accent} showNotes={showNotes} /></DCArtboard>
        </DCSection>

        <DCSection id="task" title="Task & reminders" subtitle="Editing a single task, and how reminders surface through the day.">
          <DCArtboard id="detail" label="Task detail (side pane)"            width={W} height={H}><A_Detail accent={accent} showNotes={showNotes} /></DCArtboard>
          <DCArtboard id="notif"  label="Notification · stack + snooze menu" width={W} height={H}><A_Notification accent={accent} showNotes={showNotes} /></DCArtboard>
          <DCArtboard id="empty"  label="Empty / first-run state"            width={W} height={H}><A_Empty accent={accent} showNotes={showNotes} /></DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Look" />
        <TweakColor label="Accent" value={accent}
          options={['#d97757', '#3d7eb5', '#1f8a5b', '#7a5ae0', '#1a1a1a']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakToggle label="Show annotations" value={showNotes}
          onChange={(v) => setTweak('showNotes', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
