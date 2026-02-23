'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createPublicClient, http, erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { WalletCard } from './WalletCard';
import { BidHistory } from './BidHistory';
import { EmailLinkCard } from './EmailLinkCard';
import { WithdrawForm } from './WithdrawForm';
import { FarcasterVerifyCard } from './FarcasterVerifyCard';
import { FarcasterIcon } from '../components/FarcasterIcon';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

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
  const [balance, setBalance] = useState<string | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [fcVerifiedAt, setFcVerifiedAt] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  // Keep wallet address in sync when Privy user updates (covers returning users)
  useEffect(() => {
    const embeddedWallet = user?.linkedAccounts.find(
      (a) => a.type === 'wallet' && 'walletClientType' in a && a.walletClientType === 'privy'
    );
    const addr = 'address' in (embeddedWallet ?? {}) ? (embeddedWallet as { address: string }).address : null;
    if (addr) setWalletAddress(addr);
  }, [user]);

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      const rawBalance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [addr as `0x${string}`],
      });
      setBalance((Number(rawBalance) / 1e6).toFixed(2));
    } catch {
      setBalance(null);
    }
  }, []);

  const fetchBids = useCallback(async () => {
    if (!authenticated) return;
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/user/bids', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBids(data.bids ?? []);
      }
    } catch {
      // leave bids empty
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    if (!authenticated) return;
    setLoadingData(true);

    const loadData = async () => {
      const token = await getAccessToken();
      // Always fetch wallet address from DB — Privy's React client doesn't
      // reflect server-side wallet creation until the next session refresh.
      const [ensureRes] = await Promise.all([
        fetch('/api/user/ensure', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetchBids(),
      ]);

      if (ensureRes.ok) {
        const data = await ensureRes.json();
        const addr: string | null = data.user?.wallet_address ?? null;
        if (addr) {
          setWalletAddress(addr);
          await fetchBalance(addr);
        }
        setFcVerifiedAt(data.user?.fc_verified_at ?? null);
      }
    };

    loadData().finally(() => setLoadingData(false));
  }, [authenticated, getAccessToken, fetchBalance, fetchBids]);

  const handleWithdrawSuccess = useCallback(() => {
    if (walletAddress) fetchBalance(walletAddress);
    fetchBids();
  }, [fetchBalance, fetchBids, walletAddress]);

  const twitterAccount = user?.linkedAccounts.find((a) => a.type === 'twitter_oauth');
  const farcasterAccount = user?.linkedAccounts.find((a) => a.type === 'farcaster');
  const connectedPlatform = twitterAccount ? 'twitter' : farcasterAccount ? 'farcaster' : null;
  const displayHandle = twitterAccount
    ? `@${twitterAccount.username}`
    : farcasterAccount
      ? `@${farcasterAccount.username}`
      : null;

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
              {displayHandle && (
                <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                  {connectedPlatform === 'twitter' && (
                    <span className="text-gray-300 font-semibold">𝕏</span>
                  )}
                  {connectedPlatform === 'farcaster' && (
                    <FarcasterIcon className="w-4 h-4 flex-shrink-0" />
                  )}
                  {displayHandle}
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

          {/* How to Bid */}
          <div className="mb-8 bg-gray-800/40 border border-green-400/20 rounded-lg px-5 py-4 text-sm text-gray-400">
            <p className="text-green-400 font-semibold mb-2">How to bid</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-semibold text-base leading-none">𝕏</span>
                <span className="font-mono text-gray-300">@MerkleMoltBot bid [amount] [url]</span>
              </div>
              <div className="flex items-center gap-2">
                <FarcasterIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-mono text-gray-300">@merklebot bid [amount] [url]</span>
              </div>
            </div>
          </div>

          {loadingData ? (
            <div className="text-green-400 font-mono text-center py-12">Loading your data…</div>
          ) : (
            <div className="space-y-6">
              {/* Top row: Wallet + Email linking */}
              <div className="grid md:grid-cols-2 gap-6">
                <WalletCard
                  walletAddress={walletAddress}
                  balance={balance}
                />
                <EmailLinkCard />
              </div>

              {/* Farcaster verification — shown only to Farcaster users with a wallet */}
              {connectedPlatform === 'farcaster' && walletAddress && (
                <FarcasterVerifyCard
                  getAccessToken={getAccessToken}
                  fcVerifiedAt={fcVerifiedAt}
                  walletAddress={walletAddress}
                />
              )}

              {/* Withdraw */}
              {walletAddress && (
                <WithdrawForm
                  balance={balance}
                  onWithdrawSuccess={handleWithdrawSuccess}
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
