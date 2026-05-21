import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | VikaStore";
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-6">
        <div className="border-b border-gray-100 pb-6 text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">Last updated: May 21, 2026</p>
        </div>

        <div className="text-sm text-gray-600 leading-relaxed space-y-6">
          <p>
            Welcome to VikaStore. Your privacy is critically important to us. This Privacy Policy details how we collect, use, and store information when you visit our website, register an account, and make purchases.
          </p>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">1. Information We Collect</h3>
            <p>We collect personal information that you provide to us, including but not limited to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal details:</strong> Name, email address, password, shipping addresses, and billing details.</li>
              <li><strong>Payment Information:</strong> We do not store raw card numbers. Payments are processed by certified gateways.</li>
              <li><strong>Usage details:</strong> IP address, browser type, pages viewed, and device models.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">2. How We Use Your Information</h3>
            <p>We use the collected information for various purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To register and manage your customer profile.</li>
              <li>To ship, track, and process return/refund workflows.</li>
              <li>To prevent fraud, verify billing details, and improve security.</li>
              <li>To send order notifications and marketing newsletters (which you can opt out of).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">3. Sharing Information with Third Parties</h3>
            <p>
              We only share your information with trusted third-party providers essential for store operations: logistics partners for shipping orders, and payment gateway providers. We do not sell or lease customer database records to marketing firms.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">4. Data Security</h3>
            <p>
              We implement industry-standard encryption protocols (SSL certificates) to safeguard database transmissions. However, no transmission over the internet can be guaranteed as 100% secure. You are responsible for keeping your password secret.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">5. Your Rights</h3>
            <p>
              Under standard consumer laws, you have the right to request access to your data, demand correction of shipping details, or request that your profile be deleted. You can do this by submitting a request via our Contact page.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">If you have questions regarding this Privacy Policy, write to support@vikastore.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
