'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { QRCodeSVG } from 'qrcode.react';
import { hashTypedData } from 'viem';
import { optimism } from 'viem/chains';
import { FarcasterIcon } from '../components/FarcasterIcon';

const SESSION_KEY = 'fc_signer_pending';

const EIP_712_FARCASTER_DOMAIN = {
  name: 'Farcaster Verify Ethereum Address',
  version: '2.0.0',
  salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558' as `0x${string}`,
} as const;

const EIP_712_FARCASTER_VERIFICATION_CLAIM = [
  { name: 'fid', type: 'uint256' },
  { name: 'address', type: 'address' },
  { name: 'blockHash', type: 'bytes32' },
  { name: 'network', type: 'uint8' },
] as const;

interface FarcasterVerifyCardProps {
  getAccessToken: () => Promise<string | null>;
  fcVerifiedAt: string | null;
  walletAddress: string | null;
}

type CardState = 'idle' | 'registering' | 'pending_approval' | 'polling' | 'verifying' | 'verified' | 'error';

export function FarcasterVerifyCard({ getAccessToken, fcVerifiedAt, walletAddress }: FarcasterVerifyCardProps) {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const [state, setState] = useState<CardState>(fcVerifiedAt ? 'verified' : 'idle');
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // On mount, resume polling if a pending signer was saved in sessionStorage
  useEffect(() => {
    if (fcVerifiedAt) return;
    if (sessionStorage.getItem(SESSION_KEY)) setState('polling');
  }, [fcVerifiedAt]);

  const submitVerification = useCallback(async () => {
    setState('verifying');
    try {
      // 1. Fetch a recent OP mainnet block hash from the server
      const blockHashRes = await fetch('/api/user/block-hash');
      if (!blockHashRes.ok) throw new Error('Failed to fetch block hash');
      const { blockHash } = await blockHashRes.json() as { blockHash: `0x${string}` };

      // 2. Get the FID from the linked Farcaster account
      const farcasterAccount = user?.linkedAccounts.find(a => a.type === 'farcaster');
      if (!farcasterAccount || farcasterAccount.type !== 'farcaster') {
        throw new Error('Farcaster account not found');
      }

      // 3. Get the Privy embedded wallet's EIP-1193 provider
      const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
      if (!embeddedWallet) throw new Error('Embedded wallet not found');
      const provider = await embeddedWallet.getEthereumProvider();

      // 4. Hash the EIP-712 typed data locally (viem handles BigInt natively)
      const typedDataHash = hashTypedData({
        domain: { ...EIP_712_FARCASTER_DOMAIN, chainId: optimism.id },
        types: { VerificationClaim: EIP_712_FARCASTER_VERIFICATION_CLAIM },
        primaryType: 'VerificationClaim',
        message: {
          fid: BigInt(farcasterAccount.fid == null ? 0 : farcasterAccount.fid as unknown as bigint),
          address: walletAddress as `0x${string}`,
          blockHash,
          network: 1,
        },
      });

      // 5. Sign the hash with secp256k1_sign (no prefix, no server auth key needed)
      const signature = await provider.request({
        method: 'secp256k1_sign',
        params: [typedDataHash],
      }) as `0x${string}`;

      // 6. Submit signature + block hash to the server for Neynar submission
      const token = await getAccessToken();
      const res = await fetch('/api/user/verify-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ signature, blockHash }),
      });

      const data = await res.json();
      if (res.ok && (data.verified || data.alreadyVerified)) {
        sessionStorage.removeItem(SESSION_KEY);
        setState('verified');
      } else {
        setErrorMsg(data.error ?? 'Verification failed');
        setState('error');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Verification failed');
      setState('error');
    }
  }, [getAccessToken, user, wallets, walletAddress]);

  // Poll Neynar until the signer is approved
  useEffect(() => {
    if (state !== 'polling') return;

    const poll = async () => {
      if (!sessionStorage.getItem(SESSION_KEY)) { setState('idle'); return; }

      try {
        const token = await getAccessToken();
        const res = await fetch('/api/user/signer-status', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.status === 'approved') {
          await submitVerification();
        }
      } catch {
        // keep polling
      }
    };

    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [state, getAccessToken, submitVerification]);

  async function handleRegister() {
    setState('registering');
    setErrorMsg(null);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/user/register-signer', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Failed to register signer');
        setState('error');
        return;
      }

      sessionStorage.setItem(SESSION_KEY, '1');
      setApprovalUrl(data.approvalUrl);
      setState('pending_approval');
      setTimeout(() => setState('polling'), 500);
    } catch {
      setErrorMsg('Network error — please try again');
      setState('error');
    }
  }

  if (!walletAddress) return null;

  if (state === 'verified') {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-400/30">
        <div className="flex items-center gap-2 mb-2">
          <FarcasterIcon className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-purple-400">Farcaster Verified</h2>
        </div>
        <p className="text-gray-400 text-sm">
          Your wallet is linked as a verified address on your Farcaster profile. Your PFP will appear on the qrcoin.fun leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-400/30">
      <div className="flex items-center gap-2 mb-2">
        <FarcasterIcon className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-purple-400">Link to Farcaster</h2>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Link your Merkle wallet as a verified address on Farcaster so your PFP appears on the qrcoin.fun leaderboard.
      </p>

      {state === 'idle' && (
        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
        >
          Link Wallet
        </button>
      )}

      {state === 'registering' && (
        <p className="text-purple-400 text-sm font-mono">Creating signer…</p>
      )}

      {(state === 'pending_approval' || state === 'polling') && approvalUrl && (
        <div className="space-y-4">
          <div className="inline-block p-3 bg-white rounded-lg">
            <QRCodeSVG value={approvalUrl} size={180} />
          </div>
          <p className="text-gray-400 text-xs">
            Scan with your phone to approve in Warpcast.
          </p>
          <a
            href={approvalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
          >
            Or open in Warpcast →
          </a>
          {state === 'polling' && (
            <p className="text-gray-500 text-xs">Waiting for approval…</p>
          )}
        </div>
      )}

      {state === 'polling' && !approvalUrl && (
        <p className="text-purple-400 text-sm font-mono">Waiting for approval…</p>
      )}

      {state === 'verifying' && (
        <p className="text-purple-400 text-sm font-mono">Submitting verification…</p>
      )}

      {state === 'error' && (
        <div className="space-y-3">
          <p className="text-red-400 text-sm">{errorMsg}</p>
          <button
            onClick={() => { setState('idle'); setErrorMsg(null); }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
