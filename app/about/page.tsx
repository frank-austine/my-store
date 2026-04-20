import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | LA Kandy Plug',
  description: 'Learn about LA Weed Kandy Plug — premium cannabis products delivered to you.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">

      {/* Page title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-3">
          About Us
        </h1>
        <div className="w-12 h-1 bg-black mx-auto rounded-full" />
      </div>

      {/* Who we are */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Who We Are</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Welcome to LA Weed Kandy Plug — your trusted source for premium cannabis
          products in Los Angeles. We are a passionate team dedicated to bringing
          you the highest quality flowers, edibles, concentrates, vapes, and
          pre-rolls at competitive prices.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you are a first-time customer or a long-time fan, we treat every
          order with care and discretion. Your satisfaction is our mission.
        </p>
      </section>

      {/* What we offer */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { emoji: '🌸', title: 'Flowers', desc: 'Top-shelf indoor and outdoor strains.' },
            { emoji: '🍬', title: 'Edibles', desc: 'Delicious kandy and infused treats.' },
            { emoji: '💨', title: 'Vapes', desc: 'Premium cartridges and disposables.' },
            { emoji: '🔥', title: 'Concentrates', desc: 'High-potency wax, shatter, and more.' },
            { emoji: '🚬', title: 'Pre-Rolls', desc: 'Ready to smoke, perfectly rolled.' },
            { emoji: '🚚', title: 'Delivery', desc: 'Ship or local pickup — your choice.' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to order */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">How to Order</h2>
        <ol className="space-y-4">
          {[
            'Browse our products on the homepage.',
            'Add items to your cart.',
            'Click "Checkout via Telegram" to send us your order.',
            'We confirm your order and arrange delivery or pickup.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="w-7 h-7 rounded-full bg-black text-white text-sm flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-gray-600 pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Contact / CTA */}
      <section className="bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Ready to Order?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Reach out to us directly on Telegram. We respond fast.
        </p>
        <a
          href="https://t.me/Los_angeles_weed_kandy_plug"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
        >
          Message us on Telegram
        </a>
        <p className="text-xs text-gray-400 mt-4">
          @Los_angeles_weed_kandy_plug
        </p>
      </section>

    </div>
  );
}