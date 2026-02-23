import { NextRequest, NextResponse } from 'next/server';
import { verifyPrivyToken, getSupabase, getAuthHeader } from '../../auth';
import { optimism } from 'viem/chains';

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyPrivyToken(getAuthHeader(req));

    if (authUser.platform !== 'farcaster') {
      return NextResponse.json({ error: 'Only Farcaster users can verify their address' }, { status: 400 });
    }

    const { signature, blockHash } = await req.json();

    if (!signature || !blockHash) {
      return NextResponse.json({ error: 'Missing required fields: signature, blockHash' }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('wallet_address, fc_verified_at, signer_uuid')
      .eq('twitter_id', authUser.twitterId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.fc_verified_at) {
      return NextResponse.json({ alreadyVerified: true });
    }

    if (!user?.signer_uuid) {
      return NextResponse.json({ error: 'Missing users signer uuid'}, { status: 400 });
    }

    const verifyRes = await fetch('https://api.neynar.com/v2/farcaster/user/verification', {
      method: 'POST',
      headers: { 'x-api-key': process.env.NEYNAR_API_KEY!, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signer_uuid: user.signer_uuid,
        address: user.wallet_address,
        block_hash: blockHash,
        eth_signature: signature,
        verification_type: 1,
        chain_id: optimism.id,
      }),
    });

    if (!verifyRes.ok) {
      const err = await verifyRes.text();
      throw new Error(`Neynar verification failed: ${err}`);
    }

    await supabase
      .from('users')
      .update({ fc_verified_at: new Date().toISOString() })
      .eq('twitter_id', authUser.twitterId);

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error('Error trying to verify wallet', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
