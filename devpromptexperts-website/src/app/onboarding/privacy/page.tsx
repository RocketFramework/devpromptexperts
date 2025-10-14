// pages/privacy.tsx
export default function Privacy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Last updated: October 14, 2025
      </p>

      <section className="space-y-6">
        <p className="leading-relaxed">
          This Privacy Policy explains how <span className="font-semibold">DevPrompt Experts</span> collects,
          uses, and protects your personal information when you sign in with
          LinkedIn or use our services.
        </p>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Information We Collect
          </h2>
          <p className="leading-relaxed text-gray-700">
            We collect your <span className="font-medium">name</span>, <span className="font-medium">title</span>, <span className="font-medium">location</span>, <span className="font-medium">about</span>, 
            <span className="font-medium"> experience</span>, and <span className="font-medium">education</span> from your LinkedIn profile upon consent.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Use of Information
          </h2>
          <p className="leading-relaxed text-gray-700">
            We use your information for account creation, verification, and to
            display your professional profile on the platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Data Sharing
          </h2>
          <p className="leading-relaxed text-gray-700">
            We do not sell your data or share it with service providers. We
            only display your professional experience to customers so they can
            understand your capabilities.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Data Retention and Deletion
          </h2>
          <p className="leading-relaxed text-gray-700">
            You may request deletion of your data at any time by contacting us at{" "}
            <a
              href="mailto:support@devpromptexperts.com"
              className="text-blue-600 hover:underline"
            >
              support@devpromptexperts.com
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Contact
          </h2>
          <p className="leading-relaxed text-gray-700">
            For privacy inquiries, contact:{" "}
            <a
              href="mailto:support@devpromptexperts.com"
              className="text-blue-600 hover:underline"
            >
              support@devpromptexperts.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
