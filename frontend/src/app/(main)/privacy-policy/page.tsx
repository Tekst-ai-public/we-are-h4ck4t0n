'use client';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        This Privacy Policy describes how CMOD collects, uses, and shares information when you use our
        website or services.
      </p>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Information We Collect</h2>
        <p>
          When you visit our website or use our services, we may collect certain information
          automatically, including:
        </p>
        <ul className="list-disc pl-4">
          <li>Your IP address</li>
          <li>Browser type</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Time spent on each page</li>
          <li>Referring website addresses</li>
        </ul>
        <p className="mt-2">
          We collect this information to analyze trends, administer the site, track users movements
          around the site, and gather demographic information about our user base as a whole. We do not
          link this automatically collected data to personally identifiable information.
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Data Retention</h2>
        <p>
          We will retain your information for as long as necessary for the purposes set out in this
          Privacy Policy, unless a longer retention period is required or permitted by law.
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Your Rights</h2>
        <p>
          You have the right to access personal information we hold about you and to ask that your
          personal information be corrected, updated, or deleted. If you would like to exercise this
          right, please contact us through the contact information below.
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Changes to Our Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page.
        </p>
      </div>
    </div>
  );
}
