import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      category: "Booking",
      questions: [
        {
          q: "How do I book a desk?",
          a: "Simply log into your dashboard, select your preferred location and date, and choose an available desk. Your booking is confirmed instantly, and you'll receive a confirmation email with all the details.",
        },
        {
          q: "Can I cancel or reschedule my booking?",
          a: "Yes! You can cancel or reschedule any booking up to 2 hours before your start time at no charge. Just access your dashboard and manage your bookings with a few clicks.",
        },
        {
          q: "How far in advance can I book?",
          a: "Day Pass holders can book up to 2 weeks in advance. Monthly members can book up to 1 month ahead, and Dedicated Office members have guaranteed access anytime.",
        },
      ],
    },
    {
      category: "Access",
      questions: [
        {
          q: "How do I access the building?",
          a: "Your smartphone becomes your key. Download our app, and you'll receive a digital access code that works at all our locations. No physical keys needed!",
        },
        {
          q: "What are the operating hours?",
          a: "Hours vary by location, but most spaces are open 6AM-10PM on weekdays. Monthly and Dedicated Office members enjoy 24/7 access at all locations.",
        },
        {
          q: "Can I bring guests?",
          a: "Absolutely! Monthly members get 2 guest passes per month, and Dedicated Office members get 5. Additional guest passes can be purchased as needed.",
        },
      ],
    },
    {
      category: "Payments",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, and digital wallets including Apple Pay and Google Pay. Invoicing is available for Dedicated Office members.",
        },
        {
          q: "Are there any hidden fees?",
          a: "No hidden fees, ever. The price you see is the price you pay. All amenities listed in your plan are included at no extra cost.",
        },
        {
          q: "Can I upgrade or downgrade my plan?",
          a: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the start of your next billing cycle.",
        },
      ],
    },
    {
      category: "Amenities",
      questions: [
        {
          q: "Is Wi-Fi included?",
          a: "Yes! High-speed Wi-Fi is included with all plans. We offer both open and secure networks, with speeds up to 1Gbps for reliable video calls and large file transfers.",
        },
        {
          q: "Do you have meeting rooms?",
          a: "Yes, all locations have professional meeting rooms available. Your plan includes meeting room credits, and additional time can be booked at hourly rates.",
        },
        {
          q: "Is there parking available?",
          a: "Parking availability varies by location. Some locations offer on-site parking (additional fee), while others are near public transit. Contact us for specific location details.",
        },
      ],
    },
  ];

  return (
    <section id="faq" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're 
            looking for, reach out to our team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {category.category}
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="bg-card border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
