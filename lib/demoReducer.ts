import { DemoState, StepId, CheckId, CheckResult } from './types';
import { CREATORS, PRODUCTS, calculateAgreedAmount } from './mockData';

export type DemoAction =
  | { type: 'SET_PRODUCT'; productId: string }
  | { type: 'SET_BUDGET'; budget: number }
  | { type: 'SET_PLATFORM'; platform: 'Instagram' | 'YouTube' }
  | { type: 'SET_CITY'; city: string }
  | { type: 'SET_OBJECTIVE'; objective: 'Sales' | 'Awareness' }
  | { type: 'SET_USER_ROLE'; role: 'brand' | 'creator' }
  | { type: 'START_MATCH_SCAN' }
  | { type: 'MATCH_SCAN_DONE' }
  | { type: 'SELECT_CREATOR'; creatorId: string }
  | { type: 'DISMISS_RISK_MODAL' }
  | { type: 'CONTINUE_WITH_RISK' }
  | { type: 'GO_TO_STEP'; step: StepId }
  | { type: 'REQUEST_BACK'; step: StepId }
  | { type: 'CONFIRM_BACK' }
  | { type: 'CANCEL_BACK' }
  | { type: 'BRAND_SIGN' }
  | { type: 'CREATOR_SIGN' }
  | { type: 'FUND_ESCROW' }
  | { type: 'ESCROW_HELD' }
  | { type: 'FIX_AD_LABEL' }
  | { type: 'SET_SIMULATE_FAILURE'; value: boolean }
  | { type: 'START_CHECKS' }
  | { type: 'SET_CHECK'; id: CheckId; result: CheckResult }
  | { type: 'CHECKS_COMPLETE' }
  | { type: 'OPEN_DISPUTE' }
  | { type: 'RESOLVE_PARTIAL' }
  | { type: 'RESOLVE_RESHOOT' }
  | { type: 'RESHOOT_CHECK_PASS'; id: CheckId }
  | { type: 'RELEASE_PAYOUT' }
  | { type: 'RESET' };

const DEFAULT_PRODUCT = PRODUCTS[0];
const DEFAULT_CREATOR = CREATORS[0];
const DEFAULT_BUDGET = 25000;

function makeInitialCaption(productId: string): string {
  return PRODUCTS.find((p) => p.id === productId)?.defaultCaption ?? PRODUCTS[0].defaultCaption;
}

export function makeInitialState(): DemoState {
  const agreedAmount = calculateAgreedAmount(DEFAULT_BUDGET, DEFAULT_CREATOR.rateFactor);
  return {
    step: 'goal',
    userRole: 'brand',
    product: DEFAULT_PRODUCT.id,
    budget: DEFAULT_BUDGET,
    platform: 'Instagram',
    city: 'Chennai',
    objective: 'Sales',
    creatorId: DEFAULT_CREATOR.id,
    agreedAmount,
    contract: 'draft',
    escrow: 'unfunded',
    caption: makeInitialCaption(DEFAULT_PRODUCT.id),
    adLabelFixed: false,
    checks: { live: 'idle', product: 'idle', adlabel: 'idle', deadline: 'idle', engagement: 'idle' },
    simulateFailure: false,
    dispute: 'none',
    disputeOutcome: null,
    trustScore: DEFAULT_CREATOR.realFollowerPct,
    verifiedDeliveries: DEFAULT_CREATOR.verifiedDeliveries,
    payout: { creator: 0, refund: 0 },
    highRiskModalOpen: false,
    isScanningMatch: false,
    isCheckingPost: false,
    backConfirmModalOpen: false,
    pendingBackStep: null,
  };
}

const STEPS: StepId[] = ['goal', 'match', 'agreement', 'escrow', 'post', 'payout'];

/** Steps that, when navigated back-to from escrow-or-later, need a reset confirm */
function requiresEscrowReset(from: StepId, to: StepId): boolean {
  const fromIdx = STEPS.indexOf(from);
  const toIdx = STEPS.indexOf(to);
  return fromIdx >= STEPS.indexOf('post') && toIdx <= STEPS.indexOf('agreement');
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SET_PRODUCT': {
      const p = PRODUCTS.find((x) => x.id === action.productId) ?? PRODUCTS[0];
      return {
        ...state,
        product: action.productId,
        caption: p.defaultCaption,
        adLabelFixed: false,
      };
    }
    case 'SET_BUDGET': {
      const creator = CREATORS.find((c) => c.id === state.creatorId) ?? DEFAULT_CREATOR;
      return {
        ...state,
        budget: action.budget,
        agreedAmount: calculateAgreedAmount(action.budget, creator.rateFactor),
      };
    }
    case 'SET_PLATFORM':
      return { ...state, platform: action.platform };
    case 'SET_CITY':
      return { ...state, city: action.city };
    case 'SET_OBJECTIVE':
      return { ...state, objective: action.objective };
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.role };

    case 'START_MATCH_SCAN':
      return { ...state, step: 'match', isScanningMatch: true };
    case 'MATCH_SCAN_DONE':
      return { ...state, isScanningMatch: false };

    case 'SELECT_CREATOR': {
      const creator = CREATORS.find((c) => c.id === action.creatorId);
      if (!creator) return state;
      const amount = calculateAgreedAmount(state.budget, creator.rateFactor);
      if (creator.realFollowerPct < 60) {
        return {
          ...state,
          creatorId: creator.id,
          agreedAmount: amount,
          trustScore: creator.realFollowerPct,
          verifiedDeliveries: creator.verifiedDeliveries,
          highRiskModalOpen: true,
        };
      }
      return {
        ...state,
        creatorId: creator.id,
        agreedAmount: amount,
        trustScore: creator.realFollowerPct,
        verifiedDeliveries: creator.verifiedDeliveries,
        highRiskModalOpen: false,
      };
    }
    case 'DISMISS_RISK_MODAL':
      // Go back to first safe creator
      return {
        ...state,
        highRiskModalOpen: false,
        creatorId: DEFAULT_CREATOR.id,
        agreedAmount: calculateAgreedAmount(state.budget, DEFAULT_CREATOR.rateFactor),
        trustScore: DEFAULT_CREATOR.realFollowerPct,
        verifiedDeliveries: DEFAULT_CREATOR.verifiedDeliveries,
      };
    case 'CONTINUE_WITH_RISK':
      return { ...state, highRiskModalOpen: false };

    case 'GO_TO_STEP':
      return { ...state, step: action.step };

    case 'REQUEST_BACK': {
      const curIdx = STEPS.indexOf(state.step);
      const toIdx = STEPS.indexOf(action.step);
      if (toIdx >= curIdx) return state; // not going back
      // If escrow was funded and going back past post/escrow, confirm needed
      if (
        state.escrow !== 'unfunded' &&
        requiresEscrowReset(state.step, action.step)
      ) {
        return { ...state, backConfirmModalOpen: true, pendingBackStep: action.step };
      }
      // Going back to post resets only results
      if (action.step === 'post') {
        return {
          ...state,
          step: 'post',
          checks: { live: 'idle', product: 'idle', adlabel: 'idle', deadline: 'idle', engagement: 'idle' },
          dispute: 'none',
          disputeOutcome: null,
          isCheckingPost: false,
          payout: { creator: 0, refund: 0 },
        };
      }
      return { ...state, step: action.step };
    }
    case 'CONFIRM_BACK': {
      const target = state.pendingBackStep ?? 'goal';
      return {
        ...makeInitialState(),
        // preserve goal + match selections
        product: state.product,
        budget: state.budget,
        platform: state.platform,
        city: state.city,
        objective: state.objective,
        creatorId: state.creatorId,
        agreedAmount: state.agreedAmount,
        caption: state.caption,
        step: target,
        backConfirmModalOpen: false,
        pendingBackStep: null,
      };
    }
    case 'CANCEL_BACK':
      return { ...state, backConfirmModalOpen: false, pendingBackStep: null };

    case 'BRAND_SIGN':
      return {
        ...state,
        contract: state.contract === 'draft' ? 'brand_signed' : state.contract,
      };
    case 'CREATOR_SIGN':
      return {
        ...state,
        contract: state.contract === 'brand_signed' ? 'signed' : state.userRole === 'creator' ? 'signed' : state.contract,
      };

    case 'FUND_ESCROW':
      return { ...state, escrow: 'held' };
    case 'ESCROW_HELD':
      return { ...state, escrow: 'held', step: 'post' };

    case 'FIX_AD_LABEL':
      return {
        ...state,
        adLabelFixed: true,
        caption: state.caption.trimEnd() + ' #ad',
      };
    case 'SET_SIMULATE_FAILURE':
      return { ...state, simulateFailure: action.value };

    case 'START_CHECKS':
      return {
        ...state,
        isCheckingPost: true,
        checks: { live: 'idle', product: 'idle', adlabel: 'idle', deadline: 'idle', engagement: 'idle' },
      };
    case 'SET_CHECK':
      return {
        ...state,
        checks: { ...state.checks, [action.id]: action.result },
      };
    case 'CHECKS_COMPLETE': {
      const failed = (Object.values(state.checks) as CheckResult[]).some((r) => r === 'fail');
      return {
        ...state,
        isCheckingPost: false,
        dispute: failed ? 'none' : 'none', // stays none until user picks
      };
    }

    case 'OPEN_DISPUTE':
      return { ...state, dispute: 'open' };

    case 'RESOLVE_PARTIAL': {
      const half = Math.round(state.agreedAmount / 2);
      return {
        ...state,
        dispute: 'resolved',
        disputeOutcome: 'partial',
        escrow: 'partial',
        payout: { creator: half, refund: half },
      };
    }
    case 'RESOLVE_RESHOOT': {
      const fixedChecks = { ...state.checks };
      (Object.keys(fixedChecks) as CheckId[]).forEach((k) => {
        if (fixedChecks[k] === 'fail') {
          fixedChecks[k] = 'pass';
        }
      });
      return {
        ...state,
        checks: fixedChecks,
        dispute: 'resolved',
        disputeOutcome: 'reshoot',
      };
    }

    case 'RESHOOT_CHECK_PASS': {
      const updated = { ...state.checks, [action.id]: 'pass' as CheckResult };
      return { ...state, checks: updated };
    }

    case 'RELEASE_PAYOUT': {
      const creator = CREATORS.find((c) => c.id === state.creatorId) ?? DEFAULT_CREATOR;
      let trustDelta = 0;
      let deliveryDelta = 0;
      if (state.disputeOutcome === null) {
        trustDelta = 2;
        deliveryDelta = 1;
      } else if (state.disputeOutcome === 'reshoot') {
        trustDelta = 1;
        deliveryDelta = 1;
      }
      const newTrustScore = Math.min(99, creator.realFollowerPct + trustDelta);
      return {
        ...state,
        step: 'payout',
        escrow: state.disputeOutcome === 'partial' ? 'partial' : 'released',
        payout:
          state.disputeOutcome === 'partial'
            ? state.payout
            : { creator: state.agreedAmount, refund: 0 },
        trustScore: newTrustScore,
        verifiedDeliveries: state.verifiedDeliveries + deliveryDelta,
      };
    }

    case 'RESET':
      return makeInitialState();

    default:
      return state;
  }
}
