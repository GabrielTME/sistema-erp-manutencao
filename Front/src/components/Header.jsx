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
        <button className="settings-button" onClick={() => setSettingsOpen(!settingsOpen)} title="Configurações">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84a.484.484 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.487.487 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path>
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
