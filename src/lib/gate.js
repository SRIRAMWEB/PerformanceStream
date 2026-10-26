/**
 * PerformanceStream Gate Validation Engine
 * Team Among Us · BreachX · Problem ID BRCX-SPT-03
 *
 * Secure real-time sports analytics pipeline:
 * Verifies every sensor reading, quarantines suspicious data,
 * and maintains cryptographic lineage.
 */

export const INITIAL_GATE_STATE = {
  lastSeq: 100,
  lastHr: 148,
  registeredSensors: {
    'S-07': 'sensor-07-secret',
  },
  attackerKey: 'attacker-guess',
  usedNonces: new Set(['nonce-replay-001']), // pre-seed the replay nonce
  rateLimit: 20, // 20 requests per second threshold
};

/**
 * Deterministic fallback hash if crypto.subtle is unavailable
 */
function fallbackHash(str) {
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

/**
 * Generate HMAC-SHA-256 hex signature over "sensor|hr|ts|seq|nonce"
 */
export async function generateSignature(sensor, hr, ts, seq, nonce, secretKey) {
  const payload = `${sensor}|${hr}|${ts}|${seq}|${nonce}`;
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
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // fallback below
  }
  return fallbackHash(`${secretKey}:${payload}`);
}

/**
 * Verify HMAC-SHA-256 signature
 */
export async function verifySignature(packet, secretKey) {
  const expected = await generateSignature(
    packet.sensor,
    packet.hr,
    packet.ts,
    packet.seq,
    packet.nonce,
    secretKey
  );
  return expected.toLowerCase() === (packet.sig || '').toLowerCase();
}

/**
 * Five Sequential Checks Definitions
 */
export const CHECK_DEFINITIONS = [
  {
    id: 1,
    title: '1. Who sent it?',
    question: 'Is this sensor registered?',
    role: 'gateway',
  },
  {
    id: 2,
    title: '2. Was it altered?',
    question: 'Does signature match?',
    role: 'gateway',
  },
  {
    id: 3,
    title: '3. Is it fresh?',
    question: 'Is nonce unused & age ≤ 30s?',
    role: 'validation',
  },
  {
    id: 4,
    title: '4. Is it in order?',
    question: 'Is sequence last + 1?',
    role: 'validation',
  },
  {
    id: 5,
    title: '5. Does it make sense?',
    question: 'Is HR 30–220 & jump ≤ 60 bpm?',
    role: 'validation',
  },
];

/**
 * Execute check 1: Who sent it?
 */
export function check1_whoSentIt(packet, state) {
  const registeredKey = state.registeredSensors[packet.sensor];
  if (!registeredKey) {
    return {
      pass: false,
      outcome: 'REJECT',
      resultText: `Fail: Unknown sensor “${packet.sensor}”`,
    };
  }
  return {
    pass: true,
    resultText: `Pass: Sensor “${packet.sensor}” registered`,
  };
}

/**
 * Execute check 2: Was it altered?
 */
export async function check2_wasItAltered(packet, state) {
  const registeredKey = state.registeredSensors[packet.sensor] || state.attackerKey;
  const isValid = await verifySignature(packet, registeredKey);
  if (!isValid) {
    return {
      pass: false,
      outcome: 'REJECT',
      resultText: 'Fail: Signature mismatch (data altered or wrong key)',
    };
  }
  return {
    pass: true,
    resultText: 'Pass: Signature valid',
  };
}

/**
 * Execute check 3: Is it fresh?
 */
export function check3_isItFresh(packet, state, currentTs = Math.floor(Date.now() / 1000)) {
  if (state.usedNonces.has(packet.nonce)) {
    return {
      pass: false,
      outcome: 'REJECT',
      resultText: 'Fail: Replay detected (nonce already seen)',
    };
  }
  const age = currentTs - packet.ts;
  if (age > 30) {
    return {
      pass: false,
      outcome: 'REJECT',
      resultText: `Fail: Timestamp expired (${Math.round(age)}s old > 30s limit)`,
    };
  }
  return {
    pass: true,
    resultText: 'Pass: Fresh nonce & timestamp within 30s',
  };
}

/**
 * Execute check 4: Is it in order?
 */
export function check4_isInOrder(packet, state) {
  const expectedSeq = state.lastSeq + 1;
  if (packet.seq !== expectedSeq) {
    return {
      pass: false,
      outcome: 'QUARANTINE',
      resultText: `Flag: Missing readings (jump from #${state.lastSeq} to #${packet.seq})`,
    };
  }
  return {
    pass: true,
    resultText: `Pass: Sequence #${packet.seq} in order`,
  };
}

/**
 * Execute check 5: Does it make sense?
 */
export function check5_doesItMakeSense(packet, state) {
  if (packet.hr < 30 || packet.hr > 220) {
    return {
      pass: false,
      outcome: 'QUARANTINE',
      resultText: `Flag: Value ${packet.hr} bpm outside physiological range (30–220)`,
    };
  }
  const jump = Math.abs(packet.hr - state.lastHr);
  if (jump > 60) {
    return {
      pass: false,
      outcome: 'QUARANTINE',
      resultText: `Flag: Jump of ${jump} bpm exceeds 60 bpm threshold`,
    };
  }
  return {
    pass: true,
    resultText: `Pass: ${packet.hr} bpm within normal bounds`,
  };
}

/**
 * Scenario Presets Configuration
 */
export const SCENARIO_PRESETS = [
  {
    id: 'normal',
    name: 'Normal reading',
    type: 'normal',
    actor: 'Sensor',
    description: 'Genuine sensor S-07 sends 151 bpm with valid sequence and key.',
    caption: 'Sensor S-07 sends a normal heart rate reading of 151 bpm with a valid signature and sequential counter. The gate verifies all five checks and forwards it to the coach.',
    expectedOutcome: 'TRUSTED',
    generatePacket: async (state, now) => {
      const sensor = 'S-07';
      const hr = 151;
      const ts = now;
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.random().toString(36).slice(2, 10)}`;
      const sig = await generateSignature(sensor, hr, ts, seq, nonce, state.registeredSensors[sensor]);
      return {
        sensor,
        hr,
        ts,
        seq,
        nonce,
        sig,
        changedFields: [],
      };
    },
  },
  {
    id: 'fake_sensor',
    name: 'Fake sensor',
    type: 'attack',
    actor: 'Attacker',
    description: 'Rogue sensor S-99 with attacker key attempts to inject data.',
    caption: 'An attacker injects packets pretending to be an unregistered sensor “S-99”. The gate stops it immediately at Check 1 because S-99 is not in the authorized device registry.',
    expectedOutcome: 'REJECTED',
    generatePacket: async (state, now) => {
      const sensor = 'S-99';
      const hr = 190;
      const ts = now;
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.random().toString(36).slice(2, 10)}`;
      const sig = await generateSignature(sensor, hr, ts, seq, nonce, state.attackerKey);
      return {
        sensor,
        hr,
        ts,
        seq,
        nonce,
        sig,
        changedFields: ['sensor'],
      };
    },
  },
  {
    id: 'changed_value',
    name: 'Changed value',
    type: 'attack',
    actor: 'Attacker',
    description: 'Heart rate edited to 60 bpm in transit after message was signed.',
    caption: 'The attacker intercepts a genuine reading of about 150 bpm and edits it to 60 bpm in transit. Check 2 catches the invalid HMAC signature and rejects the packet.',
    expectedOutcome: 'REJECTED',
    generatePacket: async (state, now) => {
      const sensor = 'S-07';
      const originalHr = 150;
      const ts = now;
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.random().toString(36).slice(2, 10)}`;
      // Signed with 150 bpm:
      const sig = await generateSignature(sensor, originalHr, ts, seq, nonce, state.registeredSensors[sensor]);
      // Attacker tampers hr to 60:
      return {
        sensor,
        hr: 60,
        ts,
        seq,
        nonce,
        sig,
        changedFields: ['hr'],
      };
    },
  },
  {
    id: 'replay_old_data',
    name: 'Replay old data',
    type: 'attack',
    actor: 'Attacker',
    description: 'Attacker replays recorded packet from 2 minutes ago with pre-used nonce.',
    caption: 'An attacker replays a recorded packet from 2 minutes ago. Check 3 catches the expired timestamp (>30s) and duplicate nonce, immediately rejecting the replay.',
    expectedOutcome: 'REJECTED',
    generatePacket: async (state, now) => {
      const sensor = 'S-07';
      const hr = 147;
      const ts = now - 120; // 120s old
      const seq = state.lastSeq; // old seq
      const nonce = 'nonce-replay-001'; // pre-used nonce in state
      const sig = await generateSignature(sensor, hr, ts, seq, nonce, state.registeredSensors[sensor]);
      return {
        sensor,
        hr,
        ts,
        seq,
        nonce,
        sig,
        changedFields: ['ts', 'nonce'],
      };
    },
  },
  {
    id: 'missing_readings',
    name: 'Missing readings',
    type: 'attack',
    actor: 'System',
    description: 'Sequence jumps ahead by 27 packets due to RF loss or disruption.',
    caption: 'A sudden sequence jump (+27) indicates lost wireless packets or out-of-order delivery. The gate quarantines the reading to prevent corrupting the coach’s trendline.',
    expectedOutcome: 'QUARANTINED',
    generatePacket: async (state, now) => {
      const sensor = 'S-07';
      const hr = 154;
      const ts = now;
      const seq = state.lastSeq + 27; // Sequence jump +27
      const nonce = `n-${Math.random().toString(36).slice(2, 10)}`;
      const sig = await generateSignature(sensor, hr, ts, seq, nonce, state.registeredSensors[sensor]);
      return {
        sensor,
        hr,
        ts,
        seq,
        nonce,
        sig,
        changedFields: ['seq'],
      };
    },
  },
  {
    id: 'stolen_key',
    name: 'Stolen key',
    type: 'attack',
    actor: 'Attacker',
    description: 'Valid cryptographic signature with impossible physiological value (400 bpm).',
    caption: 'Even if an attacker steals the cryptographic key, impossible physiological values (400 bpm) are flagged by Check 5 and quarantined before reaching the coach.',
    expectedOutcome: 'QUARANTINED',
    generatePacket: async (state, now) => {
      const sensor = 'S-07';
      const hr = 400; // Impossible HR
      const ts = now;
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.random().toString(36).slice(2, 10)}`;
      const sig = await generateSignature(sensor, hr, ts, seq, nonce, state.registeredSensors[sensor]);
      return {
        sensor,
        hr,
        ts,
        seq,
        nonce,
        sig,
        changedFields: ['hr'],
      };
    },
  },
  {
    id: 'flood',
    name: 'Flood',
    type: 'attack',
    actor: 'System',
    description: 'Volumetric flood from 0 to 500 req/s. 480 dropped; 1 genuine passes.',
    caption: 'An attacker unleashes a 500 req/sec flood. The token-bucket rate limiter sheds 480 excess requests at the perimeter; the system stays responsive and one genuine reading passes.',
    expectedOutcome: 'TRUSTED',
    isFlood: true,
    floodRate: 500,
    droppedCount: 480,
    generatePacket: async (state, now) => {
      const sensor = 'S-07';
      const hr = 152;
      const ts = now;
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.random().toString(36).slice(2, 10)}`;
      const sig = await generateSignature(sensor, hr, ts, seq, nonce, state.registeredSensors[sensor]);
      return {
        sensor,
        hr,
        ts,
        seq,
        nonce,
        sig,
        changedFields: [],
      };
    },
  },
];
