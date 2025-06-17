const preloader = document.querySelector('#preloader');

window.addEventListener('load', showHidePreloader);

gsap.from('#preloadpath-1', {
    duration: 1,
    delay: 1,
    ease: 'power2.in',
    y: 100,
    opacity: 0
});

gsap.to('#preloadpath-1', {
    y: 0
});

gsap.from('#preloadpath-2', {
    duration: 1,
    delay: 1,
    ease: 'power2.in',
    y: 100,
    opacity: 0
});

gsap.to('#preloadpath-2', {
    y: 0
});

gsap.from('#preloadpath-3', {
    duration: 1,
    delay: 1,
    ease: 'power2.in',
    y: -100,
    opacity: 0
});

gsap.to('#preloadpath-3', {
    y: 0
});

function showHidePreloader() {
    preloader.classList.add('d-none');
}