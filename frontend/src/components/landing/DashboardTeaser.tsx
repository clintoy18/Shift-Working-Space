import { Button } from "@/components/ui/button";
import { useState } from "react";

const DashboardTeaser = () => {
  const rows = ["A", "B", "C", "D"];
  const cols = [1, 2, 3, 4, 5, 6];

  // Static occupied seats (visual only)
  const [occupied] = useState<Set<string>>(
    new Set(["A3", "B2", "C6", "D4"])
  );

  const getSeatType = (id: string): "chair" | "table" | "room" => {
    const col = parseInt(id.slice(1), 10);
    if (col % 5 === 0) return "room";
    if (col % 3 === 0) return "table";
    return "chair";
  };

  const SeatIcon = ({ type }: { type: "chair" | "table" | "room" }) => {
    const paths = {
      chair:
        "M6 7v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7 M4 15v2a1 1 0 0 0 1 1h1 M20 15v2a1 1 0 0 1-1 1h-1",
      table: "M3 8h18v4H3z M6 12v6 M18 12v6",
      room: "M3 3h18v18H3z M9 12h2v4",
    };

    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={paths[type]} />
      </svg>
    );
  };

  return (
    <section className="py-24 relative bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2070&q=80"
          className="w-full h-full object-cover opacity-30"
          alt="Office Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-primary/10" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Live Availability
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Work where you <span className="text-primary">feel inspired.</span>
            </h2>

            <p className="text-lg text-slate-300 mb-8">
              View real-time workspace availability and explore the layout
              before you arrive. No booking required.
            </p>

            <Button size="lg" className="px-8 shadow-lg shadow-primary/20">
              Be a member
            </Button>
          </div>

          {/* Right: View-Only Floor Map */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-3xl">
              <div className="mb-8">
                <h3 className="text-white font-bold text-xl">Floor Map</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Live workstation availability
                </p>
              </div>

              {/* Seat Grid */}
              <div className="space-y-4">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-4">
                    <span className="w-4 text-xs font-bold text-slate-500 uppercase">
                      {row}
                    </span>

                    <div className="flex-1 grid grid-cols-6 gap-3">
                      {cols.map((col) => {
                        const id = `${row}${col}`;
                        const isOccupied = occupied.has(id);
                        const type = getSeatType(id);

                        return (
                          <div
                            key={id}
                            className={`
                              group relative aspect-square rounded-xl flex items-center justify-center
                              ${
                                isOccupied
                                  ? "bg-slate-800/50 text-slate-600 border border-transparent"
                                  : "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                              }
                            `}
                          >
                            <SeatIcon type={type} />

                            {/* Tooltip */}
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {isOccupied ? "Occupied" : "Available"} •{" "}
                              {type.toUpperCase()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-10 pt-6 border-t border-white/10 flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="text-[10px] text-slate-500 uppercase">
                    Occupied
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-[10px] text-slate-500 uppercase">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardTeaser;
