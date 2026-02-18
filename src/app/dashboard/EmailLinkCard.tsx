'use client';

import { usePrivy, useLinkAccount } from '@privy-io/react-auth';

export function EmailLinkCard() {
  const { user } = usePrivy();
  const { linkEmail } = useLinkAccount();

  const emailAccount = user?.linkedAccounts.find((a) => a.type === 'email');

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-green-400/30">
      <h2 className="text-xl font-bold text-green-400 mb-4">Account Recovery</h2>
      {emailAccount && emailAccount.type === 'email' ? (
        <div className="space-y-2">
          <p className="text-gray-300 text-sm">Email linked for recovery:</p>
          <p className="text-green-400 font-mono text-sm">{emailAccount.address}</p>
          <p className="text-gray-500 text-xs">
            You can use this email to recover your account if you lose access to 𝕏.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">
            Link an email address so you can recover your account even if you lose access to your 𝕏 account.
          </p>
          <button
            onClick={linkEmail}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Link Email Address
          </button>
        </div>
      )}
    </div>
  );
}
