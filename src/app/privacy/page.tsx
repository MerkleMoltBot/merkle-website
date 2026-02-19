export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-8">
          <a href="/" className="text-green-400 hover:text-green-300 text-sm">← Back to merkle.bot</a>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: February 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">1. Overview</h2>
            <p>
              This Privacy Policy describes how Merkle (&quot;we&quot;, &quot;us&quot;) collects, uses, and stores information
              when you interact with the @MerkleMoltBot on X or use merkle.bot. We are committed to
              minimizing data collection to only what is necessary to operate the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">2. Information We Collect</h2>
            <p>When you interact with Merkle, we collect and store:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong className="text-white">X (Twitter) account data:</strong> Your Twitter user ID,
                username (handle), and follower count at the time of interaction. We do not store your
                email, phone number, or other personal details from X.
              </li>
              <li>
                <strong className="text-white">Wallet address:</strong> Your Base network wallet address,
                created via Privy&apos;s infrastructure and linked to your X account.
              </li>
              <li>
                <strong className="text-white">Transaction history:</strong> Records of bids you have placed,
                including amounts, URLs bid on, transaction hashes, fees, and timestamps.
              </li>
              <li>
                <strong className="text-white">Tweet interactions:</strong> The tweet IDs and text of
                mentions directed at @MerkleMoltBot, along with our replies. These are used for deduplication
                and rate limiting purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Create and manage your non-custodial wallet on Base</li>
              <li>Execute bid transactions on your behalf on qrcoin.fun</li>
              <li>Display your bid history and wallet balance on the dashboard</li>
              <li>Enforce rate limits and prevent spam/abuse</li>
              <li>Debug issues and improve the service</li>
            </ul>
            <p className="mt-3">
              We do not sell your data, use it for advertising, or share it with third parties except as
              described in Section 5.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">4. Blockchain Data</h2>
            <p>
              All bid transactions are executed on the Base blockchain and are permanently public by nature.
              Your wallet address, bid amounts, and transaction hashes are visible to anyone on the blockchain.
              This is inherent to how public blockchains work and is outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services which may process data on our behalf:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong className="text-white">Privy:</strong> Wallet creation and management infrastructure.
                Privy processes your X OAuth credentials to generate and secure your wallet.
                See <a href="https://privy.io/privacy-policy" className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">Privy&apos;s Privacy Policy</a>.
              </li>
              <li>
                <strong className="text-white">Supabase:</strong> Database storage for user records, bid
                history, and processed tweet logs. Data is stored in encrypted databases.
              </li>
              <li>
                <strong className="text-white">AWS (Amazon Web Services):</strong> Cloud infrastructure
                hosting the bot backend, including Lambda functions and SQS message queues.
              </li>
              <li>
                <strong className="text-white">X (Twitter) API:</strong> We read public tweet mentions
                directed at @MerkleMoltBot via the X API v2.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">6. Data Retention</h2>
            <p>
              We retain your account data (X ID, wallet address) for as long as you have an active wallet
              with us. Transaction history is retained indefinitely for audit and dispute resolution purposes.
              Tweet interaction records are retained for 90 days for rate-limiting purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">7. Your Rights</h2>
            <p>
              You may request deletion of your account data by contacting us via{" "}
              <a href="https://twitter.com/MerkleMoltBot" className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">
                @MerkleMoltBot on X
              </a>. Note that onchain transaction data cannot be deleted as it is permanently recorded on
              the blockchain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">8. Security</h2>
            <p>
              We use industry-standard security measures including encrypted database storage, HTTPS-only
              connections, and Privy&apos;s secure enclave technology for wallet key management. However,
              no system is 100% secure. You are responsible for protecting your X account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the updated policy at
              merkle.bot/privacy with a new &quot;last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-green-400 mb-3">10. Contact</h2>
            <p>
              For privacy-related questions or data deletion requests, contact us via{" "}
              <a href="https://twitter.com/MerkleMoltBot" className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">
                @MerkleMoltBot on X
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-sm text-gray-600">
          <a href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <span>·</span>
          <a href="/privacy" className="text-gray-500">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
