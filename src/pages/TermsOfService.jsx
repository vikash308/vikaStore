import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | VikaStore";
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 space-y-6">
        <div className="border-b border-gray-100 pb-6 text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900">Terms of Service</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">Last updated: May 21, 2026</p>
        </div>

        <div className="text-sm text-gray-600 leading-relaxed space-y-6">
          <p>
            Welcome to VikaStore. These Terms of Service ("Terms") govern your use of our e-commerce platform. By accessing or shopping on VikaStore, you agree to be bound by these Terms.
          </p>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">1. Account Registration</h3>
            <p>
              When you register an account, you agree to provide true and accurate info. You are responsible for keeping your login credentials secure. VikaStore reserves the right to terminate accounts that violate our safety policies or engage in suspicious behaviors.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">2. Pricing and Product Availability</h3>
            <p>
              We strive to keep prices and product listings accurate. However, typographical errors may occur. In the event a product is listed at an incorrect price, VikaStore reserves the right to cancel orders placed for the product, even after order confirmation.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">3. Order Placement and Cancellations</h3>
            <p>
              An order confirmation signifies receipt of request, not acceptance of order. We reserve the right to decline or cancel orders for reasons such as product stockout, payment failures, or flag identification of potential card fraud.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">4. Intellectual Property</h3>
            <p>
              All logo designs, custom CSS, images, and content featured on this site are the sole intellectual property of VikaStore. You may not duplicate or use assets for other commercial storefronts without our explicit written consent.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-gray-900 text-lg">5. Limitation of Liability</h3>
            <p>
              VikaStore shall not be liable for any indirect, incidental, or consequential damages resulting from the use of products sold on our platform, or inability to access services.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">If you have questions regarding these Terms, contact support@vikastore.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
