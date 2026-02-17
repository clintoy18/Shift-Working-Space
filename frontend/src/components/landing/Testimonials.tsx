import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      company: "Self-employed",
      avatar: "SC",
      rating: 5,
      quote:
        "Shift has completely transformed how I work. The real-time availability feature means I always find a spot, and the community here is incredible.",
    },
    {
      name: "Marcus Johnson",
      role: "Startup Founder",
      company: "TechVenture Inc.",
      avatar: "MJ",
      rating: 5,
      quote:
        "We started with hot desks and now have our own office. The flexibility and seamless scaling made our growth so much easier to manage.",
    },
    {
      name: "Emily Rodriguez",
      role: "Remote Developer",
      company: "GlobalTech",
      avatar: "ER",
      rating: 5,
      quote:
        "The 24/7 access is a game-changer. I work odd hours and knowing I can always get in is priceless. Plus the coffee is actually good!",
    },
    {
      name: "David Park",
      role: "Marketing Consultant",
      company: "Park & Associates",
      avatar: "DP",
      rating: 5,
      quote:
        "Professional space, professional image. Meeting clients here always makes a great impression. Worth every penny.",
    },
    {
      name: "Lisa Thompson",
      role: "Content Creator",
      company: "Creative Studios",
      avatar: "LT",
      rating: 5,
      quote:
        "The dashboard makes managing my bookings so easy. I love being able to see my schedule and Wi-Fi details all in one place.",
    },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of happy members who've made Shift their work home.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-5xl mx-auto px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-card border-border">
                    <CardContent className="p-6">
                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-primary text-primary"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {testimonial.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-border" />
            <CarouselNext className="border-border" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
