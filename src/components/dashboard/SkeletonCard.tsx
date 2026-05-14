"use client";

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white border border-border rounded-[2rem] p-6 flex flex-col h-full min-h-[320px] animate-pulse relative">
      <div className="absolute top-6 right-6 w-20 h-7 bg-surface rounded-[10px]" />

      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-surface rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2 pt-2 pr-16">
          <div className="h-5 bg-surface rounded-full w-3/4" />
          <div className="h-4 bg-surface rounded-full w-1/2" />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="h-8 w-24 bg-surface rounded-lg" />
        <div className="h-8 w-24 bg-surface rounded-lg" />
      </div>

      <div className="space-y-3 mb-8">
        <div className="h-3 bg-surface rounded-full w-1/4 mb-2" />
        <div className="h-3 bg-surface rounded-full w-full" />
        <div className="h-3 bg-surface rounded-full w-5/6" />
      </div>

      <div className="mt-auto flex gap-3">
        <div className="flex-1 h-[46px] bg-surface rounded-2xl" />
        <div className="flex-1 h-[46px] bg-surface rounded-2xl" />
      </div>
    </div>
  );
}
