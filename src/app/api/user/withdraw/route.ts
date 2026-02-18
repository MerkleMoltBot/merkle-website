import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PrivyClient } from '@privy-io/node';
import { encodeFunctionData, erc20Abi, parseUnits, isAddress } from 'viem';
import { verifyPrivyToken } from '../../auth';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913' as const;

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

let privyClient: PrivyClient | null = null;
function getPrivyClient(): PrivyClient {
  if (!privyClient) {
    privyClient = new PrivyClient({
      appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      appSecret: process.env.PRIVY_APP_SECRET!,
    });
  }
  return privyClient;
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyPrivyToken(req.headers.get('Authorization'));

    const body = await req.json();
    const { toAddress, amount } = body as { toAddress: string; amount: string };

    if (!toAddress || !isAddress(toAddress)) {
      return NextResponse.json({ error: 'Invalid destination address' }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('wallet_address, wallet_id')
      .eq('twitter_id', authUser.twitterId)
      .single();

    if (error || !data?.wallet_id) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const privy = getPrivyClient();
    const amountRaw = parseUnits(amount, 6);
    const txData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [toAddress as `0x${string}`, amountRaw],
    });

    const result = await privy.wallets().ethereum().sendTransaction(data.wallet_id, {
      caip2: 'eip155:8453',
      params: {
        transaction: {
          to: USDC_ADDRESS,
          data: txData,
          chain_id: 8453,
        },
      },
      authorization_context: {
        authorization_private_keys: [process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY!],
      },
    });

    return NextResponse.json({ txHash: result.hash });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = message.includes('Missing') || message.includes('No Twitter') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
