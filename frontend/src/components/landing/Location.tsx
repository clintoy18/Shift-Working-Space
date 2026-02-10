import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

const Location = () => {
  const locations = [
    {
      name: "Downtown Hub",
      address: "123 Business District, Suite 400",
      city: "San Francisco, CA 94102",
      hours: "Mon-Fri: 6AM-10PM, Sat-Sun: 8AM-6PM",
      phone: "(415) 555-0123",
      image:
        "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Tech Quarter",
      address: "456 Innovation Ave, Floor 8",
      city: "San Francisco, CA 94105",
      hours: "24/7 Access for Members",
      phone: "(415) 555-0456",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Creative Loft",
      address: "789 Arts District",
      city: "Oakland, CA 94612",
      hours: "Mon-Fri: 7AM-9PM, Sat: 9AM-5PM",
      phone: "(510) 555-0789",
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section id="location" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find your Seat
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your seat and we'll ready it Pick the one that's 
            closest to you or explore them all.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {locations.map((location, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-card border-border hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-xl font-bold text-foreground">
                  {location.name}
                </h3>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-foreground">{location.address}</p>
                      <p className="text-muted-foreground text-sm">{location.city}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-muted-foreground text-sm">{location.hours}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href={`tel:${location.phone}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Questions about our locations? We're here to help.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Mail className="w-5 h-5" />
            <a
              href="mailto:hello@shiftspace.co"
              className="font-medium hover:underline"
            >
              hello@shiftspace.co
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
