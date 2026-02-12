import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react"; // Added Menu icons for the button
import { useAuth } from "../../context/AuthContext";
import Button from "./Button";
import Logo from "../shared/Logo";

const Header = () => {
  const { handleLogout, user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const name = `${user.FirstName} ${user.MiddleName} ${user.LastName}`;
  const role = user.Role;

  const handleLogoutHandler = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* CONTAINER: 
          mx-auto centers the content.
          px-4 sm:px-6 lg:px-8 adds responsive padding (margin-equivalent).
          max-w-7xl prevents the header from getting too wide on large screens.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16"> 
          
          <Logo redirectTo="/" />

          {/* Mobile Menu Button - Added an icon so it's visible */}
          <button 
            className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop User Section */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">{name}</span>
                <span className="text-xs text-gray-500">{role}</span>
              </div>
            </div>
            
            <Button
              onClick={handleLogoutHandler}
              label="Sign out"
              icon={<LogOut className="w-4 h-4" />}
              className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              variant="ghost"
            />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="sm:hidden pb-4 pt-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
            <Button
              onClick={handleLogoutHandler}
              label="Sign out"
              icon={<LogOut className="w-4 h-4" />}
              className="w-full justify-center py-3 text-red-600 hover:bg-red-50"
              variant="ghost"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;