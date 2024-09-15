import React from "react";

export class ComponentToPrint extends React.PureComponent {
  render() {
    const porps = this.props;
    return <div>My cool content {this.props}</div>;
  }
}
