import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPublicClient, http, erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { verifyPrivyToken } from '../../auth';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913' as const;

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

function getPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL ?? 'https://mainnet.base.org'),
  });
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyPrivyToken(req.headers.get('Authorization'));
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('twitter_id', authUser.twitterId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data?.wallet_address) {
      return NextResponse.json({ walletAddress: null, balance: null });
    }

    const publicClient = getPublicClient();
    const rawBalance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [data.wallet_address as `0x${string}`],
    });

    const balance = (Number(rawBalance) / 1e6).toFixed(2);

    return NextResponse.json({
      walletAddress: data.wallet_address,
      balance,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = message.includes('Missing') || message.includes('No Twitter') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
