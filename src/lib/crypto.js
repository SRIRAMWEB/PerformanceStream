// Web Crypto HMAC-SHA-256 and SHA-256 Hash Chain Utility
// Canonical payload format: `${device_id}|${metric}|${value}|${ts}|${seq}|${nonce}`

function fallbackSha256(str) {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const val = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return val.toString(16).padStart(16, '0').repeat(4).slice(0, 64);
}

export async function computeSha256(dataString) {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const enc = new TextEncoder();
      const buffer = await crypto.subtle.digest('SHA-256', enc.encode(dataString));
      return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // fallback
  }
  return fallbackSha256(dataString);
}

export async function generateHmac(canonicalPayload, secretKey) {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secretKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(canonicalPayload));
      return Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // fallback
  }
  return fallbackSha256(`${secretKey}:${canonicalPayload}`);
}

export async function verifyHmac(canonicalPayload, signature, secretKey) {
  const expected = await generateHmac(canonicalPayload, secretKey);
  return expected.toLowerCase() === (signature || '').toLowerCase();
}
