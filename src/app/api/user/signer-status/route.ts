import { NextRequest, NextResponse } from 'next/server';
import { verifyPrivyToken, getAuthHeader, getSupabase } from '../../auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyPrivyToken(getAuthHeader(req));

    const supabase = getSupabase();
    const { data: user } = await supabase
      .from('users')
      .select('signer_uuid')
      .eq('twitter_id', authUser.twitterId)
      .single();
    if (!user?.signer_uuid) {
      return NextResponse.json({ error: 'Missing users signer uuid'}, { status: 400 });
    }

    const apiKey = process.env.NEYNAR_API_KEY!;
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/signer?signer_uuid=${user.signer_uuid}`,
      { headers: { 'api_key': apiKey } }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch signer status from Neynar');
    }

    const data = await res.json();
    return NextResponse.json({ status: data.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
