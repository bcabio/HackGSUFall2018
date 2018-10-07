import * as React from 'react';

function subscribeRest<P>(
  WrappedComponent: React.ComponentType<P & { input: any }>,
  url: string
): React.ComponentType<P> {
  class HOC extends React.Component<P> {
    public state: any = {};
    private refetchTimer: number;

    public componentDidMount() {
      this.fetchData();
      this.refetchTimer = window.setInterval(() => this.fetchData(), 1000);
    }

    public componentWillUnmount() {
      window.clearInterval(this.refetchTimer);
    }

    public render() {
      return <WrappedComponent input={this.state} {...this.props} />;
    }

    private fetchData() {
      return fetch(url)
        .then(result => result.json())
        .then(parsedJson => this.setState(parsedJson));
    }
  }

  return HOC;
}

export default subscribeRest;
