# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server at https://merkle.local:443 (HTTPS required)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

This is a Next.js 16 app using the App Router for a crypto bidding platform on Base network. Users authenticate via Twitter (through Privy), get auto-provisioned embedded wallets, and can view bid history / withdraw USDC.

### Key Data Flow

1. **Auth**: Privy handles Twitter OAuth → on new login, `/api/user/ensure` creates a Privy embedded wallet with a server-auth key as additional signer, stores user in Supabase
2. **Dashboard**: reads wallet from Privy user object (no API call), fetches USDC balance on-chain via viem, fetches bid history from `/api/user/bids`
3. **Withdrawals**: client encodes ERC20 `transfer()` call, sends via Privy `sendTransaction` with `sponsor: true` (gas-sponsored on Base)

### API Auth Pattern

`/src/app/api/auth.ts` provides two helpers:
- `verifyPrivyUserId()` — JWT-only verification (lightweight)
- `verifyPrivyToken()` — JWT + Privy API call to get Twitter account details

Token is read from the `Authorization` header or `privy-token` HttpOnly cookie.

### Stack

| Concern | Solution |
|---|---|
| Auth & embedded wallets | Privy (`@privy-io/react-auth`, `@privy-io/node`) |
| Database | Supabase (`@supabase/supabase-js`) |
| Blockchain reads/encoding | viem (Base mainnet, chain ID 8453) |
| Styling | Tailwind CSS v4 |
| Deployment | AWS Amplify (`amplify.yml`) |

### Environment Variables

See `.env.example`. Server-side secrets (`PRIVY_APP_SECRET`, `PRIVY_AUTHORIZATION_*`, `SUPABASE_SERVICE_KEY`) are only used in API routes. Only `NEXT_PUBLIC_PRIVY_APP_ID` is exposed to the client.

In Amplify, `NEXT_PUBLIC_PRIVY_APP_ID` comes from env vars and the rest are deserialized from AWS Secrets Manager via Python in the pre-build step.

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
