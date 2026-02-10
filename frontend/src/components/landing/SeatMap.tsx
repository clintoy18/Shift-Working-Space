import { useState } from "react";
import { Users, Monitor, Coffee, User, ArrowUpRight, Lock } from "lucide-react";

const ShiftFloorPlanFinal = () => {
  // Real-time occupancy state simulation
  const [occupied] = useState(
    new Set(["island-1-seat-2", "island-2-seat-4", "cube-1", "huddle-1"]),
  );

  return (
    <section className="py-24 bg-slate-950 font-poppins relative selection:bg-primary/30">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Dashboard Information Side */}
          <div className="lg:col-span-4 sticky top-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Architecture Map
            </div>

            <h2 className="text-5xl font-black text-white uppercase leading-[0.9] mb-6">
              Option 2 <br />
              <span className="text-primary">Digital Twin</span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              A high-fidelity mapping of the Shift Working Space. Use this
              real-time interface to verify seat availability across the open
              areas, private rooms, and specialized focus zones.
            </p>

            {/* Zone Key/Legend */}
            <div className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                Facility Guide
              </h3>
              <FacilityItem
                icon={<Users size={14} />}
                label="Conference & Huddle"
                price="₱270 - ₱420/hr"
              />
              <FacilityItem
                icon={<Monitor size={14} />}
                label="Focus Cubicles"
                price="₱175/hr"
              />
              <FacilityItem
                icon={<Coffee size={14} />}
                label="Pantry & Free Drinks"
                price="Included"
              />
            </div>
          </div>

          {/* THE FLOOR PLAN: Architecturally Accurate Render */}
          <div className="lg:col-span-8">
            <div className="bg-[#0b1120] border border-white/10 rounded-[2.5rem] p-4 md:p-10 shadow-2xl">
              <div className="relative w-full aspect-[1.2/1] border-2 border-slate-800 rounded-2xl bg-slate-950/40 p-4 md:p-8 overflow-hidden">
                {/* 1. NORTH WING: Private Consultation & Group Spaces */}
                <div className="flex gap-2 h-[22%] mb-6">
                  <ZoneBox
                    label="Conference Room"
                    className="w-[38%]"
                    icon={<Users className="text-slate-500" />}
                  />
                  <ZoneBox
                    label="Huddle Room 1"
                    className="w-[20%]"
                    active
                    icon={<Users className="text-primary" />}
                  />
                  <ZoneBox
                    label="Huddle Room 2"
                    className="w-[20%]"
                    icon={<Users className="text-slate-500" />}
                  />
                  <div className="flex-1 border-2 border-slate-800 border-dashed rounded-xl flex items-center justify-center bg-slate-900/20">
                    <span className="text-[9px] font-bold text-slate-600 uppercase">
                      Table for Six
                    </span>
                  </div>
                </div>

                {/* 2. WEST SERVICE CORE: Architectural Mirror of Blueprint */}
                <div className="absolute left-4 md:left-8 top-[28%] w-[22%] h-[55%] flex flex-col">
                  {/* TOP SECTION: Pantry & Locker Structural Block */}
                  <div className="flex-[2] flex flex-col border-2 border-slate-800 rounded-t-xl overflow-hidden">
                    {/* Pantry Area */}
                    <div className="flex-1 bg-slate-900/30 p-2 flex flex-col border-b border-slate-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Coffee size={12} className="text-primary" />
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                          Pantry
                        </span>
                      </div>
                      <div className="flex-1 border border-dashed border-slate-800 rounded flex items-center justify-center">
                        <span className="text-[7px] text-slate-600 font-bold uppercase">
                          Brew Station
                        </span>
                      </div>
                    </div>

                    {/* Locker Division - Shared Wall with Pantry */}
                    <div className="h-[35%] bg-slate-800/40 flex items-center justify-between px-3">
                      <div className="flex items-center gap-2">
                        <Lock size={12} className="text-slate-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          Locker
                        </span>
                      </div>
                      {/* Visual representation of locker units */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-3 border border-slate-700 rounded-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM SECTION: Reception & Waiting Area */}
                  <div className="flex-1 mt-4 border-2 border-slate-700 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center p-2 text-center relative shadow-inner">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-700 px-2 py-0.5 rounded text-[6px] font-black text-white uppercase">
                      Greeting
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase leading-tight tracking-widest">
                      Reception
                      <br />& Waiting Area
                    </span>
                  </div>
                </div>

                {/* 3. CENTRAL OPEN AREA: Island Seating */}
                <div className="ml-[28%] mr-[5%] h-[50%] flex gap-24 justify-center items-center relative">
                  {[1, 2].map((islandId) => (
                    <div
                      key={islandId}
                      className="relative h-full w-14 bg-slate-800/20 border border-slate-800 rounded-full flex flex-col items-center justify-around py-4"
                    >
                      {/* Left Side Seats */}
                      <div className="absolute -left-8 h-full flex flex-col justify-around">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <SeatNode
                            key={i}
                            id={`island-${islandId}-L-${i}`}
                            isOccupied={occupied.has(
                              `island-${islandId}-L-${i}`,
                            )}
                          />
                        ))}
                      </div>
                      {/* Right Side Seats */}
                      <div className="absolute -right-8 h-full flex flex-col justify-around">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <SeatNode
                            key={i}
                            id={`island-${islandId}-R-${i}`}
                            isOccupied={occupied.has(
                              `island-${islandId}-R-${i}`,
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-[8px] text-center font-black text-slate-700 uppercase vertical-text">
                        Long Table 0{islandId}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. SOUTH WING: Primary Entrance & Specialized Seating */}
<div className="absolute bottom-4 md:bottom-2 left-4 md:left-8 right-4 md:right-8 h-[18%] flex gap-3 items-end">
  
  {/* THE MAIN ENTRANCE: Architectural Digital Twin */}
  <div className="w-[30%] h-full flex flex-col justify-end pb-1">
    <div className="relative w-full h-16 border-l-2 border-b-2 border-slate-800 rounded-bl-3xl flex items-center px-4 group">
      {/* Senior Designer Note: The arc mimics the standard architectural door swing. 
          It leads directly into the Reception/Waiting Area as shown in the blueprint. 
      */}
      <div className="absolute -bottom-[2px] left-0 w-12 h-12 border-t-2 border-r-2 border-primary/40 rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex flex-col ml-10">
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">
          Main Entrance
        </span>
        <span className="text-[7px] text-slate-500 uppercase font-bold tracking-tighter">
          Shift Option 2
        </span>
      </div>
    </div>
  </div>

  {/* FOCUS CUBICLES: Strategically placed to optimize floor space */}
  <div className="flex-1 flex gap-2 h-[75%]">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className={`flex-1 border-2 rounded-xl flex items-center justify-center transition-all ${
          occupied.has(`cube-${i}`)
            ? "border-slate-800 bg-slate-900/40"
            : "border-primary/40 bg-primary/10 shadow-[0_0_10px_rgba(255,107,0,0.1)]"
        }`}
      >
        <Monitor
          className={`w-3.5 h-3.5 ${occupied.has(`cube-${i}`) ? "text-slate-800" : "text-primary"}`}
        />
      </div>
    ))}
  </div>

  {/* VERTICAL ACCESS: Access to mezzanine study areas */}
  <div className="w-[12%] h-[75%] border-2 border-slate-800 bg-slate-900/80 rounded-xl flex flex-col items-center justify-center group hover:border-primary/50 transition-colors">
    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors mb-0.5" />
    <span className="text-[6px] font-black text-slate-600 uppercase">Stairs</span>
  </div>
</div>

                {/* ENTRANCE INDICATOR */}
                <div className="absolute bottom-0 left-[22%] translate-y-full pt-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    Main Entrance
                  </span>
                </div>
              </div>

              {/* Live Availability Legend */}
              <div className="mt-14 flex flex-wrap gap-8 justify-center border-t border-white/5 pt-8">
                <LegendItem color="bg-primary" label="Available Seat" />
                <LegendItem
                  color="bg-slate-800"
                  label="Occupied"
                  border="border-slate-700"
                />
                <LegendItem
                  color="bg-primary/10"
                  border="border-primary/50"
                  label="Group Room (Free)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Sub-components for Clean Architectural Design */

const SeatNode = ({ id, isOccupied }: { id: string; isOccupied: boolean }) => (
  <div
    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
      isOccupied
        ? "bg-slate-800 border-transparent text-slate-600"
        : "bg-primary border-primary shadow-[0_0_15px_rgba(255,107,0,0.3)] text-white hover:scale-110"
    }`}
  >
    <User size={12} strokeWidth={3} />
  </div>
);

const ZoneBox = ({ label, className, icon, active = false }: any) => (
  <div
    className={`border-2 rounded-xl flex flex-col items-center justify-center p-2 text-center transition-colors ${
      active
        ? "border-primary/50 bg-primary/5"
        : "border-slate-800 bg-slate-900/40"
    } ${className}`}
  >
    <div className="mb-1">{icon}</div>
    <span
      className={`text-[8px] font-black uppercase leading-tight ${active ? "text-white" : "text-slate-500"}`}
    >
      {label}
    </span>
  </div>
);

const FacilityItem = ({ icon, label, price }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-[11px] font-bold text-slate-300 uppercase">
        {label}
      </span>
    </div>
    <span className="text-[10px] font-black text-primary italic">{price}</span>
  </div>
);

const LegendItem = ({ color, label, border = "border-transparent" }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color} border ${border}`} />
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
      {label}
    </span>
  </div>
);

export default ShiftFloorPlanFinal;
