import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./Header.css";

const Header = ({ user, onLogout }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsDropdownOpen(false); // Fecha o dropdown após a navegação
  };

  return (
    <header className="hdr">
      <div className="hdr-lft">
        <button className="hdr-btn" onClick={() => handleNavigation("/artistas")}>
          Home
        </button>
      </div>
      <div className="hdr-rgt">
        {user ? (
          <div className="usr-prfl">
            <div className="usr-info" onClick={handleProfileClick}>
              <span className="usr-nm">{user.nome}</span>
              <img
                className="usr-avatar"
                src={user.avatar || "https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"} 
                alt="Avatar"
              />
            </div>
            {isDropdownOpen && (
              <div className="drpdwn-menu">
                <button
                  className="drpdwn-item"
                  onClick={() => handleNavigation("/perfil")}
                >
                  Perfil
                </button>
                <button
                  className="drpdwn-item"
                  onClick={() => handleNavigation("/favoritas")}
                >
                  Favoritas
                </button>
                <button className="drpdwn-item" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="hdr-btn"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
