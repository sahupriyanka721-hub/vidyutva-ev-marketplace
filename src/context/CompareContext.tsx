import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompareContextType {
  comparedVehicleIds: string[];
  addVehicleToCompare: (vehicleId: string) => boolean;
  removeVehicleFromCompare: (vehicleId: string) => void;
  isVehicleInCompare: (vehicleId: string) => boolean;
  clearCompare: () => void;
  maxVehicles: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedVehicleIds, setComparedVehicleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('evahan_compare_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return ['veh-eglide-pro', 'veh-sprint-plus'];
    } catch {
      return ['veh-eglide-pro', 'veh-sprint-plus'];
    }
  });

  useEffect(() => {
    localStorage.setItem('evahan_compare_ids', JSON.stringify(comparedVehicleIds));
  }, [comparedVehicleIds]);

  const addVehicleToCompare = (vehicleId: string): boolean => {
    if (comparedVehicleIds.includes(vehicleId)) return true;
    if (comparedVehicleIds.length >= 4) {
      alert('You can compare a maximum of 4 vehicles at once. Remove one to add another.');
      return false;
    }
    setComparedVehicleIds(prev => [...prev, vehicleId]);
    return true;
  };

  const removeVehicleFromCompare = (vehicleId: string) => {
    setComparedVehicleIds(prev => prev.filter(id => id !== vehicleId));
  };

  const isVehicleInCompare = (vehicleId: string) => comparedVehicleIds.includes(vehicleId);

  const clearCompare = () => setComparedVehicleIds([]);

  return (
    <CompareContext.Provider
      value={{
        comparedVehicleIds,
        addVehicleToCompare,
        removeVehicleFromCompare,
        isVehicleInCompare,
        clearCompare,
        maxVehicles: 4,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
};
