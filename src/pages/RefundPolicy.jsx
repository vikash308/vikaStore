import { useEffect } from 'react';

export default function RefundPolicy() {
  useEffect(() => {
    document.title = "Refund Policy | VikaStore";
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-6">
        <div className="border-b border-gray-100 pb-6 text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900">Refund & Returns Policy</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">Last updated: May 21, 2026</p>
        </div>

        <div className="text-sm text-gray-600 leading-relaxed space-y-6">
          <p>
            At VikaStore, client satisfaction is our highest goal. If you are not completely satisfied with your purchase, we make return and refund processes easy and transparent.
          </p>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">1. 10-Day Return Window</h3>
            <p>
              You have <strong>10 calendar days</strong> from the date of order delivery to request a return. Requests submitted after this window will not be eligible for returns or refunds.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">2. Return Eligibility</h3>
            <p>To qualify for a refund, the product must meet the following criteria:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Must be unused, unwashed, and in the same condition you received it.</li>
              <li>Must be in its original packaging, containing all tags, stickers, booklets, and warranty cards.</li>
              <li>Electronics must have all initial user profiles deleted and return with cables/chargers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">3. Non-Returnable Items</h3>
            <p>Certain items cannot be returned due to hygiene and software policy rules:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Personal hygiene products (face masks, innerwear).</li>
              <li>Downloadable software products or digital gift codes.</li>
              <li>Items marked as "Final Sale" or promotional clearance bundles.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">4. Pickup and Shipping Charges</h3>
            <p>
              VikaStore provides <strong>free pickup</strong> for eligible returns. Our delivery partner will contact you within 48 hours of requesting a return.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">5. Refund Pathways</h3>
            <p>
              Once your returned package is received and verified at our warehouse, your refund will be processed within 5-7 business days:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Prepaid Orders:</strong> Refund credited directly to your original payment mode (card, netbanking, or UPI wallet).</li>
              <li><strong>COD Orders:</strong> Refund credited via UPI transfer or bank account details provided during return submission.</li>
            </ul>
          </section>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">For questions, contact our support team at support@vikastore.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
