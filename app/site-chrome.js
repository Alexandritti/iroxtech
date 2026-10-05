'use client';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {useState} from 'react';
import {LANGS,legalPath} from './copy';

const navHref = ['#solutions', '#process', '#economics', '#contact'];

export function Logo({href = '#'}) {
  return (
    <a className="logo" href={href} aria-label="IROX">
      <svg width="28" height="16" viewBox="0 0 28 16" aria-hidden="true">
        <path d="M1 1.5h7M1 1.5v13M1 14.5h7M27 1.5h-7M27 1.5v13M27 14.5h-7M11.5 8h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square"/>
      </svg>
      <b>IROX</b>
    </a>
  );
}

export function LangSwitch({lang, setLang, hrefs}) {
  return (
    <div className="langs" role="group" aria-label="Language">
      {LANGS.map(([id, label]) => hrefs ? (
        <a key={id} href={hrefs[id]} className={lang === id ? 'on' : ''} aria-current={lang === id ? 'page' : undefined}>{label}</a>
      ) : (
        <button key={id} type="button" className={lang === id ? 'on' : ''} aria-pressed={lang === id} onClick={() => setLang(id)}>{label}</button>
      ))}
    </div>
  );
}

export function SiteHeader({t, lang, setLang, hrefs, home = ''}) {
  const [open, setOpen] = useState(false);
  const hash = (id) => (home ? `${home}${id}` : id);
  return (
    <header>
      <Logo href={home || '#'}/>
      <nav className={open ? 'open' : ''}>
        {t.nav.map((label, i) => <a key={navHref[i]} href={hash(navHref[i])} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="headerTools">
        <LangSwitch lang={lang} setLang={setLang} hrefs={hrefs}/>
        <a className="headerCta" href={hash('#lead')}>{t.cta} <ArrowUpRight size={16}/></a>
      </div>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X/> : <Menu/>}</button>
    </header>
  );
}

export function SiteFooter({t, lang, logoHref = '#'}) {
  return (
    <footer id="contact">
      <Logo href={logoHref}/>
      <div>
        <b>PALLET · WELD · MOVE · VISION</b>
        <p>{t.footer}</p>
        <p className="legalLinks">
          <a href={legalPath(lang, 'privacy')}>{t.legalPrivacy}</a>
          <a href={legalPath(lang, 'consent')}>{t.legalConsent}</a>
        </p>
      </div>
      <div className="footerRight"><a href="mailto:hello@iroxtech.ru">hello@iroxtech.ru</a><span>© 2026 IROX</span></div>
    </footer>
  );
}
