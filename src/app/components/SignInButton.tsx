'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export function SignInButton() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();

  if (!ready) return null;

  return (
    <button
      onClick={authenticated ? () => router.push('/dashboard') : login}
      className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
    >
      {authenticated ? 'Dashboard →' : 'Sign In with 𝕏'}
    </button>
  );
}
