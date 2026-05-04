// pages/accueil.jsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  IconKanban, IconUsers, IconZap, IconShield, IconBarChart,
  IconCheckCircle, IconArrowRight, IconSparkle, IconGlobe,
  IconMessageSquare, IconTag, IconCalendar, IconActivity,
  IconLayers, IconCommand, IconTrendingUp, IconClock,
  IconX, IconMenu,
} from '../components/ui/Icons';

const FEATURES = [
  { Icon: IconKanban,  title: 'Tableaux Kanban',       desc: "Visualisez l'avancement en temps réel. Déplacez vos tâches entre À faire, En cours et Terminé.", color: '#7c3aed' },
  { Icon: IconUsers,   title: 'Collaboration',          desc: "Invitez vos collègues, assignez des tâches et commentez directement sur les cartes.",             color: '#06b6d4' },
  { Icon: IconTag,     title: 'Étiquettes & Priorités', desc: "Organisez avec des labels colorés et des priorités : Faible, Moyenne, Haute, Urgent.",            color: '#10b981' },
  { Icon: IconCalendar,title: 'Gestion des délais',     desc: "Définissez des deadlines et recevez des alertes visuelles avant expiration.",                      color: '#f97316' },
  { Icon: IconActivity,title: "Flux d'activité",        desc: "Suivez chaque action : déplacements, assignations, commentaires — tout est tracé.",                color: '#a78bfa' },
  { Icon: IconShield,  title: 'Accès sécurisé',         desc: "Contrôle des droits par workspace : Admin, Membre. Vos données restent privées.",                  color: '#ef4444' },
];

const HOW_IT_WORKS = [
  { step: '01', Icon: IconLayers,  title: 'Créez un espace de travail', desc: "Un workspace par projet ou par équipe. Structurez vos activités dès le départ." },
  { step: '02', Icon: IconKanban,  title: 'Ajoutez des tableaux',       desc: "Créez autant de tableaux Kanban que nécessaire dans chaque workspace." },
  { step: '03', Icon: IconUsers,   title: 'Invitez votre équipe',       desc: "Partagez l'accès avec vos collaborateurs via leur adresse email." },
  { step: '04', Icon: IconZap,     title: 'Livrez plus vite',           desc: "Assignez, commentez, suivez la progression et terminez vos projets." },
];

const STATS = [
  { value: '10x',    label: 'Plus de clarté',      Icon: IconTrendingUp },
  { value: '< 2min', label: 'Pour démarrer',       Icon: IconClock },
  { value: '100%',   label: 'Sécurisé',            Icon: IconShield },
  { value: '∞',      label: 'Tâches & workspaces', Icon: IconLayers },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Chef de projet',   text: "Orbitask a transformé notre façon de travailler. La visibilité sur l'avancement est incomparable.", avatar: 'S' },
  { name: 'Karim B.', role: 'Lead développeur', text: "Simple, rapide, efficace. Les tableaux Kanban sont exactement ce qu'il nous fallait.", avatar: 'K' },
  { name: 'Léa D.',   role: 'Designer UX',      text: "L'interface est claire et les étiquettes colorées rendent le tri des tâches vraiment intuitif.", avatar: 'L' },
];

const NAV_SECTIONS = [
  { id: 'fonctionnalites',   label: 'Fonctionnalités' },
  { id: 'comment-ca-marche', label: 'Comment ça marche' },
  { id: 'temoignages',       label: 'Témoignages' },
  { id: 'securite',          label: 'Sécurité' },
];

function useIntersection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SectionBadge({ Icon, label, color }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: color + '18', border: `1px solid ${color}30`, borderRadius: '100px', padding: '5px 14px', marginBottom: '16px' }}>
      <Icon size={13} color={color} />
      <span style={{ fontSize: '12px', color, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

export default function Accueil() {
  const [visible, setVisible]         = useState(false);
  const [typed, setTyped]             = useState('');
  const [showSub, setShowSub]         = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [mobileMenu, setMobileMenu]   = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const statsRef     = useRef(null);
  const statsVisible = useIntersection(statsRef);
  const FULL = 'Orbitask';

  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i < FULL.length) { setTyped(FULL.slice(0, i + 1)); i++; }
      else { clearInterval(iv); setTimeout(() => setShowSub(true), 250); }
    }, 100);
    return () => clearInterval(iv);
  }, [visible]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ background: '#0a0a14', color: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ── Navbar publique ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '60px',
        background: scrolled ? 'rgba(10,10,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'all 0.3s', display: 'flex', alignItems: 'center', padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <IconKanban size={20} color="#7c3aed" />
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#a78bfa', letterSpacing: '-0.5px' }}>Orbitask</span>
          </div>

          {/* Section links — centré */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {NAV_SECTIONS.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#9090b8',
                fontSize: '14px', fontWeight: 500, padding: '7px 14px', borderRadius: '8px',
                transition: 'color 0.15s, background 0.15s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e2e2f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#9090b8'; e.currentTarget.style.background = 'none'; }}
              >{label}</button>
            ))}
          </div>

          {/* Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link to="/login" style={{ fontSize: '14px', fontWeight: 500, color: '#9090b8', textDecoration: 'none', padding: '7px 16px', borderRadius: '10px' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2e2f0'}
              onMouseLeave={e => e.currentTarget.style.color = '#9090b8'}
            >Connexion</Link>
            <Link to="/register" style={{
              fontSize: '14px', fontWeight: 600, color: '#fff', textDecoration: 'none',
              padding: '8px 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'none'; }}
            >Commencer</Link>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="mob-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9090b8', padding: '4px', display: 'none' }}>
              {mobileMenu ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenu && (
        <div style={{ position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99, background: '#0d0d1c', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 24px 16px', animation: 'slideInUp 0.2s ease' }}>
          {NAV_SECTIONS.map(({ id, label }) => (
            <button key={id} onClick={() => { scrollTo(id); setMobileMenu(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#c8c8e0', fontSize: '15px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{label}</button>
          ))}
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ textAlign: 'center', maxWidth: '760px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '36px', opacity: visible ? 1 : 0, transition: 'opacity 0.7s' }}>
            <IconSparkle size={14} color="#a78bfa" />
            <span style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 500 }}>Gestion de projet nouvelle génération</span>
          </div>

          <h1 style={{ fontSize: 'clamp(52px, 9vw, 88px)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 0.95, marginBottom: '28px', opacity: visible ? 1 : 0, transition: 'opacity 0.7s 0.15s' }}>
            <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{typed}</span>
            <span style={{ display: 'inline-block', width: '4px', height: '0.8em', background: '#7c3aed', marginLeft: '4px', verticalAlign: 'text-bottom', animation: 'pulse-soft 1s ease-in-out infinite' }} />
          </h1>

          <p style={{ fontSize: 'clamp(17px, 2.5vw, 21px)', color: '#7070a0', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto 48px', opacity: showSub ? 1 : 0, transition: 'opacity 0.6s' }}>
            Organisez vos projets, collaborez avec votre équipe et livrez plus vite — le tout dans une interface élégante et intuitive.
          </p>

          {showSub && (
            <div style={{ animation: 'slideInUp 0.5s ease both' }}>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', textDecoration: 'none', padding: '15px 32px', borderRadius: '14px', fontWeight: 700, fontSize: '16px', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(124,58,237,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.4)'; }}
                >Commencer gratuitement <IconArrowRight size={18} /></Link>
                <button onClick={() => scrollTo('fonctionnalites')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#c8c8e0', padding: '15px 32px', borderRadius: '14px', fontWeight: 500, fontSize: '16px', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >Découvrir les fonctionnalités</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex' }}>
                  {['A','B','C','D'].map((l, i) => (
                    <div key={l} style={{ width: '32px', height: '32px', borderRadius: '50%', marginLeft: i > 0 ? '-10px' : '0', background: ['#7c3aed','#06b6d4','#10b981','#f97316'][i], border: '2px solid #0a0a14', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{l}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}
                </div>
                <span style={{ fontSize: '13px', color: '#6b6b8a' }}>Rejoint par des équipes professionnelles</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
            {STATS.map(({ value, label, Icon }, i) => (
              <div key={label} style={{ background: '#0d0d1c', padding: '32px 24px', textAlign: 'center', opacity: statsVisible ? 1 : 0, transform: statsVisible ? 'none' : 'translateY(20px)', transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><Icon size={24} color="#7c3aed" /></div>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '4px' }}>{value}</p>
                <p style={{ fontSize: '13px', color: '#5a5a80' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section id="fonctionnalites" style={{ padding: '80px 24px 100px', background: '#0d0d1c', scrollMarginTop: '60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <SectionBadge Icon={IconCommand} label="Fonctionnalités" color="#06b6d4" />
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>Tout ce dont votre équipe a besoin</h2>
          <p style={{ fontSize: '17px', color: '#6b6b8a', maxWidth: '480px', lineHeight: 1.6, marginBottom: '48px' }}>Une plateforme complète pour gérer vos projets de bout en bout, sans complexité.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {FEATURES.map(({ Icon, title, desc, color }) => (
              <div key={title} onMouseEnter={() => setHoveredCard(title)} onMouseLeave={() => setHoveredCard(null)} style={{ background: hoveredCard === title ? '#181828' : '#131320', border: `1px solid ${hoveredCard === title ? color + '40' : 'rgba(255,255,255,0.06)'}`, borderRadius: '18px', padding: '28px', transform: hoveredCard === title ? 'translateY(-4px)' : 'none', boxShadow: hoveredCard === title ? '0 20px 48px rgba(0,0,0,0.3)' : 'none', transition: 'all 0.25s' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: color + '18', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e2f0', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: '#5a5a80', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="comment-ca-marche" style={{ padding: '100px 24px', background: '#0a0a14', scrollMarginTop: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionBadge Icon={IconZap} label="En 4 étapes" color="#a78bfa" />
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '48px' }}>Opérationnel en 2 minutes</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {HOW_IT_WORKS.map(({ step, Icon, title, desc }, i) => (
              <div key={step} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color="#a78bfa" />
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && <div style={{ width: '1px', background: 'linear-gradient(to bottom, rgba(124,58,237,0.3), transparent)', minHeight: '40px', margin: '4px 0' }} />}
                </div>
                <div style={{ paddingBottom: i < HOW_IT_WORKS.length - 1 ? '32px' : 0 }}>
                  <span style={{ fontSize: '11px', color: '#4a4a6a', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Étape {step}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e2f0', margin: '6px 0 8px' }}>{title}</h3>
                  <p style={{ fontSize: '15px', color: '#5a5a80', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ── */}
      <section id="temoignages" style={{ padding: '100px 24px', background: '#0d0d1c', scrollMarginTop: '60px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionBadge Icon={IconMessageSquare} label="Témoignages" color="#10b981" />
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '48px' }}>Ce que disent nos utilisateurs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {TESTIMONIALS.map(({ name, role, text, avatar }) => (
              <div key={name} style={{ background: '#131320', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '28px' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                  {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}
                </div>
                <p style={{ fontSize: '15px', color: '#9090b8', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{avatar}</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#e2e2f0' }}>{name}</p>
                    <p style={{ fontSize: '12px', color: '#4a4a6a' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sécurité ── */}
      <section id="securite" style={{ padding: '100px 24px', background: '#0a0a14', scrollMarginTop: '60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '64px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 340px' }}>
            <SectionBadge Icon={IconShield} label="Sécurité" color="#ef4444" />
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.2 }}>Vos données sont en sécurité</h2>
            <p style={{ fontSize: '16px', color: '#5a5a80', lineHeight: 1.7 }}>Authentification JWT sécurisée, contrôle des accès par rôles, et protection contre les attaques les plus courantes.</p>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { Icon: IconShield,      text: 'Authentification JWT + cookies httpOnly' },
              { Icon: IconCheckCircle, text: "Contrôle d'accès par rôle (Admin / Membre)" },
              { Icon: IconGlobe,       text: 'CORS configuré et sécurisé' },
              { Icon: IconBarChart,    text: 'Rate limiting sur les routes sensibles' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: '#0d0d1c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                <Icon size={18} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#9090b8' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section style={{ padding: '100px 24px 120px', background: '#0d0d1c' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '20px', lineHeight: 1.1 }}>
              Prêt à transformer<br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>votre façon de travailler ?</span>
            </h2>
            <p style={{ fontSize: '17px', color: '#6b6b8a', marginBottom: '40px', lineHeight: 1.6 }}>Créez votre compte gratuitement et démarrez votre premier tableau Kanban en moins de 2 minutes.</p>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', textDecoration: 'none', padding: '16px 36px', borderRadius: '14px', fontWeight: 700, fontSize: '16px', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(124,58,237,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.4)'; }}
            >Créer mon compte — c'est gratuit <IconArrowRight size={18} /></Link>
            <p style={{ fontSize: '13px', color: '#3d3d5a', marginTop: '20px' }}>Aucune carte bancaire requise · Accès immédiat</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconKanban size={20} color="#7c3aed" />
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#a78bfa', letterSpacing: '-0.5px' }}>Orbitask</span>
          </div>
          <p style={{ fontSize: '13px', color: '#3d3d5a' }}>© 2026 Orbitask — Plateforme de gestion de projet collaborative</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/login"    style={{ fontSize: '13px', color: '#4a4a6a', textDecoration: 'none' }}>Connexion</Link>
            <Link to="/register" style={{ fontSize: '13px', color: '#4a4a6a', textDecoration: 'none' }}>S'inscrire</Link>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          nav > div > div[style*="position: absolute"] { display: none !important; }
          .mob-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}