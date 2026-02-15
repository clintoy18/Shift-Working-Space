import { Button } from "@/components/ui/button";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* ✅ ENHANCED BACKGROUND - Better Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        {/* ✅ DARKER OVERLAY - Better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* ✅ ENHANCED AVAILABILITY BADGE */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-md border border-orange-500/40 rounded-full px-5 py-2.5 mb-8 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-400"></span>
            </span>
            <span className="text-white text-sm font-bold">
              Only 12 desks left — reserve yours today.
            </span>
          </div>

          {/* ✅ ENHANCED HEADLINE - Better readability */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Shift your focus{" "}
            <span className="block mt-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              to what matters.
            </span>
          </h1>

          {/* ✅ ENHANCED SUBHEADLINE - Better contrast */}
          <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Find and book the perfect workspace in seconds — from flexible hot
            desks to private cubicles. Real-time availability, 24/7 access, and
            secure, seamless payments.
          </p>

          {/* ✅ EMPHASIZED CTAs - Primary stands out */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* ✅ PRIMARY CTA - Maximum emphasis */}
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-10 py-7 h-auto shadow-2xl shadow-orange-500/50 transition-all duration-300 hover:scale-110 hover:shadow-orange-500/60"
            >
              <span className="relative z-10 flex items-center gap-2">
                Be a Member
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Animated glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 blur opacity-30 group-hover:opacity-50 transition-opacity" />
            </Button>
            
            {/* ✅ SECONDARY CTA - Subtle */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/floor-plan')}
              className="border-2 border-white/40 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/60 font-semibold text-lg px-10 py-7 h-auto transition-all duration-300"
            >
              Explore Seats
            </Button>
          </div>

          {/* ✅ ENHANCED STATS - Better visibility */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-16 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-3xl font-black text-white">
                  500+
                </p>
                <p className="text-slate-300 text-sm font-medium">Active Members</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-lg font-black text-white">
                  Mandaue City
                </p>
                <p className="text-slate-300 text-sm font-medium">
                  Cebu, Philippines
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ENHANCED SCROLL INDICATOR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-orange-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;