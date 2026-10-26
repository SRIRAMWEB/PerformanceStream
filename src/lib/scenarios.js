// Attack and Telemetry Scenario Generators
// Supports repeatable seeded runs, attack intensity modulation, and Protection ON / OFF divergence

import { generateHmac } from './crypto.js';
import { createPrng } from './prng.js';
import { REGISTERED_DEVICES } from './checks.js';

export const SCENARIO_LIST = [
  {
    id: 'normal',
    name: 'Normal reading',
    type: 'normal',
    description: 'Genuine sensor S-07 sends a physiological reading with valid signature and sequence.',
    plainWords: 'All five checks pass cleanly. Reading is verified and sent to coach as Trusted.',
  },
  {
    id: 'fake_sensor',
    name: 'Fake sensor',
    type: 'attack',
    description: 'Rogue sensor S-99 with unregistered key attempts to inject telemetry.',
    plainWords: 'Sensor S-99 is not in the authorized device registry. Dropped immediately at check 1.',
  },
  {
    id: 'changed_value',
    name: 'Changed value',
    type: 'attack',
    description: 'Adversary tampers with heart rate in transit after signing.',
    plainWords: 'Payload heart rate altered after cryptographic signing. Caught by HMAC mismatch at check 2.',
  },
  {
    id: 'replay_old_data',
    name: 'Replay old data',
    type: 'attack',
    description: 'Adversary intercepts and replays valid packet from 120s ago.',
    plainWords: 'Timestamp exceeds ±5s threshold and nonce was previously logged. Blocked at check 3.',
  },
  {
    id: 'missing_readings',
    name: 'Missing readings',
    type: 'attack',
    description: 'RF disruption causes sequence counter to jump forward (+27).',
    plainWords: 'Contiguity broken: sequence jumped +27. Quarantined at check 4 to protect trendline.',
  },
  {
    id: 'stolen_key',
    name: 'Stolen key',
    type: 'attack',
    description: 'Adversary obtains key and sends extreme reading (400 bpm).',
    plainWords: 'Valid key signature, but value breaks physiological range and rolling z-score. Quarantined at check 5.',
  },
  {
    id: 'flood',
    name: 'Flood',
    type: 'attack',
    description: 'Volumetric burst flooding gateway with 500 requests per second.',
    plainWords: 'Perimeter rate limiter sheds excess burst; legitimate traffic passes and dashboard stays responsive.',
  },
];

export async function generateScenarioPacket(scenarioId, state, options = {}) {
  const prng = createPrng(state.prngSeed || 1337 + state.lastSeq);
  const now = Math.floor(Date.now() / 1000);
  const device_id = 'S-07';
  const secretKey = state.registeredDevices[device_id] || REGISTERED_DEVICES['S-07'];
  const baseHr = Math.round(145 + prng() * 8);

  const changedDelta = options.changedDelta !== undefined ? options.changedDelta : 88;
  const floodBurst = options.floodBurst || 500;

  switch (scenarioId) {
    case 'normal': {
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.floor(prng() * 1000000).toString(16)}`;
      const value = baseHr;
      const canonical = `${device_id}|hr|${value}|${now}|${seq}|${nonce}`;
      const sig = await generateHmac(canonical, secretKey);
      return {
        device_id,
        metric: 'hr',
        value,
        ts: now,
        seq,
        nonce,
        sig,
        tamperedField: null,
      };
    }

    case 'fake_sensor': {
      const seq = state.lastSeq + 1;
      const fakeDev = 'S-99';
      const nonce = `n-${Math.floor(prng() * 1000000).toString(16)}`;
      const value = 190;
      const fakeKey = state.attackerKey || 'attacker-guess-key';
      const canonical = `${fakeDev}|hr|${value}|${now}|${seq}|${nonce}`;
      const sig = await generateHmac(canonical, fakeKey);
      return {
        device_id: fakeDev,
        metric: 'hr',
        value,
        ts: now,
        seq,
        nonce,
        sig,
        tamperedField: 'device_id',
      };
    }

    case 'changed_value': {
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.floor(prng() * 1000000).toString(16)}`;
      const signedValue = baseHr;
      const canonical = `${device_id}|hr|${signedValue}|${now}|${seq}|${nonce}`;
      const sig = await generateHmac(canonical, secretKey);
      // Tamper value after signing:
      const alteredValue = Math.max(30, signedValue - changedDelta);
      return {
        device_id,
        metric: 'hr',
        value: alteredValue,
        originalValue: signedValue,
        ts: now,
        seq,
        nonce,
        sig,
        tamperedField: 'value',
      };
    }

    case 'replay_old_data': {
      const seq = state.lastSeq; // old seq
      const oldTs = now - 120; // 120 seconds old
      const preusedNonce = 'n-replay-preused-001';
      const value = 146;
      const canonical = `${device_id}|hr|${value}|${oldTs}|${seq}|${preusedNonce}`;
      const sig = await generateHmac(canonical, secretKey);
      return {
        device_id,
        metric: 'hr',
        value,
        ts: oldTs,
        seq,
        nonce: preusedNonce,
        sig,
        tamperedField: 'ts',
      };
    }

    case 'missing_readings': {
      const seq = state.lastSeq + 27; // Sequence jump +27
      const nonce = `n-${Math.floor(prng() * 1000000).toString(16)}`;
      const value = 152;
      const canonical = `${device_id}|hr|${value}|${now}|${seq}|${nonce}`;
      const sig = await generateHmac(canonical, secretKey);
      return {
        device_id,
        metric: 'hr',
        value,
        ts: now,
        seq,
        nonce,
        sig,
        tamperedField: 'seq',
      };
    }

    case 'stolen_key': {
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.floor(prng() * 1000000).toString(16)}`;
      const value = 400; // impossible extreme HR
      const canonical = `${device_id}|hr|${value}|${now}|${seq}|${nonce}`;
      const sig = await generateHmac(canonical, secretKey); // signed with legitimate key!
      return {
        device_id,
        metric: 'hr',
        value,
        ts: now,
        seq,
        nonce,
        sig,
        tamperedField: 'value',
      };
    }

    case 'flood': {
      const seq = state.lastSeq + 1;
      const nonce = `n-${Math.floor(prng() * 1000000).toString(16)}`;
      const value = 150;
      const canonical = `${device_id}|hr|${value}|${now}|${seq}|${nonce}`;
      const sig = await generateHmac(canonical, secretKey);
      return {
        device_id,
        metric: 'hr',
        value,
        ts: now,
        seq,
        nonce,
        sig,
        isFlood: true,
        burstRate: floodBurst,
        tamperedField: null,
      };
    }

    default:
      throw new Error(`Unknown scenario: ${scenarioId}`);
  }
}
