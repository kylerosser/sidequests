import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { Button } from "../common/Button";
import { ProfileMenu } from "./ProfileMenu";
import { Link } from "react-router-dom";

import wordmarkImage from "/wordmark.svg";
import menuIcon from "/menu_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg";
import closeIcon from "/close_24dp_193E55_FILL0_wght400_GRAD0_opsz24.svg";

type NavbarProps = {
  hideSignupButton?: boolean;
  hideLoginButton?: boolean;
};

export const Navbar = ({ hideSignupButton = false, hideLoginButton = false }: NavbarProps) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const loginSignupButtons = (
    <div className="flex flex-col gap-2 items-center md:flex-row md:gap-2">
      {!hideLoginButton && (
        <Link to="/login" className="cursor-pointer">
          <Button>Log in</Button>
        </Link>
      )}
      {!hideSignupButton && (
        <Link to="/signup" className="cursor-pointer">
          <Button variant="white">Sign Up</Button>
        </Link>
      )}
    </div>
  );

  const userInfo = <ProfileMenu />;

  const navLinks = (
    <div className="flex flex-col gap-2 items-center md:flex-row md:gap-6">
      <Link to="/quests" className="py-2 md:py-0 font-semibold text-center cursor-pointer">
        Quest map
      </Link>
      <Link to="/quests/create" className="py-2 md:py-0 font-semibold text-center cursor-pointer">
        Submit a quest
      </Link>
    </div>
  );

  return (
    <nav className="bg-white border-b border-sq-grey fixed w-full z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-2 md:p-4 h-15">
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img src={wordmarkImage} alt="Sidequests Logo" className="h-8" />
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks}
          {user ? userInfo : loginSignupButtons}
        </div>

        {/* Mobile menu icon */}
        <button
          className="md:hidden p-2 focus:outline-none cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <img src={isMobileMenuOpen ? closeIcon : menuIcon} alt="Menu icon" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sliding menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-start p-6 gap-4 relative">
          {/* Close button in top-right corner */}
          <button
            className="absolute top-4 right-4 p-2 focus:outline-none cursor-pointer"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <img src={closeIcon} alt="Close icon" className="h-6 w-6" />
          </button>

          {/* Nav links + login/profile */}
          {navLinks}
          {user ? userInfo : loginSignupButtons}
        </div>
      </div>
    </nav>
  );
};
