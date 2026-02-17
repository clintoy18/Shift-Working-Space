import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeadCapture = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: "You're on the list!",
      description: "We'll keep you updated on news and special offers.",
    });
  };

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Join the Shift Community
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Get early access to new locations, exclusive member perks, and 
            productivity tips delivered to your inbox.
          </p>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0 h-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 font-semibold shrink-0"
              >
                {isLoading ? "Joining..." : "Join Now"}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 bg-primary-foreground/10 rounded-lg p-4 max-w-md mx-auto">
              <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <p className="text-primary-foreground font-medium">
                You're on the list! Check your inbox soon.
              </p>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-primary-foreground/60 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;
