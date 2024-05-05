import React, { useEffect } from 'react';

const VisitedSites = () => {
  const addVisitedSite = (site) => {
    const storedVisitedSites = localStorage.getItem('visitedSites');
    let visitedSites = storedVisitedSites ? JSON.parse(storedVisitedSites) : [];

    if (!visitedSites.includes(site)) {
      visitedSites.push(site);
      localStorage.setItem('visitedSites', JSON.stringify(visitedSites));
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const currentURL = window.location.href;
        addVisitedSite(currentURL);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything, so return null
};

export default VisitedSites;
