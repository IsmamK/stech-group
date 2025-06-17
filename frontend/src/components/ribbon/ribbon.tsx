import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function Ribbon() {
  const ribbonicon = useRef<any>();
  const path1 = useRef<any>();
  const path2 = useRef<any>();
  const path3 = useRef<any>();
  useEffect(() => {
    gsap.from(ribbonicon.current, {
      scrollTrigger: ribbonicon.current,
      stagger: 0.5,
    });

    gsap.from(path1.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: 100,
      opacity: 0,
    });

    gsap.to(path1.current, {
      scrollTrigger: path2.current,
      y: 0,
    });

    gsap.from(path2.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: 100,
      opacity: 0,
    });

    gsap.to(path2.current, {
      scrollTrigger: path2.current,
      y: 0,
    });

    gsap.from(path3.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: -100,
      opacity: 0,
    });

    gsap.to(path3.current, {
      scrollTrigger: path2.current,
      y: 0,
    });
  });
  return (
    <svg
      id="ribbonicon"
      ref={ribbonicon}
      width="112"
      height="200"
      viewBox="0 0 112 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="path-1"
        ref={path1}
        d="M67.7462 43.9424V84.0862C67.7462 84.0862 59.0501 85.9913 50.2721 93.0862L44.1123 99.0648V67.5822L67.7462 43.9424Z"
        fill="#00FFAD"
      />
      <path
        id="path-2"
        ref={path2}
        d="M111.695 0V99.0649C111.695 99.0649 104.454 87.774 87.7749 83.6772C87.8918 83.4726 87.7749 73.2803 87.7749 73.2803V23.9203L111.695 0Z"
        fill="#00FFAD"
      />
      <path
        id="path-3"
        ref={path3}
        d="M111.572 122.588V136.427L87.5994 160.4V141.108L87.576 122.588C87.5994 117.176 83.1929 112.775 77.7812 112.775C72.3694 112.775 67.9629 117.182 67.9629 122.588V166.203C67.9629 174.572 64.9122 182.239 59.8512 188.154C58.7057 189.492 57.4609 190.743 56.1167 191.888C50.2141 196.943 42.5465 200 34.1659 200C32.4302 200 30.7529 199.86 29.0932 199.638C21.8055 198.527 15.26 195.073 10.269 190.1C5.58199 185.395 2.26833 179.335 0.953384 172.567C0.871566 172.141 0.813121 171.702 0.731302 171.276C0.49169 169.622 0.368965 167.921 0.368965 166.203V139.197L0.304688 139.255L0.328051 139.197V111.361L24.3243 87.3647V100.801L24.3477 100.777V166.203C24.3477 171.615 28.7484 175.998 34.1425 175.998C39.5718 175.998 43.9783 171.615 43.9783 166.203V122.588C43.9783 117.077 45.2933 111.887 47.6309 107.299C50.9446 100.795 56.2745 95.5232 62.82 92.2914C66.0927 90.655 69.6694 89.5446 73.4447 89.0595C74.859 88.8784 76.2909 88.779 77.7695 88.779C79.2013 88.779 80.6331 88.8842 82.0533 89.0595C82.3162 89.0829 82.5792 89.118 82.8364 89.1589C90.1299 90.2693 96.652 93.7057 101.643 98.6966C106.634 103.688 110.088 110.233 111.181 117.527C111.455 119.175 111.572 120.869 111.572 122.588Z"
        fill="#00FFAD"
      />
    </svg>
  );
}

export default Ribbon;
