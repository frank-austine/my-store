'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function animateCartOpen(element: HTMLElement): void {
  gsap.fromTo(
    element,
    { x: '100%', opacity: 0 },
    { x: '0%', opacity: 1, duration: 0.35, ease: 'power3.out' }
  );
}

export function animateCartClose(element: HTMLElement, onComplete: () => void): void {
  gsap.to(element, {
    x: '100%',
    opacity: 0,
    duration: 0.25,
    ease: 'power3.in',
    onComplete,
  });
}

export function animateFadeInUp(elements: HTMLElement[] | NodeListOf<Element>): void {
  gsap.fromTo(
    elements,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    }
  );
}

export function animateOnScroll(element: HTMLElement): void {
  gsap.fromTo(
    element,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
      },
    }
  );
}