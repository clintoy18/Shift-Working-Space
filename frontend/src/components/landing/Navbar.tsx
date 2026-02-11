import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { href: "#features", label: "Services" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Shift Branding - Consistent with Dashboard Header */}
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary flex items-center justify-center border border-border shadow-sm">
              {!logoError ? (
                <img 
                  src="/images/logo.jpg" 
                  alt="Shift logo" 
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-black text-primary-foreground text-xl">S</span>
              )}
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">
              Shift Working Space
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Group */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md active:scale-95 transition-all"
            >
              Be a Member
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-border animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-semibold text-muted-foreground hover:text-primary transition-colors px-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              <hr className="border-border my-2" />
              
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full h-12 text-foreground font-bold border-border"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  Be a Member
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;