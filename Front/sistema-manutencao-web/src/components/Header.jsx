import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="header">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="header-logo">
          <div className="erp-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="#2563EB"/>
              <text 
                x="50%" 
                y="50%" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                fill="white" 
                fontSize="40" 
                fontWeight="bold" 
                fontFamily="sans-serif">
                ERP
              </text>
            </svg>
          </div>
          <div className="header-title-group">
            <span className="header-title">Sistema ERP Manutenção</span>
            <span className="header-subtitle">Gestão de Ordens de Serviço</span>
          </div>
        </div>
      </Link>
      
      <div className="settings-container">
        <button className="settings-button" onClick={() => setSettingsOpen(!settingsOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>

        {settingsOpen && (
          <div className="settings-menu">
            <div className="setting-item">
              <span>Modo Escuro</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  onChange={toggleTheme}
                  checked={theme === 'dark'}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
