import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyPrivyToken } from '../../auth';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyPrivyToken(req.headers.get('Authorization'));
    const supabase = getSupabase();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 100);
    const offset = Number(searchParams.get('offset') ?? '0');

    const { data, error, count } = await supabase
      .from('bids')
      .select('id, auction_id, url, amount, tx_hash, status, created_at', { count: 'exact' })
      .eq('twitter_id', authUser.twitterId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ bids: data ?? [], total: count ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = message.includes('Missing') || message.includes('No Twitter') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
