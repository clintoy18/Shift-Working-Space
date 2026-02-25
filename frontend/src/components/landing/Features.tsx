import { useEffect, useRef, useState } from "react";
import {
  Wifi,
  Plug,
  Armchair,
  Coffee,
  Users,
  LayoutGrid
} from "lucide-react";

const amenities = [
  {
    icon: Wifi,
    title: "Fiber Wi-Fi",
    description:
      "Internet is the lifeblood of industries today. Thus, we provide you with fiber WiFi connections from three different service providers. We take seamless browsing for your work and research seriously."
  },
  {
    icon: Plug,
    title: "Power Outlets",
   description:
  "Designed for productivity, each workspace is equipped with accessible power outlets so you can keep your devices charged and your focus uninterrupted."
  },
  {
    icon: Armchair,
    title: "Ergonomic Seats",
    description:
      "We want you to work or study comfortably. That is why we look for the best chairs available that can keep you working for hours without feeling uneasy."
  },
  {
    icon: Coffee,
    title: "Complimentary Beverage",
    description:
      "More than a workspace — SHIFT is home to a café next door. Every visit includes a complimentary brewed coffee or iced tea, and when you're craving something more, Motto Café is right beside us serving handcrafted frappes, shakes, and more."  },
  {
    icon: Users,
    title: "Conference Room",
    description:
      "This is for your meetings that need some privacy and we added perks with it too: unlimited brewed coffee and iced tea for eight pax, projector and whiteboard."
  },
  {
    icon: LayoutGrid,
    title: "Loft Space",
    description:
      "Stretch out in our airy loft space designed for focused work and relaxed collaboration, with room to spread out and settle in."
  }
];

const Features = () => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    () => new Array(amenities.length).fill(false)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!Number.isNaN(index) && entry.isIntersecting) {
            setVisibleItems((prev) => {
              if (prev[index]) {
                return prev;
              }
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    itemRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-base md:text-base tracking-[0.35em] text-primary/80 font-semibold">
            AMENITIES
          </p>
          <h2 className="mt-3 text-4xl md:text-4xl font-heading font-semibold text-slate-800">
            Shift your focus, lift your drift
          </h2>
        </div>

        <div className="grid gap-10 md:gap-12 lg:gap-14 md:grid-cols-2 max-w-6xl mx-auto">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                data-index={index}
                className={`flex flex-col items-center text-center gap-4 md:flex-row md:items-start md:text-left md:gap-5 transition-all duration-700 ease-out ${
                  visibleItems[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 text-primary">
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-2xl font-heading font-semibold text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-lg md:text-lg leading-relaxed text-slate-600 max-w-md md:max-w-none mx-auto md:mx-0">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;