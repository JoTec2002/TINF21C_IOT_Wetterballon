'use client'
import React, {createContext, ReactNode, useContext, useState} from 'react';

interface GlobalContextType {
    balloonId: number;
    setBalloonId: React.Dispatch<React.SetStateAction<number>>;
    flightId: number;
    setFlightId: React.Dispatch<React.SetStateAction<number>>;
}


const GlobalContext = createContext<GlobalContextType| undefined>(undefined);

export function GlobalProvider({ children } : { children: ReactNode}) {
    const [balloonId, setBalloonId] = useState(-1);
    const [flightId, setFlightId] = useState(-1);

    return (
        <GlobalContext.Provider value={{ balloonId, setBalloonId, flightId, setFlightId }}>
         {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useNumber must be used within a NumberProvider');
    }
    return context;
}