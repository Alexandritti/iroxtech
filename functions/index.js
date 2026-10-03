const FORM_ID = '6ac0e60884227c9c81a4ab17';
const FIELDS = {
  name: 'answer_short_text_9008990281440588',
  company: 'answer_short_text_9008990281461646',
  contact: 'answer_short_text_9008990281498158',
  email: 'answer_short_text_9008990281533988',
  about: 'answer_short_text_9008990281550408',
};
const ALLOW = new Set([
  'https://iroxtech.ru',
  'http://iroxtech.ru',
  'http://localhost:3000',
]);

function headersFor(event) {
  const h = event.headers || {};
  const origin = h.origin || h.Origin || '';
  const allow = ALLOW.has(origin) ? origin : 'https://iroxtech.ru';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(event, status, data) {
  return {
    statusCode: status,
    headers: { ...headersFor(event), 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(data),
  };
}

module.exports.handler = async function (event) {
  const method = event.httpMethod || '';
  if (method === 'OPTIONS') return { statusCode: 204, headers: headersFor(event), body: '' };
  if (method !== 'POST') return json(event, 405, { error: 'POST only' });

  let payload;
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : (event.body || '');
    payload = JSON.parse(raw);
  } catch {
    return json(event, 400, { error: 'bad json' });
  }

  const values = {};
  for (const [key, id] of Object.entries(FIELDS)) {
    const value = (payload[key] || '').toString().trim();
    if (value) values[id] = value.slice(0, 4000);
  }
  if (!values[FIELDS.name] && !values[FIELDS.contact] && !values[FIELDS.email]) {
    return json(event, 400, { error: 'empty' });
  }

  const res = await fetch(`https://api.forms.yandex.net/v1/surveys/${FORM_ID}/form`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(values),
  });
  const text = await res.text();
  if (!res.ok) {
    console.log(res.status, text.slice(0, 300));
    return json(event, 502, { error: 'form' });
  }
  let answerId = null;
  try { answerId = JSON.parse(text).answer_id; } catch { /* ignore */ }
  return json(event, 200, { ok: true, answerId });
};
