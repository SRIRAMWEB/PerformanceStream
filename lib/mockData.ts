import { Creator, RefereeCheck, PlatformType } from './types';

export interface ProductOption {
  id: string;
  name: string;
  brand: string;
  defaultCaption: string;
}

export const PRODUCTS: ProductOption[] = [
  {
    id: 'coffee',
    name: 'Specialty Coffee',
    brand: 'Madras Brew Co',
    defaultCaption: 'Mornings just got better with this cold brew from Madras Brew Co ☕',
  },
  {
    id: 'fashion',
    name: 'Handloom Fashion',
    brand: 'Kanchi Threads',
    defaultCaption: 'Pure organic handwoven linen that breathes in the summer heat 🌿',
  },
  {
    id: 'skincare',
    name: 'Clean Skincare',
    brand: 'GlowRoot',
    defaultCaption: 'Restoring my skin barrier with botanical extracts every night ✨',
  },
  {
    id: 'ev-bike',
    name: 'EV Bike',
    brand: 'Urban Pedal',
    defaultCaption: 'Cruising through city traffic with zero emissions and pure torque ⚡',
  },
];

export const CITIES = [
  'Chennai',
  'Bengaluru',
  'Mumbai',
  'Delhi-NCR',
];

export const PLATFORMS: PlatformType[] = ['Instagram', 'YouTube'];

export const OBJECTIVES: ('Sales' | 'Awareness')[] = ['Sales', 'Awareness'];

export const CREATORS: Creator[] = [
  {
    id: 'creator-ananya',
    name: 'Ananya R.',
    handle: '@ananya.creates',
    niche: 'Cafe & Food, Lifestyle',
    platform: 'Instagram',
    followerCount: '48K',
    matchPct: 96,
    realFollowerPct: 92,
    engagement: '6.8%',
    rateFactor: 0.9,
    verifiedDeliveries: 14,
  },
  {
    id: 'creator-vikram',
    name: 'Vikram C.',
    handle: '@vikram_visuals',
    niche: 'Design, Tech & Coffee',
    platform: 'Instagram',
    followerCount: '112K',
    matchPct: 88,
    realFollowerPct: 89,
    engagement: '5.9%',
    rateFactor: 0.8,
    verifiedDeliveries: 9,
  },
  {
    id: 'creator-meera',
    name: 'Meera S.',
    handle: '@meera.dailyglam',
    niche: 'Fashion, Viral Trends',
    platform: 'Instagram',
    followerCount: '210K',
    matchPct: 64,
    realFollowerPct: 41,
    engagement: '1.2%',
    rateFactor: 0.6,
    verifiedDeliveries: 3,
    flaggedPct: 59,
  },
];

export const REFEREE_CHECKS: RefereeCheck[] = [
  {
    id: 'live',
    label: 'Post is live',
    failReason: 'Post not found at the submitted link',
  },
  {
    id: 'product',
    label: 'Product visible',
    failReason: 'Product not clearly visible in the first 3 seconds',
  },
  {
    id: 'adlabel',
    label: '#ad label present',
    failReason: 'Required #ad label missing',
  },
  {
    id: 'deadline',
    label: 'Posted before deadline',
    failReason: 'Posted after the agreed deadline',
  },
  {
    id: 'engagement',
    label: 'Engagement looks real',
    failReason: '59% of followers look inactive or bot-like',
  },
];

/**
 * Calculates agreed amount: round to nearest 500 of (budget × rateFactor).
 * Always at or under budget.
 */
export function calculateAgreedAmount(budget: number, rateFactor: number): number {
  const raw = budget * rateFactor;
  return Math.round(raw / 500) * 500;
}
