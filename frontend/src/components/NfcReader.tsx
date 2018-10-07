import * as React from 'react';

interface NfcReaderState {
  successMounting: boolean;
}

interface NfcMessage {
  records: Array<{ recordType: string; data: any }>;
}

interface NfcReaderProps {
  onCardRead: (message: NfcMessage) => void;
}

class NfcReader extends React.Component<NfcReaderProps, NfcReaderState> {
  constructor(props: NfcReaderProps) {
    super(props);
    this.state = { successMounting: false };
  }

  public componentDidMount() {
    try {
      (navigator as any).nfc.watch(
        (messages: NfcMessage) => {
          this.props.onCardRead(messages);
        },
        { mode: 'any' }
      );
    } catch (exc) {
      console.error(exc); // tslint:disable-line
    }
    this.setState({ successMounting: true });
  }

  public render() {
    return <React.Fragment />;
  }
}

export default NfcReader;
