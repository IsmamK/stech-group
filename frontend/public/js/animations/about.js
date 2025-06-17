// let controller = new ScrollMagic.Controller();

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// let scene = new ScrollMagic.Scene({
//     triggerElement: '.stechaesthetics'
// })
// .setClassToggle('.big-title-1', 'changed')
// .addTo(controller)

// .setTween('scene-2 h2', {
//     y: '40'
// })

gsap.registerPlugin(ScrollTrigger);

gsap.to('#scene-2', {
    scrollTrigger: {
        trigger: '.stechaesthetics',
        start: 'top center',
        marker: true,
        toggleActions: 'play none reverse none'
    },
    // y: 70.8 + 'vh',
    // rotation: 360,
    duration: 2
});