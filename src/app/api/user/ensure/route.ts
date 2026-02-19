import { NextRequest, NextResponse } from 'next/server';
import { verifyPrivyToken, getSupabase, getPrivyClient, getAuthHeader } from '../../auth';

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyPrivyToken(getAuthHeader(req));
    const supabase = getSupabase();

    // Check if user already exists
    const { data: existing, error: lookupError } = await supabase
      .from('users')
      .select('twitter_id, wallet_address')
      .eq('twitter_id', authUser.twitterId)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') throw lookupError;

    if (existing) {
      return NextResponse.json({ user: existing, created: false });
    }

    // New user — create a user-owned wallet with the server auth key as additional signer
    const privy = getPrivyClient();
    const wallet = await privy.wallets().create({
      chain_type: 'ethereum',
      owner: { user_id: authUser.privyUserId },
      additional_signers: [
        { signer_id: process.env.PRIVY_AUTHORIZATION_KEY_ID!, override_policy_ids: [process.env.PRIVY_AUTHORIZATION_POLICY_ID!] },
      ],
    });

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        twitter_id: authUser.twitterId,
        twitter_handle: authUser.twitterHandle,
        privy_user_id: authUser.privyUserId,
        wallet_address: wallet.address,
        wallet_id: wallet.id,
      })
      .select('twitter_id, wallet_address')
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ user: newUser, created: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = message.includes('Missing') || message.includes('No Twitter') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
