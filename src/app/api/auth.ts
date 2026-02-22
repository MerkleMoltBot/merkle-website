import { PrivyClient } from '@privy-io/node';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

// Extracts the Bearer token from the Authorization header, falling back to the
// `privy-token` HttpOnly cookie (set automatically when Privy cookie mode is enabled).
export function getAuthHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token && token !== 'null' && token !== 'undefined') return authHeader;
  const cookieToken = req.cookies.get('privy-token')?.value;
  return cookieToken ? `Bearer ${cookieToken}` : null;
}

export function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

let privyClient: PrivyClient | null = null;

export function getPrivyClient(): PrivyClient {
  if (!privyClient) {
    privyClient = new PrivyClient({
      appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      appSecret: process.env.PRIVY_APP_SECRET!,
      ...(process.env.PRIVY_CLIENT_ID && { clientId: process.env.PRIVY_CLIENT_ID }),
    });
  }
  return privyClient;
}

export interface AuthenticatedUser {
  privyUserId: string;
  twitterId: string;
  twitterHandle: string;
}

// Lightweight: only verifies the JWT, no extra Privy API call.
// Use this in routes that look up users by privy_user_id.
export async function verifyPrivyUserId(
  authHeader: string | null
): Promise<string> {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  const privy = getPrivyClient();
  const claims = await privy.utils().auth().verifyAccessToken(token);
  return claims.user_id;
}

// Full verification: fetches linked accounts from Privy.
// Use this in routes that need the user's Twitter ID.
export async function verifyPrivyToken(
  authHeader: string | null
): Promise<AuthenticatedUser> {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  const privy = getPrivyClient();

  const claims = await privy.utils().auth().verifyAccessToken(token);
  const user = await privy.users()._get(claims.user_id);

  const twitterAccount = user.linked_accounts.find((a) => a.type === 'twitter_oauth');
  if (twitterAccount?.type === 'twitter_oauth') {
    return {
      privyUserId: claims.user_id,
      twitterId: twitterAccount.subject,
      twitterHandle: twitterAccount.username ?? '',
    };
  }

  const farcasterAccount = user.linked_accounts.find((a) => a.type === 'farcaster');
  if (farcasterAccount?.type === 'farcaster') {
    return {
      privyUserId: claims.user_id,
      twitterId: `fc:${farcasterAccount.fid}`,
      twitterHandle: farcasterAccount.username ?? '',
    };
  }

  throw new Error('No Twitter or Farcaster account linked to this user');
}
