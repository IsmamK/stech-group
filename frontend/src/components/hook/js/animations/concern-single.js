
gsap.from('.brandlogo', {
    duration: 1,
    delay: 1,
    ease: 'power2.in',
    y: -100,
    opacity: 0
});

gsap.to('.brandlogo', {
    y: 0
});

gsap.from('.concernaesthetics-title', {
    duration: 1.5,
    delay: 1.5,
    ease: 'power2.in',
    y: 40,
    opacity: 0
});

gsap.to('.concernaesthetics-title', {
    y: 0
});

gsap.from('.concernaesthetics-text', {
    duration: 2,
    delay: 2,
    ease: 'power2.in',
    y: 40,
    opacity: 0
});

gsap.to('.concernaesthetics-text', {
    y: 0
});

gsap.from('.concernaesthetics-body .link', {
    duration: 2.5,
    delay: 2.5,
    scale: 0,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.concernaesthetics-body .link', {
    scale: 1
});

gsap.from('.gallery-thumbs .gallery-link', {
    duration: 3,
    delay: 3,
    scale: 0,
    ease: 'power2.inOut',
    opacity: 0,
    stagger: 0.5
});

gsap.to('.gallery-thumbs .gallery-link', {
    scale: 1
});