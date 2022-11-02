
import React from "react";
import vmsg from "vmsg";
import {RiDeleteBinFill} from 'react-icons/ri';
import MicIcon from '@mui/icons-material/Mic';
import SendRoundedIcon from '@mui/icons-material/SendRounded';


const recorder = new vmsg.Recorder({ wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm" });
class Record extends React.Component {
  state = {
    isLoading: false,
    isRecording: false,
    recordings: [],
    isRunning: false,
    mm: 0,
    ss: 0,
    ms: 0
  };

  timerID = 0;

  clickHandler = () => {
    let { isRunning, mm, ss, ms } = this.state;
    if (isRunning) {
      clearInterval(this.timerID);
    } else {
      this.timerID = setInterval(() => {
        ms++;
        if (ms >= 100) {
          ss++;
          ms = 0;
        }
        if (ss >= 60) {
          mm++;
          ss = 0;
        }
        this.setState({ mm, ss, ms });
      }, 10);
    }
    this.setState({ isRunning: !isRunning });
    this.setState({ mm: 0 });
    this.setState({ ss: 0 });
    this.setState({ ms: 0 });
    console.log(this.state.ms);
  }

  format(num) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  handleReset() {
    this.setState({ isRunning: false })
  }

  record = async () => {
    console.log('recording..');
    this.clickHandler();
    this.setState({ isActive: true })
    this.setState({ isLoading: true });

    if (this.state.isRecording) {
      const blob = await recorder.stopRecording();
      this.setState({
        isLoading: false,
        isRecording: false
      });
      this.props.onStopRecording(blob);
    } else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        this.setState({ isLoading: false, isRecording: true });
      } catch (e) {
        console.error(e);
        this.setState({ isLoading: false });
      }
    }
  };

  render() {
    const { isRecording, recordings, } = this.state;
    return (
      <React.Fragment>
         {
          isRecording && <RiDeleteBinFill style={{cursor: 'pointer', color:'red',fontSize:'30px',marginRight:'20px'}} onClick={async () => {
            recorder.stopRecording()
            this.setState({ isLoading: false, isRecording: false, mm: 0, ss: 0, ms: 0, isRunning: true });
            this.clickHandler()
          }} />}
          
        {isRecording ?
          (
            <div>
              <span>{this.format(this.state.mm)}</span>:
              <span>{this.format(this.state.ss)}</span>
              {/* <span>{this.format(this.state.ms)}</span> */}
            </div>
          )
          :
          null
        }
        {isRecording ?
          <SendRoundedIcon style={{
            cursor: 'pointer',
            fontSize: '30px', color: '#128c7e',
          }} onClick={this.record} />
          :
          <div data-toggle="tooltip" data-placement="top" title="Record a message">
          <MicIcon style={{ cursor: 'pointer', color: '#128c7e' }}
            sx={{ fontSize: '30px' }}
            onClick={this.record}
          />
          </div>
        }
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recordings.map(url => (
            <li key={url}>
              <audio src={url} controls />
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default Record;