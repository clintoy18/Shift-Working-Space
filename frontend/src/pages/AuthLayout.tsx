import React from 'react';
import Navbar from '@/components/landing/Navbar';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen py-12 flex flex-col font-sans">
      {/* 🧭 Top Navigation */}
     <Navbar />
      {/* 📋 Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic">
              {title}
            </h1>
            <p className="text-slate-500 text-lg mt-4 font-medium max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          <div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;