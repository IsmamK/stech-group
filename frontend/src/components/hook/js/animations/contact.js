// STECH AESTHETICS ANIMATION START
gsap.from('#ribbonicon', {
    stagger: 0.5
});

gsap.from('#path-1', {
    duration: 1,
    delay: 1,
    ease: 'power2.in',
    y: 100,
    opacity: 0
});

gsap.to('#path-1', {
    y: 0
});

gsap.from('#path-2', {
    duration: 1,
    delay: 1,
    ease: 'power2.in',
    y: 100,
    opacity: 0
});

gsap.to('#path-2', {
    y: 0
});

gsap.from('#path-3', {
    duration: 1,
    delay: 1,
    ease: 'power2.in',
    y: -100,
    opacity: 0
});

gsap.to('#path-3', {
    y: 0
});

gsap.from('.stechaesthetics-title', {
    duration: 1.5,
    delay: 1.5,
    y: 40,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.stechaesthetics-title', {
    y: 0
});

gsap.from('.stechaesthetics-text', {
    duration: 1.75,
    delay: 1.75,
    y: 20,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.stechaesthetics-text', {
    y: 0
});

// STECH AESTHETICS ANIMATION END


// CONTACT FORM ANIMATION START

gsap.from('.contactform', {
    duration: 1.75,
    delay: 1.75,
    y: -20,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.contactform', {
    y: 0
});

// CONTACT FORM ANIMATION END


// CONTACT INFO ANIMATION START

gsap.from('.contact-info-header', {
    duration: 2,
    delay: 2,
    y: 20,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.contact-info-header', {
    y: 0
});

gsap.from('.contact-info-body', {
    duration: 2.25,
    delay: 2.25,
    scale: 0,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.contact-info-body', {
    scale: 1
});

// CONTACT INFO ANIMATION END