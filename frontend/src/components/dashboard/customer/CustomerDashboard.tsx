import React from "react";
import { Construction, Rocket, Clock, History, BarChart3 } from "lucide-react";

interface CustomerDashboardProps {
  shiftyUserId?: string;
}
export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ shiftyUserId: _shiftyUserId }) => {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full mb-4 sm:mb-6">
            <Construction className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase mb-2 sm:mb-3 px-4">
            Welcome to
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-orange-600 uppercase mb-4 sm:mb-6 px-4">
            Shift Workspace
          </h2>

          <div className="inline-block px-4 sm:px-6 py-2 bg-slate-900 text-white rounded-full mb-4 sm:mb-6 font-bold uppercase text-xs sm:text-sm tracking-wider">
            Coming Soon
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Your personal workspace dashboard is under development. 
            Soon you'll have powerful tools to manage your coworking experience.
          </p>
        </div>

        {/* Feature Grid - Responsive Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 sm:px-0">
          
          <FeatureCard 
            icon={<History className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="Check-in History"
            description="View all your past visits and track your workspace usage patterns"
            color="orange"
          />

          <FeatureCard 
            icon={<Clock className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="Hours Tracking"
            description="Monitor total hours spent and calculate your productivity metrics"
            color="blue"
          />

          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="Usage Analytics"
            description="Get insights into your workspace habits and optimize your schedule"
            color="purple"
          />

        </div>

        {/* CTA Section */}
        <div className="text-center px-4">
          <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
            In the meantime, explore our workspace floor plan:
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg uppercase tracking-wide text-sm sm:text-base"
          >
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View Available Seats</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// Feature Card Component - Fully Responsive
const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: 'orange' | 'blue' | 'purple';
}> = ({ icon, title, description, color }) => {
  const colors = {
    orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50 border-orange-200',
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-200',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-200',
  };

  return (
    <div className="bg-white border-2 border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${colors[color]} mb-3 sm:mb-4`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
};