const crypto = require('crypto');

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
const HOST = 'storage.yandexcloud.net';
const REGION = 'ru-central1';
const MAX_VIDEO = 100 * 1024 * 1024;

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

function enc(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function presign({ method, bucket, key, expires, contentType, accessKey, secret }) {
  const amz = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = amz.slice(0, 8);
  const scope = `${date}/${REGION}/s3/aws4_request`;
  const signedHeaders = contentType ? 'content-type;host' : 'host';
  const canonicalUri = `/${[bucket, ...key.split('/')].map(enc).join('/')}`;
  const pairs = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Credential', `${accessKey}/${scope}`],
    ['X-Amz-Date', amz],
    ['X-Amz-Expires', String(expires)],
    ['X-Amz-SignedHeaders', signedHeaders],
  ].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const canonicalQuery = pairs.map(([k, v]) => `${enc(k)}=${enc(v)}`).join('&');
  const canonicalHeaders = contentType
    ? `content-type:${contentType}\nhost:${HOST}\n`
    : `host:${HOST}\n`;
  const canonical = [method, canonicalUri, canonicalQuery, canonicalHeaders, signedHeaders, 'UNSIGNED-PAYLOAD'].join('\n');
  const stringToSign = ['AWS4-HMAC-SHA256', amz, scope, crypto.createHash('sha256').update(canonical).digest('hex')].join('\n');
  const signingKey = ['AWS4' + secret, date, REGION, 's3', 'aws4_request'].reduce(
    (key, part) => crypto.createHmac('sha256', key).update(part).digest(),
  );
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
  return `https://${HOST}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

function extOf(name) {
  const ext = (name || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
  return ext === 'mp4' || ext === 'mov' ? ext : '';
}

function readPayload(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : (event.body || '');
  return JSON.parse(raw);
}

module.exports.handler = async function (event) {
  const method = event.httpMethod || '';
  if (method === 'OPTIONS') return { statusCode: 204, headers: headersFor(event), body: '' };
  if (method !== 'POST') return json(event, 405, { error: 'POST only' });

  let payload;
  try {
    payload = readPayload(event);
  } catch {
    return json(event, 400, { error: 'bad json' });
  }

  const bucket = process.env.S3_BUCKET || '';
  const accessKey = process.env.S3_ACCESS_KEY || '';
  const secret = process.env.S3_SECRET_KEY || '';

  if (payload.op === 'sign') {
    if (!bucket || !accessKey || !secret) return json(event, 501, { error: 'storage' });
    const size = Number(payload.size) || 0;
    const ext = extOf(payload.name);
    const type = (payload.type || 'application/octet-stream').toString().slice(0, 80);
    if (!ext || size < 1 || size > MAX_VIDEO) return json(event, 400, { error: 'file' });
    const day = new Date().toISOString().slice(0, 10);
    const key = `leads/${day}/${crypto.randomUUID()}.${ext}`;
    const uploadUrl = presign({ method: 'PUT', bucket, key, expires: 3600, contentType: type, accessKey, secret });
    const videoUrl = presign({ method: 'GET', bucket, key, expires: 604800, accessKey, secret });
    return json(event, 200, { uploadUrl, videoUrl });
  }

  const values = {};
  for (const [key, id] of Object.entries(FIELDS)) {
    const value = (payload[key] || '').toString().trim();
    if (value) values[id] = value.slice(0, 3500);
  }
  if (payload.videoUrl) {
    let url;
    try { url = new URL(payload.videoUrl); } catch { url = null; }
    const own = url && url.protocol === 'https:' && url.hostname === HOST && url.pathname.startsWith(`/${bucket}/leads/`);
    if (own) values[FIELDS.about] = `${values[FIELDS.about] || ''}\nВидео: ${payload.videoUrl}`.trim().slice(0, 4000);
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
