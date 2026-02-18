import { PrivyClient } from '@privy-io/node';

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

export interface AuthenticatedUser {
  privyUserId: string;
  twitterId: string;
  twitterHandle: string;
}

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

  const twitterAccount = user.linked_accounts.find(
    (a) => a.type === 'twitter_oauth'
  );

  if (!twitterAccount || twitterAccount.type !== 'twitter_oauth') {
    throw new Error('No Twitter account linked to this user');
  }

  return {
    privyUserId: claims.user_id,
    twitterId: twitterAccount.subject,
    twitterHandle: twitterAccount.username ?? '',
  };
}
