// Cryptographic Hash Chain Ledger (SHA-256)
// Provides tamper-evident proof linking every displayed number to its immutable source record

import { computeSha256 } from './crypto.js';

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export function canonicalRecordString(record) {
  return `${record.device_id}|${record.metric || 'hr'}|${record.value}|${record.ts}|${record.seq}|${record.nonce}|${record.sig}`;
}

export async function createLedgerBlock(record, previousHash = GENESIS_HASH) {
  const payloadStr = canonicalRecordString(record);
  const hash = await computeSha256(`${payloadStr}|${previousHash}`);
  return {
    index: record.seq,
    record: { ...record },
    previousHash,
    hash,
    timestamp: record.ts || Math.floor(Date.now() / 1000),
    tampered: false,
  };
}

export async function verifyLedgerChain(chain) {
  if (!chain || chain.length === 0) {
    return { valid: true, chainLength: 0, message: 'Ledger empty' };
  }

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const prevHash = i === 0 ? GENESIS_HASH : chain[i - 1].hash;

    if (block.previousHash !== prevHash) {
      return {
        valid: false,
        brokenIndex: i,
        sequence: block.index,
        reason: `Previous hash mismatch at sequence #${block.index}`,
      };
    }

    const payloadStr = canonicalRecordString(block.record);
    const expectedHash = await computeSha256(`${payloadStr}|${block.previousHash}`);
    if (expectedHash !== block.hash) {
      return {
        valid: false,
        brokenIndex: i,
        sequence: block.index,
        reason: `Record hash broken at sequence #${block.index}: signature/payload manipulated`,
      };
    }
  }

  return { valid: true, chainLength: chain.length, message: 'All cryptographic ledger links verified (OK)' };
}

export function tamperLedgerRecord(chain, indexToTamper, field = 'value', alteredValue = 999) {
  return chain.map((block, idx) => {
    if (idx === indexToTamper) {
      return {
        ...block,
        record: {
          ...block.record,
          [field]: alteredValue,
        },
        tampered: true,
      };
    }
    return block;
  });
}
