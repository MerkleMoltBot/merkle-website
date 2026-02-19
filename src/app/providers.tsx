'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

  if (!appId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        loginMethods: ['twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#4ade80',
          logo: 'https://merkle.bot/merkle-avatar.png',
        },
        embeddedWallets: { ethereum: { createOnLogin: 'off' } },
        defaultChain: base,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
