import { useState } from "react";
import { Users, Monitor, Coffee, ArrowUpRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShiftFloorPlanFinal = () => {
  const navigate = useNavigate();
  const [occupied] = useState(
    new Set(["island-1-seat-2", "island-2-seat-4", "cube-1", "huddle-1"]),
  );

  return (
    <section className="py-12 md:py-24 bg-slate-950 font-poppins relative selection:bg-primary/30">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-10 z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Real-Time Occupancy Live
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[0.9] mb-6">
              Find Your <br />
              <span className="text-primary">Perfect Spot</span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Don't waste time searching for a seat. Our Digital Twin
              provides millisecond-accurate visibility into the workspace.
            </p>

            {/* Changed border-white/10 to border-white/20 */}
            <div className="grid grid-cols-1 gap-3 bg-white/5 p-4 md:p-6 rounded-2xl border border-white/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex justify-between items-center">
                Facility Guide
                <span className="text-[10px] text-primary lowercase font-medium animate-pulse">
                  ● Live Rates
                </span>
              </h3>

              <FacilityItem icon={<Users size={14} />} label="Team Collaboration" description="Conf & Huddle Rooms" price="From ₱270/hr" />
              <FacilityItem icon={<Monitor size={14} />} label="Deep Work Zone" description="Private Focus Cubicles" price="₱175/hr" />
              <FacilityItem icon={<Coffee size={14} />} label="Unlimited Fuel" description="Pantry & Premium Drinks" price="FREE" />
            </div>

            <button
              onClick={() => navigate("/register")}
              className="w-full mt-6 py-4 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] hover:-translate-y-0.5 transition-all"
            >
              Be a Member and Book Online!
            </button>
          </div>

          <div className="lg:col-span-8 w-full overflow-hidden">
            {/* Changed border-white/15 to border-white/25 */}
            <div className="bg-[#0b1120] border border-white/25 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-10 shadow-2xl">
              <div className="overflow-x-auto pb-6 scrollbar-hide cursor-grab active:cursor-grabbing">
                {/* Changed border-slate-800 to border-slate-700 */}
                <div className="relative min-w-[800px] lg:min-w-full aspect-[1.2/1] border-2 border-slate-700 rounded-2xl bg-slate-950/40 p-4 md:p-8 overflow-hidden">
                  
                  {/* 1. NORTH WING */}
                  <div className="flex gap-2 h-[22%] mb-6">
                    <ZoneBox label="Conference" className="w-[38%]" icon={<Users className="text-slate-500" />} />
                    <ZoneBox label="Huddle 1" className="w-[20%]" active icon={<Users className="text-primary" />} />
                    <ZoneBox label="Huddle 2" className="w-[20%]" icon={<Users className="text-slate-500" />} />
                    
                    <div className="flex-1 flex items-center justify-center relative">
                      {/* Changed border-slate-800/60 to border-slate-600/60 */}
                      <div className="relative h-32 w-14 bg-slate-800/10 border border-slate-600/60 rounded-sm flex flex-col items-center justify-center py-2">
                        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-700/50" />
                        
                        <div className="absolute -left-8 h-full flex flex-col justify-around py-2">
                          {[2, 1, 0].map((i) => (
                            <SeatNode key={i} id={`huddle-2-L-${i}`} label={`R${i + 28}`} isOccupied={occupied.has(`huddle-2-L-${i}`)} />
                          ))}
                        </div>

                        <div className="absolute -right-8 h-full flex flex-col justify-around py-2">
                          {[2, 1, 0].map((i) => (
                            <SeatNode key={i} id={`huddle-2-R-${i}`} label={`R${i + 25}`} isOccupied={occupied.has(`huddle-2-R-${i}`)} />
                          ))}
                        </div>
                        <div className="absolute -bottom-5 w-max text-[7px] text-center font-black text-slate-600 uppercase">
                          Regular Table for (6)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. WEST SERVICE CORE */}
                  <div className="absolute left-4 md:left-8 top-[28%] w-[22%] h-[55%] flex flex-col">
                    <div className="flex-[2] flex flex-col border-2 border-slate-700 rounded-t-xl overflow-hidden">
                      <div className="flex-1 bg-slate-900/30 p-2 flex flex-col border-b border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Coffee size={12} className="text-primary" />
                          <span className="text-[9px] font-black text-white uppercase">Pantry</span>
                        </div>
                        <div className="flex-1 border border-dashed border-slate-600 rounded flex items-center justify-center">
                          <span className="text-[7px] text-slate-500 font-bold uppercase italic">Brew Station</span>
                        </div>
                      </div>
                      <div className="h-[35%] bg-slate-800/40 flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                          <Lock size={12} className="text-slate-500" />
                          <span className="text-[9px] font-black text-slate-400 uppercase">Locker</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 mt-4 border-2 border-slate-600 bg-slate-900/60 rounded-xl flex flex-col items-center justify-center p-2 text-center relative shadow-inner">
                      <span className="text-[9px] font-black text-slate-300 uppercase leading-tight tracking-widest">Reception</span>
                    </div>
                  </div>

                  {/* 3. CENTRAL OPEN AREA */}
                  <div className="ml-[40%] mr-[3%] h-[55%] flex gap-18 justify-center items-center relative">
                    <div className="grid grid-cols-2 gap-x-24 gap-y-12 items-center justify-items-center">
                      {[1, 2, 3, 4].map((islandId) => (
                        <div key={islandId} className="relative h-24 w-14 bg-slate-800/10 border border-slate-600/80 rounded-sm flex flex-col items-center justify-center py-2">
                          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-700/50" />
                          <div className="absolute -left-8 h-full flex flex-col justify-around py-1">
                            {[0, 1].map((i) => {
                              const num = (islandId - 1) * 4 + (i + 1);
                              return <SeatNode key={i} id={`isl-${islandId}-L-${i}`} label={`R${num}`} isOccupied={occupied.has(`isl-${islandId}-L-${i}`)} />;
                            })}
                          </div>
                          <div className="absolute -right-8 h-full flex flex-col justify-around py-1">
                            {[0, 1].map((i) => {
                              const num = (islandId - 1) * 4 + (i + 3);
                              return <SeatNode key={i} id={`isl-${islandId}-R-${i}`} label={`R${num}`} isOccupied={occupied.has(`isl-${islandId}-R-${i}`)} />;
                            })}
                          </div>
                          <div className="absolute -bottom-5 text-[7px] text-center font-black text-slate-600 uppercase">T-0{islandId}</div>
                        </div>
                      ))}
                    </div>

                    <div className="relative -right-24 h-full w-10 z-10">
                      <div className="absolute inset-y-0 right-0 w-full bg-slate-800/20 border-r-4 border-y-2 border-l border-slate-700 rounded-md shadow-inner" />
                      <div className="absolute -left-10 h-full flex flex-col justify-around">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <SeatNode key={i} id={`wall-3-${i}`} label={`R${i + 20}`} isOccupied={occupied.has(`wall-3-${i}`)} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. SOUTH WING */}
                  <div className="absolute bottom-4 md:bottom-2 left-4 md:left-8 right-4 md:right-8 h-[18%] flex gap-3 items-end">
                    <div className="w-[30%] h-full flex flex-col justify-end pb-1">
                      <div className="relative w-full h-16 border-l-2 border-b-2 border-slate-700 rounded-bl-3xl flex items-center px-4 group">
                        <div className="absolute -bottom-[2px] left-0 w-12 h-12 border-t-2 border-r-2 border-primary/40 rounded-tr-full opacity-50" />
                        <div className="flex flex-col ml-10">
                          <span className="text-[10px] font-black text-primary uppercase animate-pulse">Entrance</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex gap-2 h-[75%]">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 border-2 rounded-xl flex items-center justify-center transition-all ${occupied.has(`cube-${i}`) ? "border-slate-700 bg-slate-900/40" : "border-primary/60 bg-primary/10 shadow-[0_0_10px_rgba(255,107,0,0.1)]"}`}
                        >
                          <Monitor className={`w-3.5 h-3.5 ${occupied.has(`cube-${i}`) ? "text-slate-700" : "text-primary"}`} />
                        </div>
                      ))}
                    </div>

                    <div className="w-[12%] h-[75%] border-2 border-slate-700 bg-slate-900/80 rounded-xl flex flex-col items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-slate-500 mb-0.5" />
                      <span className="text-[6px] font-black text-slate-500 uppercase">Stairs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive Legend */}
              <div className="mt-8 flex flex-wrap gap-4 md:gap-8 justify-center border-t border-white/10 pt-8">
                <LegendItem color="bg-primary" label="Available" />
                <LegendItem color="bg-slate-800" label="Occupied" border="border-slate-600" />
                <LegendItem color="bg-primary/10" border="border-primary/50" label="Group Room" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Components */
const SeatNode = ({ id, isOccupied, label }: any) => (
  <div
    className={`w-6 h-6 md:w-6 md:h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${isOccupied ? "bg-slate-800 border-slate-600 text-slate-500" : "bg-primary border-orange-400 shadow-[0_0_15px_rgba(255,107,0,0.3)] text-white hover:scale-110"}`}
  >
    <span className="text-[8px] md:text-[10px] font-black leading-none">{label}</span>
  </div>
);

const ZoneBox = ({ label, className, icon, active = false }: any) => (
  <div
    className={`border-2 rounded-xl flex flex-col items-center justify-center p-2 text-center ${active ? "border-primary/70 bg-primary/5" : "border-slate-700 bg-slate-900/40"} ${className}`}
  >
    <div className="mb-1">{icon}</div>
    <span className={`text-[8px] font-black uppercase leading-tight ${active ? "text-white" : "text-slate-500"}`}>{label}</span>
  </div>
);

const FacilityItem = ({ icon, label, price }: any) => (
  <div className="flex items-center justify-between group py-1 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-primary border border-slate-700">
        {icon}
      </div>
      <span className="text-[11px] font-bold text-slate-300 uppercase">{label}</span>
    </div>
    <span className="text-[10px] font-black text-primary italic">{price}</span>
  </div>
);

const LegendItem = ({ color, label, border = "border-transparent" }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color} border ${border}`} />
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
  </div>
);

export default ShiftFloorPlanFinal;