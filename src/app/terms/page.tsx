export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-8">
          <a href="/" className="text-green-400 hover:text-green-300 text-sm">← Back to merkle.bot</a>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: February 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">1. Acceptance of Terms</h2>
            <p>
              By interacting with the Merkle bot (@MerkleMoltBot) on X (Twitter) or using the merkle.bot
              website, you agree to these Terms of Service. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">2. Description of Service</h2>
            <p>
              Merkle is an autonomous AI agent that enables users to participate in{" "}
              <a href="https://qrcoin.fun" className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">qrcoin.fun</a>{" "}
              auctions via tweets on X. The service:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Creates a non-custodial USDC wallet on Base for each user</li>
              <li>Executes bids on your behalf when instructed via tweet</li>
              <li>Charges platform fees per transaction (see Section 4)</li>
              <li>Provides a web dashboard at merkle.bot for wallet management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years old and comply with all applicable laws in your jurisdiction to use
              this service. Use of this service to interact with cryptocurrency protocols may be prohibited in
              certain jurisdictions. You are solely responsible for determining whether your use is lawful.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">4. Platform Fees</h2>
            <p>The following platform fees apply to all bid transactions:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-white">1.00 USDC</strong> — creating a new bid on a URL</li>
              <li><strong className="text-white">0.25 USDC</strong> — contributing to an existing bid</li>
              <li><strong className="text-white">5.00 USDC</strong> — any bid placed in the final 15 minutes of an auction (last-minute bidding war)</li>
            </ul>
            <p className="mt-3">
              Fees are deducted from your wallet in USDC on Base after a successful bid transaction is confirmed
              onchain. Fees are non-refundable. No fee is charged if a transaction fails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">5. Wallet & Funds</h2>
            <p>
              Wallets are created and managed via Privy&apos;s embedded wallet infrastructure. You are responsible
              for securing access to your wallet. Merkle acts as an authorized signer on your behalf for
              qrcoin.fun auction transactions only.
            </p>
            <p className="mt-3">
              Deposits and withdrawals are managed through the merkle.bot dashboard. You must connect via X
              authentication to access your wallet. We do not hold custody of your funds — the wallet is
              non-custodial and onchain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">6. No Financial Advice</h2>
            <p>
              Nothing in this service constitutes financial, investment, or legal advice. Participating in
              auctions and holding cryptocurrency involves significant risk, including total loss of funds.
              You use this service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">7. Rate Limits & Eligibility</h2>
            <p>
              To prevent spam and abuse, the service enforces rate limits including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>A minimum follower requirement on X to interact with the bot</li>
              <li>A cooldown period between consecutive bids</li>
              <li>A daily limit on non-bid interactions</li>
            </ul>
            <p className="mt-3">
              We reserve the right to block or ignore interactions from accounts that appear to be bots,
              spam accounts, or that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">8. Disclaimers & Limitation of Liability</h2>
            <p>
              The service is provided &quot;as is&quot; without warranties of any kind. We are not liable for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Failed transactions or missed auction bids due to network congestion or technical issues</li>
              <li>Loss of funds due to smart contract bugs, blockchain forks, or protocol changes</li>
              <li>Unauthorized access to your wallet if your X account is compromised</li>
              <li>Actions taken by qrcoin.fun or any third-party protocol</li>
            </ul>
            <p className="mt-3">
              To the maximum extent permitted by law, our total liability shall not exceed the platform fees
              paid by you in the 30 days preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">9. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the service after changes are posted
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">10. Contact</h2>
            <p>
              For questions or concerns, reach out via{" "}
              <a href="https://twitter.com/MerkleMoltBot" className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">
                @MerkleMoltBot on X
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-sm text-gray-600">
          <a href="/terms" className="text-gray-500">Terms of Service</a>
          <span>·</span>
          <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
