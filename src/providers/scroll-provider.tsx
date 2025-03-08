"use client"

import { RootState } from "@/redux/store";
import React, { createContext, useContext, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

// Define the shape of the context
export const ScrollContext = createContext<{
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
    handleScrollBottom: () => void;
}>({
    scrollableContainerRef: { current: null },
    handleScrollBottom: () => { },
});

// Define the provider component
export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {

    const { responses } = useSelector((state: RootState) => state.responses);

    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    const handleScrollBottom = useCallback(() => {
        const scrollableContainer = scrollableContainerRef.current;
        if (scrollableContainer) {
            scrollableContainer.scrollTo({
                top: scrollableContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [])

    useEffect(() => {
        if (responses.length > 0) {
            handleScrollBottom();
        }
    }, [responses]);

    return (
        <ScrollContext.Provider value={{
            scrollableContainerRef,
            handleScrollBottom,
        }}>
            {children}
        </ScrollContext.Provider>
    );
};

// Custom hook to access the Scroll context
export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScroll must be used within a ScrollProvider');
    }
    return context;
};
