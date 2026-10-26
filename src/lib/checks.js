// Five-Step Gate Validation Module
// Evaluates ingress telemetry sequentially:
// 1. Identity -> 2. Signature -> 3. Freshness -> 4. Sequence Continuity -> 5. Physiological & Statistical Sense

import { verifyHmac } from './crypto.js';

export const REGISTERED_DEVICES = {
  'S-07': 'sensor-07-secret-key-32b',
  'S-12': 'sensor-12-secret-key-32b',
};

export const CHECK_METADATA = [
  { id: 1, name: 'Who sent it?', question: 'Is device_id registered?' },
  { id: 2, name: 'Was it altered?', question: 'Does HMAC-SHA256 signature match?' },
  { id: 3, name: 'Is it fresh?', question: 'Is timestamp ±5s and nonce unique?' },
  { id: 4, name: 'Is it in order?', question: 'Is sequence number last + 1?' },
  { id: 5, name: 'Does it make sense?', question: 'Within range (30-220) & z-score ≤ 3.0?' },
];

export function check1_whoSentIt(packet, state) {
  const registeredKey = state.registeredDevices[packet.device_id];
  if (!registeredKey) {
    return {
      pass: false,
      outcome: 'REJECTED',
      reason: `Fail: Unknown device “${packet.device_id}”`,
    };
  }
  return {
    pass: true,
    reason: `Pass: Device “${packet.device_id}” registered`,
  };
}

export async function check2_wasItAltered(packet, state) {
  const secretKey = state.registeredDevices[packet.device_id] || state.attackerKey;
  const canonicalPayload = `${packet.device_id}|${packet.metric || 'hr'}|${packet.value}|${packet.ts}|${packet.seq}|${packet.nonce}`;
  const isValid = await verifyHmac(canonicalPayload, packet.sig, secretKey);
  if (!isValid) {
    return {
      pass: false,
      outcome: 'REJECTED',
      reason: 'Fail: Signature mismatch (payload manipulated or wrong key)',
    };
  }
  return {
    pass: true,
    reason: 'Pass: HMAC-SHA256 signature valid',
  };
}

export function check3_isItFresh(packet, state, currentTs = Math.floor(Date.now() / 1000)) {
  if (state.usedNonces.has(packet.nonce)) {
    return {
      pass: false,
      outcome: 'REJECTED',
      reason: 'Fail: Replay attack detected (nonce previously used)',
    };
  }
  const delta = Math.abs(currentTs - packet.ts);
  if (delta > 5) {
    return {
      pass: false,
      outcome: 'REJECTED',
      reason: `Fail: Stale timestamp (${Math.round(delta)}s deviation exceeds ±5s limit)`,
    };
  }
  return {
    pass: true,
    reason: 'Pass: Fresh timestamp (±5s) and unique nonce',
  };
}

export function check4_isInOrder(packet, state) {
  const expectedSeq = state.lastSeq + 1;
  if (packet.seq !== expectedSeq) {
    return {
      pass: false,
      outcome: 'QUARANTINED',
      alert: 'gap detected',
      reason: `Flag: Missing readings (gap from #${state.lastSeq} to #${packet.seq})`,
    };
  }
  return {
    pass: true,
    reason: `Pass: Sequence #${packet.seq} contiguous`,
  };
}

export function check5_doesItMakeSense(packet, state) {
  const val = Number(packet.value);
  if (val < 30 || val > 220) {
    return {
      pass: false,
      outcome: 'QUARANTINED',
      alert: 'impossible metric',
      reason: `Flag: Value ${val} bpm outside physiological bounds (30–220)`,
    };
  }

  // Rolling per-athlete baseline statistical check (mean & std dev)
  const baseline = state.rollingBaseline || { mean: 148, std: 8 };
  const zScore = Math.abs(val - baseline.mean) / (baseline.std || 1);
  const formattedZ = zScore.toFixed(1);

  if (zScore > 3.0) {
    return {
      pass: false,
      outcome: 'QUARANTINED',
      alert: 'revoke device key',
      reason: `Flag: Exceeds baseline (${val} bpm, z-score ${formattedZ} > 3.0)`,
    };
  }

  return {
    pass: true,
    reason: `Pass: ${val} bpm normal (z-score ${formattedZ} ≤ 3.0)`,
  };
}
