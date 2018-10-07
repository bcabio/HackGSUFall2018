import * as React from 'react';
import { Alert } from 'react-bootstrap';

interface NfcReaderState {
  loadErrorMessage: string | null;
}

export interface NfcScan {
  records: Array<{
    recordType: 'text';
    data: string;
    mediaType: 'text/plain';
  }>;
}

interface NfcReaderProps {
  onNfcRead: (message: NfcScan) => void;
}

class NfcReader extends React.Component<NfcReaderProps, NfcReaderState> {
  constructor(props: NfcReaderProps) {
    super(props);
    this.state = { loadErrorMessage: null };
  }

  public componentDidMount() {
    try {
      (navigator as any).nfc.watch(
        (messages: NfcScan) => {
          this.props.onNfcRead(messages);
        },
        { mode: 'any' }
      );
    } catch (exc) {
      console.error(exc); // tslint:disable-line
      this.setState({ loadErrorMessage: exc.toString() });
    }
  }

  public render() {
    if (this.state.loadErrorMessage == null) {
      return null;
    } else {
      return (
        <Alert bsStyle="danger">
          <h4>Error loading NFC!</h4>
          <pre>{this.state.loadErrorMessage}</pre>
          <p>
            This page only supports Chrome on Android, perhaps trying that will
            work?
          </p>
        </Alert>
      );
    }
  }
}

export default NfcReader;
