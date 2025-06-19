var controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({
	triggerElement: ".event.event2",
	triggerHook: "onEnter",
	duration: "100%"
}).setPin(".events-page .event.event1 .pinWrapper",{
	pushFollowers: false
}).addTo(controller);

new ScrollMagic.Scene({
	triggerElement: ".event.event2",
	triggerHook: "onEnter",
	duration: "200%"
}).setPin(".events-page .event.event2 .pinWrapper",{
	pushFollowers: false
}).addTo(controller);

https://www.neom.com/en-us/sectors/education

new ScrollMagic.Scene({
	triggerElement: ".event.event3",
	triggerHook: "onEnter",
	duration: "200%"
}).setPin(".events-page .event.event3 .pinWrapper",{
	pushFollowers: false
}).addTo(controller);

new ScrollMagic.Scene({
	triggerElement: ".event.event4",
	triggerHook: "onEnter",
	duration: "100%"
}).setPin(".events-page .event.event4 .pinWrapper",{
	pushFollowers: false
}).addTo(controller);



$(document).ready(function(){

	// Init ScrollMagic
	var controller = new ScrollMagic.Controller();

	// Scene intro - pin the intro section
	// var tween = TweenMax.to(".background-container", 1, {scale:2, opacity:0, ease:Linear.easeNone});

	// Scene 1 - pin the second section
	var pinScene01 = new ScrollMagic.Scene({
		triggerElement: '#slide01',
		triggerHook: 0,
		duration: '100%'
	})
	.setPin('#slide01 .pin-wrapper')
	// .addIndicators()
	.addTo(controller);

	// Scene 2 - pin the third section
	var pinScene02 = new ScrollMagic.Scene({
		triggerElement: '#slide01',
		triggerHook: 0,
		duration: '200%'
	})
	.setPin('#slide02 .pin-wrapper')
	.addTo(controller);

});




// var controller = new ScrollMagic.Controller();

// // create a scene
// new ScrollMagic.Scene({
//     duration: 100,	// the scene should last for a scroll distance of 100px
//     offset: 50	// start this scene after scrolling for 50px
// })
// .setPin("#pin1") // pins the element for the the scene's duration
// .addTo(controller);




// $(function () { // wait for document ready
// 	// build scene
// 	var scene = new ScrollMagic.Scene({triggerElement: "#trigger1", duration: 300})
// 	.setPin("#pin1")
// 	.addIndicators({name: "1 (duration: 300)"}) // add indicators (requires plugin)
// 	.addTo(controller);
// });


//  window.onload = function () {
//     lax.init()

//     // Add a driver that we use to control our animations
//     lax.addDriver('scrollY', function () {
//       return window.scrollY
//     })

//     // Add animation bindings to elements
//     lax.addElements('#selection', {
//       scrollY: {
//         translateY: [
//           ["elInY", "elCenterY", "elOutY"],
//           [-140, 'screenHeight/4.25', 'screenHeight/1.18'],
//         ]
//       }
//     })
// }