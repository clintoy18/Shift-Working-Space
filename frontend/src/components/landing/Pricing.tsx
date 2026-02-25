import { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Monitor, Users, Zap } from "lucide-react";

const Pricing = () => {
  const [visibleRegularSeats, setVisibleRegularSeats] = useState<boolean[]>([]);
  const [visibleMeetingRooms, setVisibleMeetingRooms] = useState<boolean[]>([]);
  const regularSeatsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const meetingRoomsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const commonAmenities = ["Fiber Wi-Fi", "Power Outlets", "Ergonomic Seats", "Complimentary Beverage"];

  const regularSeats = [
    {
      name: "Nomad",
      price: "145",
      period: "first 2 hrs",
      description: "₱60 succeeding hours",
      features: ["Access to open lounge", ...commonAmenities],
      cta: "Drop In",
    },
    {
      name: "Quick Shift",
      price: "250",
      period: "4 hours",
      description: "₱60 succeeding hour",
      features: ["Ideal for focused work", ...commonAmenities],
      highlighted: true,
      cta: "Start Shift",
    },
    {
      name: "Pro (Day Pass)",
      price: "450",
      period: "8 hours",
      description: "₱60 succeeding hour",
      features: ["Personal Locker included", "Best for full workdays", ...commonAmenities],
      cta: "Get Pro Pass",
    },
  ];

  const meetingRooms = [
    {
      name: "Focus",
      price: "175",
      details: [
        "Cubicles with loft",
        "Open time only",
      ],
      amenities: commonAmenities,
      icon: Monitor,
    },
    {
      name: "Power Huddle",
      price: "270",
      details: [
        "Huddle rooms 1 & 2",
        "Open time only",
      ],
      amenities: commonAmenities,
      icon: Users,
    },
    {
      name: "Conference",
      price: "420",
      details: [
        "Conference room",
        "Open time only",
      ],
      amenities: commonAmenities,
      icon: Users,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          const type = entry.target.getAttribute("data-type");

          if (!Number.isNaN(index) && entry.isIntersecting) {
            if (type === "regular") {
              setVisibleRegularSeats((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
              });
            } else if (type === "meeting") {
              setVisibleMeetingRooms((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    regularSeatsRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    meetingRoomsRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-background text-foreground font-poppins">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
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

        {/* SECTION 1: REGULAR SEATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {regularSeats.map((plan, i) => (
            <div
              key={i}
              ref={(node) => {
                regularSeatsRefs.current[i] = node;
              }}
              data-index={i}
              data-type="regular"
              className={`transition-all duration-700 ease-out ${
                visibleRegularSeats[i]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Card
                className={`relative flex flex-col border-2 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-primary shadow-[0_0_30px_rgba(255,107,0,0.15)] scale-105 z-10"
                    : "border-border hover:border-primary/50"
                }`}
              >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 text-xs font-bold rounded-full flex items-center gap-1 uppercase">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
              )}
              <CardHeader className="text-center pt-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {plan.name}
                </h3>
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
              </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* SECTION 2: MEETING ROOMS */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] shrink-0 text-slate-800">
              Meeting Rooms
            </h3>
            <div className="h-px bg-border w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {meetingRooms.map((item, i) => (
              <div
                key={item.name}
                ref={(node) => {
                  meetingRoomsRefs.current[i] = node;
                }}
                data-index={i}
                data-type="meeting"
                className={`transition-all duration-700 ease-out ${
                  visibleMeetingRooms[i]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Card
                  className="relative flex flex-col border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg uppercase tracking-wide text-slate-900">
                          {item.name}
                        </h4>
                        <div className="text-xs text-slate-600 space-y-1 mt-2">
                          {item.details.map((detail) => (
                            <p key={detail} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-primary" />
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-3xl font-black text-primary">₱{item.price}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Per Hour</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col pt-4 border-t border-border">
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Amenities Included</p>
                    <ul className="space-y-2">
                      {item.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-slate-700">{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

                      {/* SECTION 3: MEMBERSHIP */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-muted/40 p-8 md:p-12 rounded-[2rem] border border-border">
                        <div className="lg:col-span-4 space-y-6">
                          <h3 className="text-3xl font-black uppercase leading-none">Early Bird <br /><span className="text-primary">Membership</span></h3>
                          <p className="text-muted-foreground text-sm">Be a member now and claim these exclusive weekly and monthly rates when you walk in.</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-primary/10 text-primary border-none">Weekly</Badge>
                            <Badge className="bg-primary/10 text-primary border-none">Monthly</Badge>
                            <Badge className="bg-primary/10 text-primary border-none italic tracking-tighter">Snacks for Sale</Badge>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                            <p className="text-xs font-bold text-yellow-900 uppercase tracking-tight">⏰ Limited Time Offer</p>
                            <p className="text-xs text-yellow-800 mt-1">Discounted prices apply only to members from March 1 to March 30</p>
                          </div>
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-background p-6 rounded-2xl border border-border relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                              <Badge className="text-[40px] font-black italic">W</Badge>
                             </div>
                             <h4 className="text-xs font-black text-primary uppercase mb-6 tracking-widest">Platinum (Weekly)</h4>
                             <div className="space-y-4">
                               <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium">Regular Seating</span>
                                 <div className="flex flex-col items-end gap-1">
                                   <span className="text-xs line-through text-muted-foreground">₱2,828</span>
                                   <span className="text-xl font-bold">₱1,799</span>
                                 </div>
                               </div>
                               <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium">Cubicle Seating</span>
                                 <div className="flex flex-col items-end gap-1">
                                   <span className="text-xs line-through text-muted-foreground">₱3,938</span>
                                   <span className="text-xl font-bold text-primary">₱2,499</span>
                                 </div>
                               </div>
                               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                 <p className="text-[10px] font-bold text-blue-900 uppercase tracking-tight mb-2">Meeting Room Access</p>
                                 <ul className="text-[10px] text-blue-800 space-y-1">
                                   <li>• 2 hrs Conference Room</li>
                                   <li>• 1 hr Huddle Room</li>
                                 </ul>
                               </div>
                               <p className="text-[10px] text-muted-foreground mt-2 italic font-medium leading-none">*Cubicle subject to availability</p>
                             </div>
                          </div>

                          <div className="bg-background p-6 rounded-2xl border-2 border-primary relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-3 opacity-5">
                              <Badge className="text-[40px] font-black italic text-primary">M</Badge>
                             </div>
                             <h4 className="text-xs font-black text-primary uppercase mb-6 tracking-widest">Diamond (Monthly)</h4>
                             <div className="space-y-4">
                               <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium">Regular Seating</span>
                                 <div className="flex flex-col items-end gap-1">
                                   <span className="text-xs line-through text-muted-foreground">₱6,478</span>
                                   <span className="text-xl font-bold">₱5,999</span>
                                 </div>
                               </div>
                               <div className="flex justify-between items-center">
                                 <span className="text-sm font-medium">Cubicle Seating</span>
                                 <div className="flex flex-col items-end gap-1">
                                   <span className="text-xs line-through text-muted-foreground">₱8,999</span>
                                   <span className="text-xl font-bold text-primary">₱7,999</span>
                                 </div>
                               </div>
                               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                 <p className="text-[10px] font-bold text-blue-900 uppercase tracking-tight mb-2">Meeting Room Access</p>
                                 <ul className="text-[10px] text-blue-800 space-y-1">
                                   <li>• 4 hrs Conference Room</li>
                                   <li>• 1 hr Huddle Room</li>
                                 </ul>
                               </div>
                               <p className="text-[10px] text-muted-foreground mt-2 italic font-medium leading-none">*Cubicle subject to availability</p>
                             </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </section>
                );
              };

              export default Pricing;