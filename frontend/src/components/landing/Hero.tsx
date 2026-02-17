import { Button } from "@/components/ui/button";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchStats } from "@services/StatsService";
import { useEffect, useState } from "react"; // ✅ IMPORT HOOKS

const Hero = () => {
  const navigate = useNavigate();

  // ✅ STATE FOR STATS
  const [stats, setStats] = useState({
    totalSeats: 0,
    totalMembers: 0,
  });

  // ✅ FETCH STATS ON LOAD
  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchStats();
      setStats(data);
    };

    loadStats();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* 🔥 DYNAMIC AVAILABILITY BADGE */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-md border border-orange-500/40 rounded-full px-5 py-2.5 mb-8 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-400"></span>
            </span>
            <span className="text-white text-sm font-bold">
              {stats.totalSeats || 12} desks available — visit our space.
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Shift your focus{" "}
            <span className="block mt-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              to what matters.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Be part of a thriving workspace community where creators connect and
            ideas move fast. Enjoy flexible hot desks, private cubicles, and
            ultra-speed WiFi built for serious work and collaboration.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-10 py-7 h-auto shadow-2xl shadow-orange-500/50 transition-all duration-300 hover:scale-110"
            >
              <span className="relative z-10 flex items-center gap-2">
                Be a Member
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/floor-plan")}
              className="border-2 border-white/40 bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 font-semibold text-lg px-10 py-7 h-auto"
            >
              Explore Seats
            </Button>
          </div>

          {/* 🔥 DYNAMIC STATS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-16 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-3xl font-black text-white">
                  {stats.totalMembers
                    ? stats.totalMembers.toLocaleString()
                    : "500+"}
                </p>
                <p className="text-slate-300 text-sm font-medium">
                  Active Members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-lg font-black text-white">Mandaue City</p>
                <p className="text-slate-300 text-sm font-medium">
                  Cebu, Philippines
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;