import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Key, CreditCard, LayoutGrid, Check } from "lucide-react";

const Features = () => {
  const [selectedZone, setSelectedZone] = useState<"hot" | "dedicated">("hot");

  const features = [
    {
      icon: Clock,
      title: "Real-Time Availability",
      description:
        "View live desk and room availability at a glance, so you always know what’s free before you arrive.",
      visual: (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded ${
                  [0, 2, 5, 7, 9, 11].includes(i)
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary/20 border-2 border-primary rounded" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-muted-foreground/20 rounded" />
              <span>Occupied</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Key,
      title: "Plug & Play",
      description:
        "Fully equipped workspaces with power outlets and high-speed Wi-Fi—just sit down and get started.",
      visual: (
        <div className="mt-4 p-4 bg-secondary rounded-lg flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-36 bg-foreground/10 rounded-2xl border-4 border-foreground/20 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Key className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="absolute -right-8 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-primary" />
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: "Free Wifi",
      description:
        "Enjoy fast, reliable, and unlimited Wi-Fi at no extra cost, included with every visit.",
      visual: (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-card rounded">
              <span className="text-sm">Monthly Desk</span>
              <span className="text-sm font-semibold text-primary">$299</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-card rounded">
              <span className="text-sm">Meeting Room (2hr)</span>
              <span className="text-sm font-semibold text-primary">$25</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded text-primary text-sm">
              <Check className="w-4 h-4" />
              <span>Auto-pay enabled</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: LayoutGrid,
      title: "Membership Discounts",
      description:
        "Choose a workspace that fits your style and unlock exclusive member-only rates and perks.",
      visual: (
  <div className="mt-4 p-4 bg-secondary rounded-lg">
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => setSelectedZone("hot")}
        className={`p-3 rounded-lg text-left transition-all ${
          selectedZone === "hot"
            ? "bg-primary text-primary-foreground"
            : "bg-card hover:bg-card/80"
        }`}
      >
        <p className="font-semibold text-sm">10% Discount</p>
        <p
          className={`text-xs mt-1 ${
            selectedZone === "hot"
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          }`}
        >
          All desk & room bookings
        </p>
      </button>

      <button
        onClick={() => setSelectedZone("dedicated")}
        className={`p-3 rounded-lg text-left transition-all ${
          selectedZone === "dedicated"
            ? "bg-primary text-primary-foreground"
            : "bg-card hover:bg-card/80"
        }`}
      >
        <p className="font-semibold text-sm">2 Hours Free</p>
        <p
          className={`text-xs mt-1 ${
            selectedZone === "dedicated"
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          }`}
        >
          Meeting room credits
        </p>
      </button>
    </div>
  </div>
)

    },
  ];

  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Plug & Play Promise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to work smarter, not harder. We handle the
            details so you can focus on what matters.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {feature.visual}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
