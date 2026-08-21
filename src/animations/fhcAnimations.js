import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let animationContext = null;
let lenisInstance = null;
let lenisTickerCallback = null;
let lenisScrollHandler = null;

const prefersReducedMotion = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const setInitialStates = (root) => {
  const layers = root.querySelectorAll("[data-fhc-animate]");
  gsap.set(layers, { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" });
};

const attachButtonRipple = (root) => {
  const buttons = root.querySelectorAll("[data-fhc-button]");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.style.position = "absolute";
      ripple.style.inset = "0";
      ripple.style.borderRadius = "9999px";
      ripple.style.background = "rgba(251, 191, 36, 0.25)";
      ripple.style.transform = "scale(0)";
      ripple.style.opacity = "0.8";
      ripple.style.pointerEvents = "none";
      ripple.style.transformOrigin = "center";
      ripple.style.zIndex = "0";
      button.style.position = "relative";
      button.style.overflow = "hidden";
      button.appendChild(ripple);

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transform = "translate(-50%, -50%) scale(0)";

      gsap.fromTo(
        ripple,
        { opacity: 0.9, scale: 0, x: x, y: y },
        { opacity: 0, scale: 2.4, duration: 0.45, ease: "power2.out", onComplete: () => ripple.remove() }
      );
    });
  });
};

const initLenis = () => {
  if (typeof window === "undefined") {
    return () => {};
  }

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    touchMultiplier: 1.2,
    smoothTouch: false,
    lerp: 0.08,
  });

  lenisScrollHandler = () => ScrollTrigger.update();
  if (typeof lenisInstance.on === "function") {
    lenisInstance.on("scroll", lenisScrollHandler);
  }

  lenisTickerCallback = (time) => {
    if (lenisInstance && typeof lenisInstance.raf === "function") {
      lenisInstance.raf(time * 1000);
    }
  };
  gsap.ticker.add(lenisTickerCallback);
  gsap.ticker.lagSmoothing(0);

  const refreshHandler = () => {
    try {
      if (typeof lenisInstance?.resize === "function") {
        lenisInstance.resize();
      }
    } catch (e) {
      console.warn("lenis resize error", e);
    }
  };

  ScrollTrigger.addEventListener("refresh", refreshHandler);
  ScrollTrigger.refresh();

  return () => {
    if (typeof lenisInstance?.off === "function" && typeof lenisScrollHandler === "function") {
      lenisInstance.off("scroll", lenisScrollHandler);
    }
    lenisScrollHandler = null;

    if (typeof gsap.ticker.remove === "function" && typeof lenisTickerCallback === "function") {
      gsap.ticker.remove(lenisTickerCallback);
    }
    lenisTickerCallback = null;

    ScrollTrigger.removeEventListener("refresh", refreshHandler);

    try {
      if (typeof lenisInstance?.destroy === "function") {
        lenisInstance.destroy();
      }
    } catch (e) {
      console.warn("lenis destroy error", e);
    }
    lenisInstance = null;
  };
};

export function initFhcAnimations(root) {
  if (!root || typeof window === "undefined") {
    return;
  }

  cleanupFhcAnimations();

  if (prefersReducedMotion()) {
    setInitialStates(root);
    return;
  }

  const cleanupLenis = initLenis();

  animationContext = gsap.context(() => {
    const sections = root.querySelectorAll("[data-fhc-section]");
    const decorativeBlobs = root.querySelectorAll("[data-fhc-bg]");
    const cardItems = root.querySelectorAll("[data-fhc-card]");
    const headingItems = root.querySelectorAll("[data-fhc-heading]");
    const copyItems = root.querySelectorAll("[data-fhc-copy]");
    const statItems = root.querySelectorAll("[data-fhc-stat]");
    const imageItems = root.querySelectorAll("[data-fhc-image]");
    const parallaxBg = root.querySelectorAll("[data-fhc-parallax-bg]");
    const parallaxCard = root.querySelectorAll("[data-fhc-parallax-card]");
    const buttonItems = root.querySelectorAll("[data-fhc-button]");
    const header = root.querySelector("header");
    const heroSection = sections[0];
    const heroHeading = heroSection?.querySelector("[data-fhc-heading]");
    const heroCopy = heroSection?.querySelectorAll("[data-fhc-copy]");

    if (header) {
      gsap.fromTo(
        header,
        { backgroundColor: "rgba(255,255,255,0.88)", boxShadow: "0 0 0 rgba(15,23,42,0)" },
        {
          backgroundColor: "rgba(255,255,255,0.98)",
          boxShadow: "0 24px 70px rgba(15,23,42,0.08)",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=120",
            scrub: 0.4,
          },
        }
      );
    }

    if (heroSection) {
      gsap.fromTo(
        heroSection,
        { opacity: 0, y: 36, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
      );

      if (heroHeading) {
        gsap.fromTo(
          heroHeading,
          { opacity: 0, y: 42, rotation: -2 },
          { opacity: 1, y: 0, rotation: 0, duration: 1.1, ease: "expo.out", delay: 0.18 }
        );
      }

      if (heroCopy?.length) {
        gsap.fromTo(
          heroCopy,
          { opacity: 0, y: 24, filter: "blur(5px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.25,
          }
        );
      }
    }

    if (!prefersReducedMotion() && buttonItems && buttonItems.length) {
      buttonItems.forEach((btn, i) => {
        gsap.to(btn, {
          y: 4,
          boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
          duration: 4 + (i % 3) * 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        const shimmer = document.createElement('span');
        Object.assign(shimmer.style, {
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)',
          transform: 'translateX(-120%)',
          opacity: '0',
          borderRadius: 'inherit',
        });

        btn.style.position = btn.style.position || 'relative';
        btn.style.overflow = btn.style.overflow || 'hidden';
        btn.appendChild(shimmer);

        gsap.timeline({ repeat: -1, repeatDelay: 6 + i * 0.8 })
          .to(shimmer, { xPercent: 220, opacity: 1, duration: 0.95, ease: 'power2.out' })
          .to(shimmer, { opacity: 0, duration: 0.55, ease: 'power1.out' }, '+=0');

        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, {
            scale: 1.04,
            boxShadow: '0 22px 55px rgba(245,158,11,0.22)',
            duration: 0.25,
            ease: 'power2.out',
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            scale: 1,
            boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
            duration: 0.25,
            ease: 'power2.out',
          });
        });

        btn.addEventListener('pointerdown', () => {
          gsap.to(btn, {
            scale: 0.98,
            duration: 0.12,
            ease: 'power2.inOut',
          });
        });

        btn.addEventListener('pointerup', () => {
          gsap.to(btn, {
            scale: 1.04,
            duration: 0.14,
            ease: 'power2.out',
          });
        });
      });
    }

    sections.forEach((section, index) => {
      const configMap = [
        { y: 80, x: 0, scale: 0.96, blur: 16 },
        { y: 40, x: -50, scale: 0.98, blur: 12 },
        { y: 40, x: 50, scale: 0.98, blur: 12 },
        { y: 30, x: 0, scale: 0.97, blur: 14 },
        { y: 50, x: 0, scale: 0.95, blur: 10 },
      ];
      const config = configMap[index] || configMap[0];
      const fromProps = {
        opacity: 0,
        y: config.y,
        x: config.x,
        scale: config.scale,
        filter: `blur(${config.blur}px)`,
      };
      const toProps = {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
      };

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 30%",
          scrub: 0.8,
        },
      })
        .fromTo(section, fromProps, {
          ...toProps,
          ease: "power3.out",
          duration: 1.2,
        })
        .to(section, {
          opacity: 0.75,
          y: -20,
          scale: 0.995,
          ease: "power1.out",
          duration: 1.1,
        }, 0.5);
    });

    decorativeBlobs.forEach((blob, index) => {
      gsap.to(blob, {
        x: index % 2 === 0 ? 22 : -22,
        y: index % 2 === 0 ? 22 : -22,
        rotation: index % 2 === 0 ? 8 : -8,
        duration: 10 + index * 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    gsap.fromTo(
      headingItems,
      { opacity: 0, y: 24, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingItems[0] || root,
          start: "top 90%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      copyItems,
      { opacity: 0, y: 20, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: copyItems[0] || root,
          start: "top 90%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      statItems,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statItems[0] || root,
          start: "top 92%",
          once: true,
        },
      }
    );

    ScrollTrigger.batch(cardItems, {
      interval: 0.12,
      batchMax: 6,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { opacity: 0, y: 48, scale: 0.96, rotate: 6, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
          }
        );
      },
    });

    cardItems.forEach((card, index) => {
      gsap.to(card, {
        x: index % 2 === 0 ? 8 : -8,
        y: index % 3 === 0 ? 6 : -6,
        duration: 9 + index * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -8, scale: 1.02, rotate: -1.4, duration: 0.25, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, scale: 1, rotate: 0, duration: 0.25, ease: "power2.out" });
      });
    });

    imageItems.forEach((image) => {
      gsap.fromTo(
        image,
        { opacity: 0.55, scale: 1.08, rotate: -1.5, filter: "blur(5px)" },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: image,
            start: "top 95%",
            end: "top 60%",
            scrub: 0.6,
          },
        }
      );
    });

    if (parallaxBg && parallaxBg.length) {
      gsap.to(parallaxBg, {
        yPercent: -16,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    if (parallaxCard && parallaxCard.length) {
      gsap.to(parallaxCard, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    attachButtonRipple(root);
  }, root);

  return () => {
    cleanupLenis();
    cleanupFhcAnimations();
  };
}

export function cleanupFhcAnimations() {
  if (animationContext) {
    animationContext.revert();
    animationContext = null;
  }

  if (typeof ScrollTrigger !== "undefined" && typeof ScrollTrigger.getAll === "function") {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger && typeof trigger.kill === "function") {
        try {
          trigger.kill();
        } catch (e) {
          /* ignore individual trigger kill errors */
        }
      }
    });
  }

  if (lenisInstance) {
    try {
      if (typeof lenisInstance.destroy === "function") {
        lenisInstance.destroy();
      }
    } catch (e) {
      console.warn("lenis destroy error during cleanup:", e);
    }
  }
  lenisInstance = null;
}
