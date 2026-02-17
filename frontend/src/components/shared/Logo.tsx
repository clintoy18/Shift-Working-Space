// components/shared/Logo.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logo = ({ redirectTo = "/" }) => {
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(redirectTo)} 
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
  );
};

export default Logo;