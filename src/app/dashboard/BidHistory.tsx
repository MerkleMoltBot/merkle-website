'use client';

interface Bid {
  id: number;
  auction_id: number;
  url: string;
  amount: string;
  tx_hash: string | null;
  status: 'broadcasted' | 'confirmed' | 'execution_reverted' | 'failed' | 'replaced' | 'finalized' | 'provider_error' | 'pending';
  created_at: string;
}

interface BidHistoryProps {
  bids: Bid[];
}

const STATUS_STYLES: Record<Bid['status'], string> = {
  pending: 'bg-yellow-900/50 text-yellow-400',
  broadcasted: 'bg-blue-900/50 text-blue-400',
  confirmed: 'bg-green-900/50 text-green-400',
  finalized: 'bg-green-900/50 text-green-300',
  failed: 'bg-red-900/50 text-red-400',
  execution_reverted: 'bg-red-900/50 text-red-400',
  provider_error: 'bg-orange-900/50 text-orange-400',
  replaced: 'bg-gray-700/50 text-gray-400',
};

const STATUS_LABELS: Record<Bid['status'], string> = {
  pending: 'Pending',
  broadcasted: 'Broadcasted',
  confirmed: 'Confirmed',
  finalized: 'Finalized',
  failed: 'Failed',
  execution_reverted: 'Reverted',
  provider_error: 'Error',
  replaced: 'Replaced',
};

export function BidHistory({ bids }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-green-400/30">
        <h2 className="text-xl font-bold text-green-400 mb-4">Bid History</h2>
        <p className="text-gray-400 text-sm space-y-1">
          No bids yet. Mention{' '}
          <span className="text-green-400 font-mono">@MerkleMoltBot bid [amount] [url]</span> on 𝕏
          {' '}or{' '}
          <span className="text-purple-400 font-mono">@merklebot bid [amount] [url]</span> on Farcaster
          {' '}to place your first bid.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-green-400/30">
      <h2 className="text-xl font-bold text-green-400 mb-4">Bid History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-700">
              <th className="text-left pb-2 pr-4">Auction</th>
              <th className="text-right pb-2 pr-4">Amount</th>
              <th className="text-left pb-2 pr-4">Status</th>
              <th className="text-left pb-2 pr-4">Tx</th>
              <th className="text-right pb-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {bids.map((bid) => (
              <tr key={bid.id} className="text-gray-300">
                <td className="py-2 pr-4">
                  <a
                    href={bid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    #{bid.auction_id}
                  </a>
                </td>
                <td className="py-2 pr-4 text-right font-mono">${bid.amount}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[bid.status] ?? 'bg-gray-700/50 text-gray-400'}`}>
                    {STATUS_LABELS[bid.status] ?? bid.status}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  {bid.tx_hash ? (
                    <a
                      href={`https://basescan.org/tx/${bid.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 underline font-mono text-xs"
                    >
                      {bid.tx_hash.slice(0, 8)}…
                    </a>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="py-2 text-right text-gray-500 text-xs">
                  {new Date(bid.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
