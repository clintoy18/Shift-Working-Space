import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Day Pass",
      price: "$25",
      period: "per day",
      description: "Perfect for occasional visitors or trying us out",
      features: [
        "Access to hot desks",
        "High-speed Wi-Fi",
        "Coffee & refreshments",
        "Meeting room credits (1hr)",
        "Community events access",
      ],
      cta: "Get Day Pass",
      highlighted: false,
    },
    {
      name: "Monthly Hot Desk",
      price: "$299",
      period: "per month",
      description: "For freelancers and remote workers who need flexibility",
      features: [
        "Unlimited hot desk access",
        "24/7 building access",
        "High-speed Wi-Fi",
        "Meeting room credits (5hr)",
        "Mail handling",
        "Locker included",
        "Guest passes (2/month)",
      ],
      cta: "Start Monthly",
      highlighted: true,
    },
    {
      name: "Dedicated Office",
      price: "$799",
      period: "per month",
      description: "Your own private space for teams of 1-4 people",
      features: [
        "Private lockable office",
        "24/7 building access",
        "Dedicated desk & chair",
        "Meeting room credits (10hr)",
        "Business address",
        "Phone booth access",
        "Priority support",
        "Guest passes (5/month)",
      ],
      cta: "Get Office",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees, no long-term contracts. Pick the plan that fits your 
            work style and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlighted
                  ? "border-primary shadow-xl shadow-primary/10 scale-105"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-3">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
