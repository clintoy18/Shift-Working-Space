import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      category: "About SHIFT",
      questions: [
        {
          q: "What is SHIFT Working Space?",
          a: "SHIFT Working Space is a modern co-working and collaboration space in Mandaue City designed for freelancers, students, startups, and corporate teams. We offer flexible seating, private workspaces, and meeting rooms — built for productivity and comfort.",
        },
        {
          q: "Who is SHIFT ideal for?",
          a: "SHIFT is perfect for remote workers, freelancers, students, entrepreneurs, startup teams, corporate off-site meetings, and interview sessions.",
        },
        {
          q: "What makes SHIFT different?",
          a: "SHIFT combines flexible seating, a relaxed loft-style workspace, private rooms, affordable rates, and an intentional layout for productivity. We understand that productivity doesn't always mean sitting upright at a desk. Sometimes, you just need to shift.",
        },
        {
          q: "Where are you located?",
          a: "We are located in Mandaue City, Cebu. (Insert complete address here.)",
        },
      ],
    },
    {
      category: "Spaces & Seating",
      questions: [
        {
          q: "How many seats does SHIFT have?",
          a: "We can accommodate 21 regular seats, which includes individual desks, elevated hanging seats, and a shared group table for 4–6 persons. All are considered regular seating and are charged at the same rate.",
        },
        {
          q: "What is the Lazy Loft?",
          a: "The Lazy Loft is our elevated lounge-style workspace located above the cubicles. We have 4 Lazy Loft areas, designed for studying, light laptop work, creative thinking, relaxed productivity, and resting between work sessions. You may sit, squat, or lie down comfortably while working. Lazy Loft is charged at the same rate as regular seating.",
        },
        {
          q: "Do you have private spaces?",
          a: "Yes! We offer 4 Private Cubicles (ideal for focused work and virtual meetings), 2 Huddle Rooms (perfect for small team discussions and brainstorming), and 1 Conference Room suitable for client meetings, workshops, trainings, presentations, and interviews. Advance booking is recommended.",
        },
        {
          q: "Is SHIFT good for group work?",
          a: "Yes! Our 4–6 person shared table is ideal for study groups, startup teams, brainstorming sessions, and project collaborations. For more privacy, you may book a huddle room or conference room.",
        },
      ],
    },
    {
      category: "Amenities & Rates",
      questions: [
        {
          q: "What's included in your rates?",
          a: "Depending on your package, inclusions cover high-speed internet, an air-conditioned space, power outlets, comfortable seating, unlimited coffee or iced tea (selected packages), and a professional work environment.",
        },
        {
          q: "Is SHIFT suitable for long stays?",
          a: "Yes! Many of our guests stay for half-day or full-day sessions. The Lazy Loft is especially comfortable for extended stays.",
        },
        {
          q: "Can I sleep at the Lazy Loft?",
          a: "The Lazy Loft is designed for comfort and relaxed productivity. Short rest breaks are allowed, but it is not intended as an overnight sleeping facility.",
        },
      ],
    },
    {
      category: "Bookings & Environment",
      questions: [
        {
          q: "Do I need to reserve in advance?",
          a: "Walk-ins are welcome for regular seating and the Lazy Loft, subject to availability. Private cubicles and meeting rooms require advance booking.",
        },
        {
          q: "Is SHIFT quiet?",
          a: "We maintain a respectful, productivity-focused environment. Regular seating is collaborative but controlled, cubicles are private, huddle rooms and the conference room are fully enclosed, and the Lazy Loft is a quiet relaxation-study zone.",
        },
        {
          q: "How do I book?",
          a: "You can book by messaging us on Facebook or Instagram, calling us at [Insert number], or booking directly through our website.",
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