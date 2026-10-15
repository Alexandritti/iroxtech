'use client';
import {ArrowUpRight,Upload,ScanLine,Bot,Truck,Flame,ChevronRight,Check} from 'lucide-react';
import {Fragment,useEffect,useRef,useState} from 'react';
import {copy,LEGAL_DRIVE,solutionMeta} from './copy';
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

function LoadMark({value}) {
  const known = typeof value === 'number';
  const shown = known ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <span className="load" role="progressbar" aria-valuenow={known ? shown : undefined} aria-valuemin={0} aria-valuemax={100} aria-busy="true">
      <i><b className={known ? undefined : 'hold'} style={known ? {width: `${shown}%`} : undefined}/></i>
      {known ? <em>{shown}%</em> : null}
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
  const busy = useRef(false);
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
        <div className="sectionNo">{t.sections[0]}</div>
        <h2>{t.statement[0]}<br/><span>{t.statement[1]}</span></h2>
        <div className="statementText">
          <p>{t.statementText}</p>
          <div className="flow">{t.flow[0]} <ChevronRight/> <strong>{t.flow[1]}</strong></div>
        </div>
      </section>

      <section id="solutions" className="solutions">
        <div className="sectionHead">
          <div className="sectionNo">{t.sections[1]}</div>
          <h2>{t.solutionsTitle[0]}<br/>{t.solutionsTitle[1]}</h2>
        </div>
        {/* Later: one OperationVideo per card (PALLET, WELD, MOVE, VISION), sequence before → robotization → after. Do not mount until src exists. */}
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
          <div className="sectionNo">{t.sections[2]}</div>
          <h2>{t.processTitle[0]}<br/>{t.processTitle[1]}</h2>
        </div>
        <div className="steps">
          {t.steps.map(([title, text], i) => (
            <div className="step" key={t.stepMeta[i]}>
              <div className="stepNum">0{i + 1}</div>
              <div><small>{t.stepMeta[i]}</small><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="economics" className="economics">
        <div className="sectionNo">{t.sections[3]}</div>
        <div className="econGrid">
          <div><Title lines={t.econ}/></div>
          <div className="metrics">
            <p>{t.econText}</p>
            {/* econCalculator in copy.js is the later input/output shape. This block stays descriptive. */}
            {t.metricKeys.map((key, i) => <div className="metric" key={key}><b>{key}</b><span>{t.metrics[i]}</span></div>)}
          </div>
        </div>
      </section>

      <section className="tech">
        <div className="sectionNo">{t.sections[4]}</div>
        <h2>{t.tech.before}<br/><span>{t.tech.accent}</span></h2>
        <div className="techWords">{t.techWords.map((word) => {
          const label = Array.isArray(word) ? word[0] : word;
          const note = Array.isArray(word) ? word[1] : '';
          return <span key={label}>{label}{note ? <small>{note}</small> : null}</span>;
        })}</div>
      </section>

      <section id="lead" className="lead">
        <div className="leadCopy">
          <div className="sectionNo">{t.sections[5]}</div>
          <h2>{t.leadTitle[0]}<br/>{t.leadTitle[1]}</h2>
          <h3>{t.leadSub}</h3>
          <p>{t.leadText}</p>
          <ol>{t.leadList.map((item) => <li key={item}>{item}</li>)}</ol>
        </div>
        <form method="post" action="#lead" onSubmit={async (e) => {
            e.preventDefault();
            if (busy.current || lead === 'sending') return;
            if (consent !== true) {
              setConsentErr(true);
              consentRef.current?.focus();
              return;
            }
            busy.current = true;
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
            let sent = false;
            try {
              if (file && file.size) {
                if (file.size > 100 * 1024 * 1024) { setLead('tooBig'); return; }
                const ext = (file.name.split('.').pop() || '').toLowerCase();
                const type = ext === 'mp4' ? 'video/mp4' : ext === 'mov' ? 'video/quicktime' : '';
                if (!type) { setLead('videoFail'); return; }
                setPct(0);
                const signRes = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({op: 'sign', name: file.name, type, size: file.size})});
                if (!signRes.ok) { setPct(null); setLead('videoFail'); return; }
                const signed = await signRes.json();
                const status = await putWithProgress(signed.uploadUrl, file, type, setPct);
                if (status < 200 || status >= 300) { setPct(null); setLead('videoFail'); return; }
                if (signed.key) body.videoKey = signed.key;
                else if (signed.videoUrl) body.videoUrl = signed.videoUrl;
              }
              const res = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
              setPct(null);
              sent = res.ok;
              setLead(sent ? 'ok' : 'error');
            } catch {
              setPct(null);
              setLead('error');
            } finally {
              if (!sent) busy.current = false;
            }
          }}>
          {t.fields.map(([label, placeholder, type, name]) => (
            <label key={name}>{label}<input name={name} type={type} placeholder={placeholder} required={name === 'name' || name === 'contact'}/></label>
          ))}
          <label>{t.about[0]}<textarea name="about" placeholder={t.about[1]}/></label>
          <label className="upload">
            {pct === null ? <Upload/> : <LoadMark value={pct}/>}
            <span><b>{t.upload[0]}</b><small>{fileName || t.upload[1]}</small></span>
            <input name="video" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" disabled={lead === 'sending'} onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}/>
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
          <button type="submit" disabled={lead === 'sending'} aria-busy={lead === 'sending' || undefined}>{lead === 'sending' ? t.formStatus.sending : t.submit} {lead === 'sending' && pct === null ? <LoadMark/> : <ArrowUpRight/>}</button>
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
