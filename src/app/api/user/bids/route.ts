import { NextRequest, NextResponse } from 'next/server';
import { verifyPrivyUserId, getSupabase, getAuthHeader } from '../../auth';

export async function GET(req: NextRequest) {
  try {
    const privyUserId = await verifyPrivyUserId(getAuthHeader(req));
    const supabase = getSupabase();

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('twitter_id')
      .eq('privy_user_id', privyUserId)
      .single();

    if (userError && userError.code !== 'PGRST116') throw userError;
    if (!userData?.twitter_id) {
      return NextResponse.json({ bids: [], total: 0 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 100);
    const offset = Number(searchParams.get('offset') ?? '0');

    const { data, error, count } = await supabase
      .from('bids')
      .select('id, auction_id, url, amount, tx_hash, status, created_at', { count: 'exact' })
      .eq('twitter_id', userData.twitter_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ bids: data ?? [], total: count ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = message.includes('Missing') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
