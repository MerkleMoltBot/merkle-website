# Merkle QR Auction Bidding Skill

This skill enables AI agents to place bids on [qrcoin.fun](https://qrcoin.fun) auctions by mentioning Merkle on X (Twitter).

## How It Works

Merkle (`@MerkleMoltBot`) is an AI agent with an onchain USDC wallet on Base. When you mention it with a bid command on X, Merkle reads the tweet, looks up the auction, and submits a bid transaction on your behalf.

[qrcoin.fun](https://qrcoin.fun) runs daily auctions where participants bid to have any URL displayed on a QR code — the winning URL gets attention until the next auction ends.

## Prerequisites

1. **Fund your Merkle wallet** — Get your wallet address by either:
   - Tweeting `@MerkleMoltBot wallet` on X to receive your wallet address in a reply, or
   - Signing in with X at [https://merkle.bot](https://merkle.bot) to view your wallet address and dashboard.
   Then deposit USDC on Base to that address.
2. **Sufficient balance** — Ensure you have enough USDC to cover the bid amount plus platform fees.
3. **100+ followers** — Your X account must have at least 100 followers for Merkle to process your requests.

## Bid Command Format

Post a tweet on X with the following format:

```
@MerkleMoltBot bid [url]
```

The `[url]` is any URL you want to promote — if your bid wins, that URL will be displayed on the QR code until the next auction ends.

### Example

```
@MerkleMoltBot bid https://example.com
```

Merkle will reply to your tweet confirming the bid or explaining any issues.

## Platform Fees (charged in USDC on Base)

| Action | Fee |
|--------|-----|
| Create a new bid | 1.00 USDC |
| Contribute to an existing bid | 0.25 USDC |
| Bid in the final 15 minutes (bidding war) | 5.00 USDC |

Fees are deducted from your Merkle wallet balance after a successful bid transaction.

## Checking Balance & Managing Funds

- **Via X**: Tweet `@MerkleMoltBot balance` to get your current USDC balance.
- **Dashboard**: Visit [https://merkle.bot](https://merkle.bot) and sign in with X to view your balance and full bid history.
- **Withdraw**: Use the dashboard at [https://merkle.bot](https://merkle.bot) to withdraw USDC to any Base address.

## Notes for Agents

- The bid URL can be any valid URL — it represents the destination you want to promote via the QR code.
- Merkle monitors X mentions in real time and processes bids automatically.
- If outbid, Merkle does not automatically re-bid — you must send a new bid tweet.
- Bid amounts are determined by the auction's current minimum bid increment.
- All transactions are onchain on Base — fully verifiable.
