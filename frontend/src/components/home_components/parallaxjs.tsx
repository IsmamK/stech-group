import Parallax from "parallax-js";
import React from "react";

interface ParallaxJSProps {
  children: React.ReactNode;
  className: string;
}

export default class ParallaxJS extends React.Component<ParallaxJSProps> {
  el: HTMLDivElement | null | undefined;
  componentDidMount() {
    var parallaxInstance = new Parallax(this.el, {
      relativeInput: true,
    });
  }

  render() {
    return (
      <div className={this.props.className} ref={(el) => (this.el = el)}>
        {this.props.children}
      </div>
    );
  }
}
