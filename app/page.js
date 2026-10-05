'use client';
import {ArrowUpRight,Upload,ScanLine,Bot,Truck,Flame,ChevronRight,Check} from 'lucide-react';
import {Fragment,useEffect,useRef,useState} from 'react';
import {copy,LEGAL_DRIVE,solutionMeta,stepMeta,metrics} from './copy';
import {SiteFooter,SiteHeader} from './site-chrome';

const LEAD_URL = 'https://functions.yandexcloud.net/d4ephi82ae2rlm51rgco';

function putWithProgress(url, file, type, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', type);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !event.total) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => resolve(xhr.status);
    xhr.onerror = () => resolve(0);
    xhr.send(file);
  });
}

function Ring({value}) {
  const r = 15.5;
  const c = 2 * Math.PI * r;
  const shown = Math.max(0, Math.min(100, value));
  return (
    <span className="ring" role="progressbar" aria-valuenow={shown} aria-valuemin={0} aria-valuemax={100}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle className="track" cx="20" cy="20" r={r}/>
        <circle className="bar" cx="20" cy="20" r={r} strokeDasharray={c} strokeDashoffset={c - (shown / 100) * c}/>
      </svg>
      <b>{shown}<small>%</small></b>
    </span>
  );
}
const icons = [Bot, Flame, Truck, ScanLine];
const CONSENT_VERSION = '2026-10-03';

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
  const [lead, setLead] = useState('idle');
  const [fileName, setFileName] = useState('');
  const [pct, setPct] = useState(null);
  const [consent, setConsent] = useState(false);
  const [consentErr, setConsentErr] = useState(false);
  const consentRef = useRef(null);
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
      <SiteHeader t={t} lang={lang} setLang={setLang}/>

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
            if (consent !== true) {
              setConsentErr(true);
              consentRef.current?.focus();
              return;
            }
            const data = new FormData(e.currentTarget);
            const body = Object.fromEntries(['name', 'company', 'contact', 'email', 'about'].map((key) => [key, data.get(key) || '']));
            const consentLanguage = lang === 'zh' ? 'zh' : lang;
            const consentFields = {
              personal_data_consent: true,
              consent_version: CONSENT_VERSION,
              consent_language: consentLanguage,
              consent_timestamp: new Date().toISOString(),
              consent_document: 'personal-data-consent',
              privacy_document: 'privacy',
            };
            const mark = `personal_data_consent=true; consent_version=${consentFields.consent_version}; consent_language=${consentFields.consent_language}; consent_timestamp=${consentFields.consent_timestamp}; consent_document=${consentFields.consent_document}; privacy_document=${consentFields.privacy_document}`;
            body.about = `${mark}\n${body.about}`.trim();
            Object.assign(body, consentFields);
            const file = data.get('video');
            setPct(null);
            setLead('sending');
            try {
              if (file && file.size) {
                if (file.size > 100 * 1024 * 1024) { setLead('tooBig'); return; }
                const type = file.type || 'application/octet-stream';
                setPct(0);
                const signRes = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({op: 'sign', name: file.name, type, size: file.size})});
                if (!signRes.ok) { setPct(null); setLead('videoFail'); return; }
                const signed = await signRes.json();
                const status = await putWithProgress(signed.uploadUrl, file, type, setPct);
                if (status < 200 || status >= 300) { setPct(null); setLead('videoFail'); return; }
                body.videoUrl = signed.videoUrl;
              }
              const res = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
              setPct(null);
              setLead(res.ok ? 'ok' : 'error');
            } catch {
              setPct(null);
              setLead('error');
            }
          }}>
          {t.fields.map(([label, placeholder, type, name]) => (
            <label key={name}>{label}<input name={name} type={type} placeholder={placeholder} required={name === 'name' || name === 'contact'}/></label>
          ))}
          <label>{t.about[0]}<textarea name="about" placeholder={t.about[1]}/></label>
          <label className="upload">
            {pct === null ? <Upload/> : <Ring value={pct}/>}
            <span><b>{t.upload[0]}</b><small>{fileName || t.upload[1]}</small></span>
            <input name="video" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}/>
          </label>
          <div className="consent">
            <input id="pd-consent" ref={consentRef} type="checkbox" checked={consent} aria-invalid={consentErr || undefined} aria-describedby={consentErr ? 'consent-error' : undefined} onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentErr(false); }}/>
            <span>
              <label htmlFor="pd-consent">{t.consentBox[0]}</label>
              <a href={LEGAL_DRIVE} target="_blank" rel="noopener noreferrer">{t.consentBox[1]}</a>
              <label htmlFor="pd-consent">{t.consentBox[2]}</label>
              <a href={LEGAL_DRIVE} target="_blank" rel="noopener noreferrer">{t.consentBox[3]}</a>
              <label htmlFor="pd-consent">{t.consentBox[4]}</label>
            </span>
          </div>
          {consentErr ? <small className="note bad" id="consent-error">{t.consentError}</small> : null}
          <button type="submit" disabled={lead === 'sending'}>{lead === 'sending' ? t.formStatus.sending : t.submit} <ArrowUpRight/></button>
          {lead !== 'idle' && lead !== 'sending' && lead !== 'ok' ? <small className="note bad">{t.formStatus[lead]}</small> : null}
          {lead === 'ok' ? (
            <div className="sent" role="status">
              <span className="tick" aria-hidden="true"><Check strokeWidth={2.6}/></span>
              <b>{t.formStatus.okTitle}</b>
              <span>{t.formStatus.okText}</span>
            </div>
          ) : null}
        </form>
      </section>

      <SiteFooter t={t} lang={lang}/>
    </main>
  );
}
