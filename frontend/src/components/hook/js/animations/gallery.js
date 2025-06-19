
// STECH-GALLERY ANIMATION START
gsap.from('.left-thumbs', {
    duration: .75,
    delay: .75,
    x: -40,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.left-thumbs', {
    x: 0
});

gsap.from('.right-thumbs', {
    duration: .75,
    delay: .75,
    x: 40,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.right-thumbs', {
    x: 0
});

gsap.from('.fullscreenvideo-thumbs', {
    duration: 1.25,
    delay: 1.25,
    y: -40,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.fullscreenvideo-thumbs', {
    y: 0
});

gsap.from('.videorow', {
    duration: 1.75,
    delay: 1.75,
    y: 40,
    ease: 'power2.inOut',
    opacity: 0
});

gsap.to('.videorow', {
    y: 0
});
// STECH-GALLERY ANIMATION END

gsap.from('.stechgallerybox .gallery-thumbs', {
    duration: 1,
    delay: 1,
    scale: 0,
    ease: 'power2.inOut',
    opacity: 0,
    stagger: 0.5
});

gsap.to('.stechgallerybox .gallery-thumbs', {
    scale: 1
});

gsap.from('.stechgallerybox .video-thumbs', {
    duration: 1,
    delay: 1,
    scale: 0,
    ease: 'power2.inOut',
    opacity: 0,
    stagger: 0.5
});

gsap.to('.stechgallerybox .video-thumbs', {
    scale: 1
});
