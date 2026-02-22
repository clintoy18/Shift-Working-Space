import React from 'react';
import Navbar from '@/components/landing/Navbar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen py-12 flex flex-col font-sans">
      {/* 🧭 Top Navigation */}
     <Navbar />
      {/* 📋 Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;