import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';
import { verifyPrivyToken, getSupabase, getAuthHeader } from '../../auth';

function getNeynarClient() {
  return new NeynarAPIClient(new Configuration({ apiKey: process.env.NEYNAR_API_KEY! }));
}

export async function POST(req: NextRequest) {
  try {

    const authUser = await verifyPrivyToken(getAuthHeader(req));

    if (authUser.platform !== 'farcaster') {
      return NextResponse.json({ error: 'Only Farcaster users can register a signer' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Return the existing signer UUID if one is already registered for this user
    const { data: existing } = await supabase
      .from('users')
      .select('signer_uuid')
      .eq('twitter_id', authUser.twitterId)
      .single();

    if (existing?.signer_uuid) {
      return NextResponse.json({ hasSigner: true });
    }

    const client = getNeynarClient();

    // Creates a signer, looks up the app FID from the mnemonic's custody address,
    // signs the key request, and registers it — all in one SDK call.
    const signer = await client.createSignerAndRegisterSignedKey({
      farcasterDeveloperMnemonic: process.env.FARCASTER_APP_MNEMONIC!,
    });

    if (!signer) {
      throw new Error('Failed to create and register signer');
    }

    await supabase
      .from('users')
      .update({ signer_uuid: signer.signer_uuid })
      .eq('twitter_id', authUser.twitterId);

    return NextResponse.json({ approvalUrl: signer.signer_approval_url });
  } catch (err) {
    console.error('[register-signer]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = message.includes('Missing') || message.includes('Only Farcaster') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
