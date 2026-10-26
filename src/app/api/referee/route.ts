import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caption, hasAdLabel, isHighRiskCreator, simulateFailure } = body;

    // Optional LLM Vision Referee simulation route
    const results = {
      post_live: 'passed',
      product_shown: simulateFailure ? 'failed' : 'passed',
      ad_label_present: hasAdLabel ? 'passed' : 'failed',
      deadline_met: 'passed',
      real_engagement: isHighRiskCreator ? 'failed' : 'passed',
      timestamp: new Date().toISOString(),
      verified: !simulateFailure && hasAdLabel && !isHighRiskCreator,
    };

    return NextResponse.json({ success: true, checks: results });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Referee check failed, falling back to mock' },
      { status: 500 }
    );
  }
}
