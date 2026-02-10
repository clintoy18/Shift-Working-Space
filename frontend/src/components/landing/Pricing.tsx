import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Coffee, Lock, Monitor, Users, Zap } from "lucide-react";

const Pricing = () => {
  const regularSeats = [
    {
      name: "Nomad",
      price: "145",
      period: "first 2 hrs",
      description: "₱60 succeeding hours",
      features: ["Free one round drink", "High-speed Wi-Fi", "Access to open lounge"],
      cta: "Drop In",
    },
    {
      name: "Quick Shift",
      price: "250",
      period: "4 hours",
      description: "₱60 succeeding hour",
      features: ["Free one round drink", "High-speed Wi-Fi", "Ideal for focused work"],
      highlighted: true,
      cta: "Start Shift",
    },
    {
      name: "Pro (Day Pass)",
      price: "450",
      period: "8 hours",
      description: "₱60 succeeding hour",
      features: ["Unlimited Coffee/Iced Tea", "Personal Locker included", "Best for full workdays"],
      cta: "Get Pro Pass",
    },
  ];

  return (
    <section className="py-24 bg-background text-foreground font-poppins">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* DESIGNER NOTE: Header uses centered alignment for authority and clarity */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1">
            Flexible Workspace Rates
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Shift your <span className="text-primary">productivity.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Transparent pricing for freelancers, students, and teams in Cebu.
          </p>
        </div>

        {/* SECTION 1: THE CORE OFFERING (REGULAR SEATS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {regularSeats.map((plan, i) => (
            <Card key={i} className={`relative flex flex-col border-2 transition-all duration-300 ${
              plan.highlighted ? "border-primary shadow-[0_0_30px_rgba(255,107,0,0.15)] scale-105 z-10" : "border-border hover:border-primary/50"
            }`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-full flex items-center gap-1 uppercase">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}
              <CardHeader className="text-center pt-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{plan.name}</h3>
                <div className="mt-4 flex justify-center items-baseline gap-1">
                  <span className="text-5xl font-black">₱{plan.price}</span>
                </div>
                <p className="text-sm text-primary font-medium mt-1 uppercase">{plan.period}</p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between pt-6">
                <div className="space-y-6">
                  <div className="text-center text-xs font-bold bg-muted py-2 rounded-md uppercase tracking-tighter">
                    {plan.description}
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className={`w-full mt-10 py-6 text-md font-bold uppercase transition-transform active:scale-95 ${
                  plan.highlighted ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80"
                }`}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SECTION 2: PRIVATE & COLLABORATIVE (HORIZONTAL CARD DESIGN) */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl font-bold uppercase tracking-wide shrink-0">Private Spaces</h3>
            <div className="h-[2px] bg-border w-full" />
            <span className="text-xs font-bold text-primary whitespace-nowrap uppercase">unli coffee/iced tea</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { name: "Focus", price: "175", desc: "Cubicles with loft", icon: Monitor },
              { name: "Power Huddle", price: "270", desc: "Huddle rooms 1 & 2", icon: Users },
              { name: "Conference", price: "420", desc: "Conference Room", icon: Users },
            ].map((item, i) => (
              <div key={i} className="group bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="bg-muted p-4 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight uppercase">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-primary">₱{item.price}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Per Hour</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: ADVANCED MEMBERSHIP (THE RECURRING REVENUE BLOCK) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-muted/40 p-8 md:p-12 rounded-[2rem] border border-border">
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-3xl font-black uppercase leading-none">Early Bird <br /><span className="text-primary">Membership</span></h3>
            <p className="text-muted-foreground text-sm">Pay in advance to unlock exclusive weekly and monthly rates at our prime locations.</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary border-none">Weekly</Badge>
              <Badge className="bg-primary/10 text-primary border-none">Monthly</Badge>
              <Badge className="bg-primary/10 text-primary border-none italic tracking-tighter">Snacks for Sale</Badge>
            </div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Card */}
            <div className="bg-background p-6 rounded-2xl border border-border relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <Badge className="text-[40px] font-black italic">W</Badge>
               </div>
               <h4 className="text-xs font-black text-primary uppercase mb-6 tracking-widest">Platinum (Weekly)</h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Regular Seating</span>
                   <span className="text-xl font-bold">₱1,799</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Cubicle Seating</span>
                   <span className="text-xl font-bold text-primary">₱2,499</span>
                 </div>
                 <p className="text-[10px] text-muted-foreground mt-4 italic font-medium leading-none">*Cubicle subject to availability</p>
               </div>
            </div>

            {/* Monthly Card */}
            <div className="bg-background p-6 rounded-2xl border-2 border-primary relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-5">
                <Badge className="text-[40px] font-black italic text-primary">M</Badge>
               </div>
               <h4 className="text-xs font-black text-primary uppercase mb-6 tracking-widest">Diamond (Monthly)</h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Regular Seating</span>
                   <span className="text-xl font-bold">₱5,999</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium">Cubicle Seating</span>
                   <span className="text-xl font-bold text-primary">₱7,999</span>
                 </div>
                 <p className="text-[10px] text-muted-foreground mt-4 italic font-medium leading-none">*Cubicle subject to availability</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;