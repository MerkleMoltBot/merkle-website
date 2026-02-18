'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WalletCard } from './WalletCard';
import { BidHistory } from './BidHistory';
import { EmailLinkCard } from './EmailLinkCard';
import { WithdrawForm } from './WithdrawForm';

interface WalletData {
  walletAddress: string | null;
  balance: string | null;
}

interface Bid {
  id: number;
  auction_id: number;
  url: string;
  amount: string;
  tx_hash: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export default function DashboardPage() {
  const { ready, authenticated, user, logout, getAccessToken } = usePrivy();
  const router = useRouter();
  const [walletData, setWalletData] = useState<WalletData>({ walletAddress: null, balance: null });
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  const fetchData = useCallback(async () => {
    if (!authenticated) return;
    setLoadingData(true);
    try {
      const token = await getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [walletRes, bidsRes] = await Promise.all([
        fetch('/api/user/wallet', { headers }),
        fetch('/api/user/bids', { headers }),
      ]);

      if (walletRes.ok) {
        const data = await walletRes.json();
        setWalletData({ walletAddress: data.walletAddress, balance: data.balance });
      }

      if (bidsRes.ok) {
        const data = await bidsRes.json();
        setBids(data.bids ?? []);
      }
    } finally {
      setLoadingData(false);
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const twitterAccount = user?.linkedAccounts.find((a) => a.type === 'twitter_oauth');

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <div className="text-green-400 font-mono">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Dashboard <span className="text-green-400">🌿</span>
              </h1>
              {twitterAccount && twitterAccount.type === 'twitter_oauth' && (
                <p className="text-gray-400 text-sm mt-1">
                  @{twitterAccount.username}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Home
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {loadingData ? (
            <div className="text-green-400 font-mono text-center py-12">Loading your data…</div>
          ) : (
            <div className="space-y-6">
              {/* Top row: Wallet + Email linking */}
              <div className="grid md:grid-cols-2 gap-6">
                <WalletCard
                  walletAddress={walletData.walletAddress}
                  balance={walletData.balance}
                />
                <EmailLinkCard />
              </div>

              {/* Withdraw */}
              {walletData.walletAddress && (
                <WithdrawForm
                  balance={walletData.balance}
                  onWithdrawSuccess={fetchData}
                />
              )}

              {/* Bid History */}
              <BidHistory bids={bids} />
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-green-400 font-mono text-sm">
            <p>Hash by hash, block by block. 🌿</p>
          </div>
        </div>
      </div>
    </div>
  );
}
