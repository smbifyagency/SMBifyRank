'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
    options: UseScrollRevealOptions = {}
): [RefObject<T | null>, boolean] {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return [ref, isVisible];
}

// Higher-order component for scroll reveal sections
export function ScrollRevealSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'left' | 'right' | 'none';
}) {
    const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

    const directionClass = {
        up: 'scroll-reveal',
        left: 'scroll-reveal-left',
        right: 'scroll-reveal-right',
        none: 'scroll-reveal',
    }[direction];

    return (
        <div
            ref={ref}
            className={`${directionClass} ${isVisible ? 'visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default useScrollReveal;
