"use client"

import { RootState } from "@/redux/store";
import React, { createContext, useContext, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

// Define the shape of the context
export const ScrollContext = createContext<{
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
    handleScroll: () => void;
    handleScrollBottom: () => void;
    handleButtonClick: () => void;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    scrollableContainerRef: { current: null },
    handleScroll: () => { },
    handleScrollBottom: () => { },
    handleButtonClick: () => { },
    isVisible: false,
    setIsVisible: () => { },
});

// Define the provider component
export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {

    const { responses } = useSelector((state: RootState) => state.responses);

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const stopAutoScroll = useRef(false);
    const isProgrammaticScroll = useRef(false);
    const lastScrollPosition = useRef<number>(0);
    const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

    const handleScrollBottom = useCallback(() => {
        const scrollableContainer = scrollableContainerRef.current;
        if (scrollableContainer) {
            isProgrammaticScroll.current = true;
            scrollableContainer.scrollTo({
                top: scrollableContainer.scrollHeight - 100,
                behavior: "smooth",
            });
        }
    }, [])

    const handleScroll = useCallback(() => {
        // const scrollableContainer = document.getElementById("AppScrollableContainer");
        const scrollableContainer = scrollableContainerRef.current;
        if (scrollableContainer) {
            const currentScrollPosition = scrollableContainer.scrollTop;

            if (isProgrammaticScroll.current) {
                isProgrammaticScroll.current = false;
                return;
            }

            const isScrollingUp = currentScrollPosition < lastScrollPosition.current;

            if (isScrollingUp) {
                setIsVisible(true);
                stopAutoScroll.current = true;
            } else {
                const isAtBottom =
                    Math.abs(scrollableContainer.scrollHeight - (currentScrollPosition + scrollableContainer.clientHeight)) < 1;
                if (isAtBottom) {
                    setIsVisible(false);
                    stopAutoScroll.current = false;
                }
            }

            lastScrollPosition.current = currentScrollPosition;
        }
    }, []);

    const handleButtonClick = useCallback(() => {
        handleScrollBottom();
        stopAutoScroll.current = false;
        setIsVisible(false);
    }, []);

    // const value = useMemo(() => ({
    //     scrollableContainerRef,
    //     handleScroll,
    //     handleScrollBottom,
    //     handleButtonClick,
    // }), [handleScroll, handleScrollBottom, handleButtonClick]);

    useEffect(() => {
        if (responses.length > 0 && !stopAutoScroll.current) {
            handleScrollBottom();
        }
    }, [responses]);

    return (
        <ScrollContext.Provider value={{
            scrollableContainerRef,
            handleScroll,
            handleScrollBottom,
            handleButtonClick,
            isVisible,
            setIsVisible
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
