import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { optimism } from 'viem/chains';
import { getAuthHeader, verifyPrivyUserId } from '@/app/api/auth';

const opClient = createPublicClient({
  chain: optimism,
  transport: http(process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io'),
});

export async function GET(req: NextRequest) {
  try {
    await verifyPrivyUserId(getAuthHeader(req));
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const block = await opClient.getBlock({ blockTag: 'latest' });
    return NextResponse.json({ blockHash: block.hash });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch block hash';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
