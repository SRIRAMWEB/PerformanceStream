'use client';

import React from 'react';
import { DemoState } from '@/lib/types';
import { PRODUCTS, CITIES, PLATFORMS, OBJECTIVES } from '@/lib/mockData';
import { formatINR } from '@/lib/format';
import { Sparkles, MapPin, Target, Layers } from 'lucide-react';

interface Step1GoalProps {
  state: DemoState;
  onSetProduct: (id: string) => void;
  onSetBudget: (budget: number) => void;
  onSetPlatform: (platform: 'Instagram' | 'YouTube') => void;
  onSetCity: (city: string) => void;
  onSetObjective: (objective: 'Sales' | 'Awareness') => void;
  onFindCreators: () => void;
}

export function Step1Goal({
  state,
  onSetProduct,
  onSetBudget,
  onSetPlatform,
  onSetCity,
  onSetObjective,
  onFindCreators,
}: Step1GoalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          Define Campaign &amp; Budget
        </h2>
        <p className="text-stone-600 text-sm mt-1">
          Select your product category and audience requirements to scan verified creator pools.
        </p>
      </div>

      {/* Product Selection */}
      <div>
        <label className="block text-sm font-semibold text-stone-800 mb-2 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#024E46]" />
          <span>Product Category</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRODUCTS.map((prod) => {
            const isSelected = state.product === prod.id;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => onSetProduct(prod.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#024E46] bg-[#024E46]/10 ring-2 ring-[#024E46]/20'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="font-semibold text-stone-900 text-sm">{prod.name}</div>
                <div className="text-[13px] text-stone-500">{prod.brand}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Slider */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="budget-slider" className="text-sm font-semibold text-stone-800">
            Campaign Budget
          </label>
          <span className="text-xl font-bold text-[#024E46]">
            {formatINR(state.budget)}
          </span>
        </div>
        <input
          id="budget-slider"
          type="range"
          min={15000}
          max={150000}
          step={5000}
          value={state.budget}
          onChange={(e) => onSetBudget(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#024E46]"
        />
        <div className="flex justify-between text-[13px] text-stone-500 font-medium">
          <span>₹15,000</span>
          <span>₹1,50,000</span>
        </div>
      </div>

      {/* Platform & Objective & City Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Platform */}
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-2">Platform</label>
          <div className="flex rounded-xl p-1 bg-stone-100 border border-stone-200">
            {PLATFORMS.map((plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => onSetPlatform(plat)}
                className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${
                  state.platform === plat
                    ? 'bg-white text-[#024E46] shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-2 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-stone-500" />
            <span>Objective</span>
          </label>
          <div className="flex rounded-xl p-1 bg-stone-100 border border-stone-200">
            {OBJECTIVES.map((obj) => (
              <button
                key={obj}
                type="button"
                onClick={() => onSetObjective(obj)}
                className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${
                  state.objective === obj
                    ? 'bg-white text-[#024E46] shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {obj}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city-select" className="block text-sm font-semibold text-stone-800 mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>Focus City</span>
          </label>
          <select
            id="city-select"
            value={state.city}
            onChange={(e) => onSetCity(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#024E46]"
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onFindCreators}
          className="btn-primary w-full py-3.5 text-base justify-center rounded-2xl shadow-md"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          <span>Find Verified Creators</span>
        </button>
      </div>
    </div>
  );
}
