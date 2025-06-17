import React from "react";
import Parallax from "parallax-js";

export default class ParallaxJS extends React.Component {
  constructor(props) {
    super(props);
    this.el = null;
  }

  componentDidMount() {
    new Parallax(this.el, {
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