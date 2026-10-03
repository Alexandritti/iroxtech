'use client';
import {ArrowUpRight,Upload,Menu,X,ScanLine,Bot,Truck,Flame,ChevronRight} from 'lucide-react';
import {Fragment,useEffect,useState} from 'react';
import {LANGS,copy,solutionMeta,stepMeta,metrics} from './copy';

const LEAD_URL = 'https://functions.yandexcloud.net/d4ephi82ae2rlm51rgco';
const icons = [Bot, Flame, Truck, ScanLine];
const navHref = ['#solutions', '#process', '#economics', '#contact'];

function Logo() {
  return (
    <a className="logo" href="#" aria-label="IROX">
      <svg width="28" height="16" viewBox="0 0 28 16" aria-hidden="true">
        <path d="M1 1.5h7M1 1.5v13M1 14.5h7M27 1.5h-7M27 1.5v13M27 14.5h-7M11.5 8h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square"/>
      </svg>
      <b>IROX</b>
    </a>
  );
}

function LangSwitch({lang, setLang}) {
  return (
    <div className="langs" role="group" aria-label="Language">
      {LANGS.map(([id, label]) => (
        <button key={id} type="button" className={lang === id ? 'on' : ''} aria-pressed={lang === id} onClick={() => setLang(id)}>{label}</button>
      ))}
    </div>
  );
}

function Title({lines}) {
  return (
    <h2>
      {lines.before.map((line) => <Fragment key={line}>{line}<br/></Fragment>)}
      <span>{lines.accent}</span>
      {lines.after.map((line) => <Fragment key={line}><br/>{line}</Fragment>)}
    </h2>
  );
}

export default function Home() {
  const [lang, setLang] = useState('ru');
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState('idle');
  const [video, setVideo] = useState(false);
  const t = copy[lang];

  useEffect(() => {
    const saved = localStorage.getItem('irox-lang');
    if (saved === 'en' || saved === 'zh' || saved === 'ru') setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
    localStorage.setItem('irox-lang', lang);
  }, [lang]);

  return (
    <main>
      <header>
        <Logo/>
        <nav className={open ? 'open' : ''}>
          {t.nav.map((label, i) => <a key={navHref[i]} href={navHref[i]} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
        <div className="headerTools">
          <LangSwitch lang={lang} setLang={setLang}/>
          <a className="headerCta" href="#lead">{t.cta} <ArrowUpRight size={16}/></a>
        </div>
        <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X/> : <Menu/>}</button>
      </header>

      <section className="hero">
        <div className="gridbg"/>
        <div className="eyebrow">{t.kicker} <span>2026</span></div>
        <h1>
          {t.h1[0]}<br/>
          {t.h1[1]}<br/>
          <em>{t.h1[2][0]}</em>{t.h1[2][1]}
        </h1>
        <div className="heroBottom">
          <p>{t.heroLead}</p>
          <a className="primary" href="#lead"><span>{t.heroBtn[0]}</span><b>{t.heroBtn[1]}</b><ArrowUpRight/></a>
        </div>
        <div className="ticker"><span>PALLET</span><i/> <span>WELD</span><i/> <span>MOVE</span><i/> <span>VISION</span></div>
      </section>

      <section className="statement">
        <div className="sectionNo">01 / APPROACH</div>
        <h2>{t.statement[0]}<br/><span>{t.statement[1]}</span></h2>
        <div className="statementText">
          <p>{t.statementText}</p>
          <div className="flow">{t.flow[0]} <ChevronRight/> <strong>{t.flow[1]}</strong></div>
        </div>
      </section>

      <section id="solutions" className="solutions">
        <div className="sectionHead">
          <div className="sectionNo">02 / SOLUTIONS</div>
          <h2>{t.solutionsTitle[0]}<br/>{t.solutionsTitle[1]}</h2>
        </div>
        <div className="solutionGrid">
          {t.solutions.map(([title, text, tags], i) => {
            const Icon = icons[i];
            const [code, name] = solutionMeta[i];
            return (
              <article className="solution" key={name}>
                <div className="cardTop"><span>{code}</span><Icon size={32}/></div>
                <h3>IROX <b>{name}</b></h3>
                <h4>{title}</h4>
                <p>{text}</p>
                <div className="tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="process" className="process">
        <div className="sectionHead light">
          <div className="sectionNo">03 / FROM OPERATION TO AUTOMATION</div>
          <h2>{t.processTitle[0]}<br/>{t.processTitle[1]}</h2>
        </div>
        <div className="steps">
          {t.steps.map(([title, text], i) => (
            <div className="step" key={stepMeta[i]}>
              <div className="stepNum">0{i + 1}</div>
              <div><small>{stepMeta[i]}</small><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="economics" className="economics">
        <div className="sectionNo">04 / BUSINESS CASE</div>
        <div className="econGrid">
          <div><Title lines={t.econ}/></div>
          <div className="metrics">
            <p>{t.econText}</p>
            {metrics.map((key, i) => <div className="metric" key={key}><b>{key}</b><span>{t.metrics[i]}</span></div>)}
          </div>
        </div>
      </section>

      <section className="tech">
        <div className="sectionNo">05 / TECHNOLOGY</div>
        <h2>{t.tech.before}<br/><span>{t.tech.accent}</span></h2>
        <div className="techWords">{t.techWords.map((word) => <span key={word}>{word}</span>)}</div>
      </section>

      <section id="lead" className="lead">
        <div className="leadCopy">
          <div className="sectionNo">06 / START WITH A VIDEO</div>
          <h2>{t.leadTitle[0]}<br/>{t.leadTitle[1]}</h2>
          <h3>{t.leadSub}</h3>
          <p>{t.leadText}</p>
          <ol>{t.leadList.map((item) => <li key={item}>{item}</li>)}</ol>
        </div>
        <form method="post" action="#lead" onSubmit={async (e) => {
            e.preventDefault();
            if (lead === 'sending') return;
            const data = new FormData(e.currentTarget);
            const body = Object.fromEntries(['name', 'company', 'contact', 'email', 'about'].map((key) => [key, data.get(key) || '']));
            setLead('sending');
            try {
              const res = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
              setLead(res.ok ? 'ok' : 'error');
            } catch {
              setLead('error');
            }
          }}>
          {t.fields.map(([label, placeholder, type, name]) => (
            <label key={name}>{label}<input name={name} type={type} placeholder={placeholder} required={name === 'name' || name === 'contact'}/></label>
          ))}
          <label>{t.about[0]}<textarea name="about" placeholder={t.about[1]}/></label>
          <label className="upload">
            <Upload/>
            <span><b>{t.upload[0]}</b><small>{t.upload[1]}</small></span>
            <input type="file" accept="video/*" onChange={(e) => setVideo(Boolean(e.target.files?.length))}/>
          </label>
          <button type="submit" disabled={lead === 'sending'}>{lead === 'sending' ? t.formStatus.sending : t.submit} <ArrowUpRight/></button>
          {lead === 'ok' || lead === 'error' ? <small className={lead === 'error' ? 'note bad' : 'note'}>{t.formStatus[lead]}{lead === 'ok' && video ? ` ${t.formStatus.video}` : ''}</small> : null}
          <small className="privacy">{t.privacy}</small>
        </form>
      </section>

      <footer id="contact">
        <Logo/>
        <div><b>PALLET · WELD · MOVE · VISION</b><p>{t.footer}</p></div>
        <div className="footerRight"><a href="mailto:hello@iroxtech.ru">hello@iroxtech.ru</a><span>© 2026 IROX</span></div>
      </footer>
    </main>
  );
}
