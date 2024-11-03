import React, { useState, useEffect } from 'react';
import logo from "./assets/gdscLogo.png";
const LogoLoadingAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    // Start logo entrance animation
    setTimeout(() => setAnimationStage(1), 100);
    // Start exit animation
    setTimeout(() => setAnimationStage(2), 2000);
    // Remove component
    setTimeout(() => setIsLoading(false), 2500);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white
      ${animationStage === 2 ? 'animate-fadeOut' : ''}`}>
      <div className={`transform transition-all duration-1000 ease-out
        ${animationStage === 0 ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Replace this div with your actual logo */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center">
          <img 
            src={logo} 
            alt="GDSC Logo" 
            className="w-32 h-32 rounded-lg object-cover"
          />
          </div>
          
          {/* Loading dots */}
          <div className="mt-4 flex space-x-2">
            <div className={`w-3 h-3 bg-blue-500 rounded-full animate-bounce`} 
                 style={{ animationDelay: '0ms' }}></div>
            <div className={`w-3 h-3 bg-blue-500 rounded-full animate-bounce`}
                 style={{ animationDelay: '150ms' }}></div>
            <div className={`w-3 h-3 bg-blue-500 rounded-full animate-bounce`}
                 style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component to handle loading state
const WithLogoAnimation = ({ children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2500); // Match this with the total animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LogoLoadingAnimation />
      <div className={`transition-opacity duration-500 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}>
        {children}
      </div>
    </>
  );
};

// Add these custom animations to your Tailwind config
const customStyles = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .animate-fadeOut {
    animation: fadeOut 0.5s ease-out forwards;
  }
`;

// Add this style tag to your app
const StyleTag = () => (
  <style>{customStyles}</style>
);

export { WithLogoAnimation, StyleTag };