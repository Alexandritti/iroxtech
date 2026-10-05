'use client';
import {useEffect} from 'react';
import {copy,legalPath} from './copy';
import {LEGAL} from './legal-docs';
import {SiteFooter,SiteHeader} from './site-chrome';

function Rich({text}) {
  const parts = String(text).split(/(hello@iroxtech\.ru|https:\/\/iroxtech\.ru[^\s)]*)/g);
  return parts.map((part, i) => {
    if (part === 'hello@iroxtech.ru') return <a key={i} href="mailto:hello@iroxtech.ru">hello@iroxtech.ru</a>;
    if (part.startsWith('https://iroxtech.ru')) return <a key={i} href={part}>{part}</a>;
    return <span key={i}>{part}</span>;
  });
}

function Blocks({blocks}) {
  return blocks.map((block, i) => (
    Array.isArray(block)
      ? <ul key={i}>{block.map((item) => <li key={item}>— <Rich text={item}/></li>)}</ul>
      : <p key={i}><Rich text={block}/></p>
  ));
}

export default function LegalPage({lang, doc}) {
  const t = copy[lang];
  const data = LEGAL[lang][doc];
  const hrefs = {
    ru: legalPath('ru', doc),
    en: legalPath('en', doc),
    zh: legalPath('zh', doc),
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
    localStorage.setItem('irox-lang', lang);
  }, [lang]);

  return (
    <main className="legalPage">
      <SiteHeader t={t} lang={lang} hrefs={hrefs} home="/"/>
      <div className="legalWrap">
        <article className="legal">
          <a className="legalBack" href="/">{t.back}</a>
          <h1>{data.title}</h1>
          <p className="legalDate">{data.updated}</p>
          <Blocks blocks={data.intro || []}/>
          {data.sections.map((section) => (
            <section key={section.h}>
              <h2>{section.h}</h2>
              <Blocks blocks={section.blocks}/>
            </section>
          ))}
        </article>
      </div>
      <SiteFooter t={t} lang={lang} logoHref="/"/>
    </main>
  );
}
