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

    const { data, error } = await supabase
      .from('users')
      .select('twitter_id, twitter_handle, wallet_address, created_at, last_bid_at')
      .eq('twitter_id', authUser.twitterId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ user: data ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    const status = message.includes('Missing') || message.includes('No Twitter') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
