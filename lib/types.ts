export type PlatformType = 'Instagram' | 'YouTube';

export type StepId = 'goal' | 'match' | 'agreement' | 'escrow' | 'post' | 'payout';
export type EscrowStatus = 'unfunded' | 'held' | 'released' | 'partial';
export type ContractStatus = 'draft' | 'brand_signed' | 'signed';
export type DisputeStatus = 'none' | 'open' | 'resolved';
export type DisputeOutcome = null | 'partial' | 'reshoot';
export type CheckId = 'live' | 'product' | 'adlabel' | 'deadline' | 'engagement';
export type CheckResult = 'idle' | 'running' | 'pass' | 'fail';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  niche: string;
  platform: PlatformType;
  followerCount: string;
  matchPct: number;
  realFollowerPct: number;
  engagement: string;
  rateFactor: number;
  verifiedDeliveries: number;
  flaggedPct?: number;
}

export interface RefereeCheck {
  id: CheckId;
  label: string;
  failReason: string;
}

export interface DemoState {
  step: StepId;
  userRole: 'brand' | 'creator';
  product: string;
  budget: number;
  platform: PlatformType;
  city: string;
  objective: 'Sales' | 'Awareness';
  creatorId: string;
  agreedAmount: number;
  contract: ContractStatus;
  escrow: EscrowStatus;
  caption: string;
  adLabelFixed: boolean;
  checks: Record<CheckId, CheckResult>;
  simulateFailure: boolean;
  dispute: DisputeStatus;
  disputeOutcome: DisputeOutcome;
  trustScore: number;
  verifiedDeliveries: number;
  payout: {
    creator: number;
    refund: number;
  };
  // Modal & Async UI controls
  highRiskModalOpen: boolean;
  isScanningMatch: boolean;
  isCheckingPost: boolean;
  backConfirmModalOpen: boolean;
  pendingBackStep: StepId | null;
}
