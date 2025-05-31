import React, { useState } from 'react';
import ModernButton from './ModernButton';

const ModernHeader = ({ currentUser, onLogin, onLogout, onNavigate, currentPage }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    { key: 'home', label: 'Accueil', icon: '🏠' },
    { key: 'marketplace', label: 'Marché', icon: '🛍️' },
    { key: 'prices', label: 'Prix', icon: '💰' },
    { key: 'health', label: 'Santé', icon: '🩺' },
  ];

  const aviculteurItems = [
    { key: 'finances', label: 'Finances', icon: '📊' },
    { key: 'myproducts', label: 'Mes Annonces', icon: '📦' },
  ];

  const adminItems = [
    { key: 'admin', label: 'Admin', icon: '🛠️' },
    { key: 'download', label: 'Télécharger', icon: '📦' },
  ];

  const allItems = [
    ...navigationItems,
    ...(currentUser?.role === 'aviculteur' ? aviculteurItems : []),
    ...(currentUser?.role === 'aviculteur' && currentUser?.nom === 'Amadou Traoré' ? adminItems : []),
  ];

  return (
    <>
      {/* Header moderne */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo et marque */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate('home')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-green-900 font-bold text-2xl">🐔</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AviMarché</h1>
                <span className="text-green-200 text-sm font-medium">Mali • Plateforme Avicole</span>
              </div>
            </div>
            
            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {allItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    currentPage === item.key
                      ? 'bg-white/20 text-white shadow-md'
                      : 'text-green-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Menu Mobile Toggle */}
            <div className="lg:hidden flex items-center space-x-3">
              {currentUser && (
                <div className="text-right">
                  <div className="text-sm font-medium">{currentUser.nom.split(' ')[0]} 👋</div>
                  <div className="text-xs text-green-200">{currentUser.role}</div>
                </div>
              )}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {showMobileMenu ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Auth Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {currentUser.nom} 👋
                    </div>
                    <div className="text-xs text-green-200">
                      {currentUser.role === 'aviculteur' ? '🚜 Aviculteur' : '🛒 Acheteur'} • {currentUser.localisation}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-bold text-lg">
                      {currentUser.nom.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ModernButton
                    title="Déconnexion"
                    onClick={onLogout}
                    variant="outline"
                    size="small"
                    className="border-white/30 text-white hover:bg-white/10"
                  />
                </div>
              ) : (
                <ModernButton
                  title="Connexion"
                  onClick={onLogin}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-lg"
                />
              )}
            </div>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {showMobileMenu && (
          <div className="lg:hidden bg-green-700/95 backdrop-blur-sm border-t border-green-500/30">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {allItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    currentPage === item.key
                      ? 'bg-white/20 text-white shadow-md'
                      : 'text-green-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              {/* Auth Mobile */}
              <div className="border-t border-green-500/30 pt-4 mt-4">
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2">
                      <div className="text-white font-medium">{currentUser.nom}</div>
                      <div className="text-green-200 text-sm">
                        {currentUser.role === 'aviculteur' ? '🚜 Aviculteur' : '🛒 Acheteur'} • {currentUser.localisation}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white flex items-center space-x-3"
                    >
                      <span>🚪</span>
                      <span className="font-medium">Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onLogin();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 flex items-center space-x-3 font-semibold"
                  >
                    <span>🔑</span>
                    <span>Connexion</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default ModernHeader;