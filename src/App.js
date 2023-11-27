import './App.css';
import {useState, useEffect} from 'react';
import * as metronome from './metronome';
import * as tempoLib from './tempoLib';

const DEFAULT_SETTINGS_BY_RHYTHM = {
  reel: {
    tempo: 108,
    swing: 0.06,
  },
  jig: {
    tempo: 120,
    swing: 0.10,
  },
  hornpipe: {
    tempo: 176,
    swing: 0.12,
  },
  "slip jig": {
    tempo: 120,
    swing: 0.10,
  },
  polka: {
    tempo: 126,
    swing: 0,
  },
  slide: {
    tempo: 144,
    swing: 0.33,
  },
};
const DEFAULT_RHYTHM = 'reel';

const DEFAULT_VOLUME = [
  { name: 'global', value: 700 },
  { name: 'kick', value: 700 },
  { name: 'woodblock', value: 700 },
  { name: 'click', value: 700 },
  { name: 'rimshot', value: 700 },
];

function RhythmLink(props) {
  function handleClick(e) {
    e.preventDefault();
    props.onClick(e);
  }

  if (props.isSelected) {
    return <b>{props.children}</b>;
  } else {
    return <a href='#' onClick={handleClick}>{props.children}</a>;
  }
}

function App() {
  useEffect(() => {
    metronome.initialize(DEFAULT_RHYTHM, DEFAULT_SETTINGS_BY_RHYTHM[DEFAULT_RHYTHM].tempo, DEFAULT_SETTINGS_BY_RHYTHM[DEFAULT_RHYTHM].swing)
  }, []);

  const [isTicking, setIsTicking] = useState(false);

  const [settingsByRhythm, setSettingsByRhythm] = useState(DEFAULT_SETTINGS_BY_RHYTHM);
  const [rhythm, setRhythmState] = useState(DEFAULT_RHYTHM);

  const [volumes, setVolumes] = useState(DEFAULT_VOLUME);

  const tempo = settingsByRhythm[rhythm].tempo;
  const swing = settingsByRhythm[rhythm].swing;

  const setRhythm = (rhythm) => {
    const isTicking = metronome.isTicking();

    // TODO validate value of rhythm param
    setRhythmState(rhythm);

    if (isTicking) metronome.stopTicking();

    metronome.setRhythm(rhythm);
    metronome.setBpm(settingsByRhythm[rhythm].tempo)

    if (isTicking) {
      setTimeout(() => {
        metronome.startTicking();
      }, 25);
    }
  }

  const setTempo = (bpm) => {
    if (bpm < 20.0) {
      bpm = 20.0;
    } else if (bpm > 800.0) {
      bpm = 800.0;
    }
    const newSettingsByRhythm = JSON.parse(JSON.stringify(settingsByRhythm));
    newSettingsByRhythm[rhythm].tempo = bpm;
    setSettingsByRhythm(newSettingsByRhythm);
  }

  const setSwing = (s) => {
    if (s < 0) {
      s = 0;
    } else if (s > 0.5) {
      s = 0.5;
    }
    const newSettingsByRhythm = JSON.parse(JSON.stringify(settingsByRhythm));
    newSettingsByRhythm[rhythm].swing = s;
    setSettingsByRhythm(newSettingsByRhythm);
  }

  useEffect(() => {
    if (isTicking) {
      metronome.startTicking();
    } else {
      metronome.stopTicking();
    }
  }, [isTicking]);

  useEffect(() => {
    metronome.setBpm(tempo);
  }, [tempo])

  useEffect(() => {
    metronome.setSwing(swing);
  }, [swing])

  function makeRhythmLinks(rhythms) {
    const o = [];
    for (let i = 0; i < rhythms.length; i++) {
      const r = rhythms[i];
      if (i > 0) {
        o.push(<div className="gold small-cdot"> • </div>);
      }
      o.push(<RhythmLink isSelected={r === rhythm} onClick={() => setRhythm(r)}>{r}s</RhythmLink>);
    }
    return o;
  }

  const setVolume = (n, v) => {
    const newVolumes = JSON.parse(JSON.stringify(volumes));
    for (let i = 0; i < newVolumes.length; i++) {
      if (newVolumes[i].name === n) {
        newVolumes[i].value = v;
      }
    }
    setVolumes(newVolumes);
    metronome.setVolumes(newVolumes);
  };

  return (
    <div className="App">
      <p className="gold">lennart's irish traditional music metronome</p>
      <p>{
        makeRhythmLinks([
          'reel',
          'jig',
          'hornpipe',
          'slip jig',
          'polka',
          'slide',
        ])
      }</p>
      <p>
        {isTicking ? <b className="on-green">on</b> : <span style={{opacity: 0.5}}>off</span>}
      </p>
      <p>
        <button onClick={() => { setIsTicking(true) }}>start</button>{' '}
        <button onClick={() => { setIsTicking(false) }}>stop</button>
      </p>
      <p>tempo: {Math.round(tempo * 100) / 100} bpm</p>
      <p>
        <button onClick={() => { setTempo(tempo - 1) }}>-1 bpm</button>{' '}
        <button onClick={() => { setTempo(tempo - 0.1) }}>-0.1 bpm</button>{' '}
        <button onClick={() => { setTempo(tempo + 0.1) }}>+0.1 bpm</button>{' '}
        <button onClick={() => { setTempo(tempo + 1) }}>+1 bpm</button>
      </p>
      <p>
        <button onClick={() => { setTempo(tempoLib.nextNotchDownNTimes(tempo, 5)) }}>-5 notches</button>{' '}
        <button onClick={() => { setTempo(tempoLib.nextNotchDown(tempo)) }}>-1 notch</button>{' '}
        <button onClick={() => { setTempo(tempoLib.nextNotchUp(tempo)) }}>+1 notch</button>{' '}
        <button onClick={() => { setTempo(tempoLib.nextNotchUpNTimes(tempo, 5)) }}>+5 notches</button>
      </p>
      <p>swing: {Math.round(swing * 100)}%</p>
      <p>
        <button onClick={() => { setSwing(swing - 0.05) }}>-5%</button>{' '}
        <button onClick={() => { setSwing(swing - 0.01) }}>-1%</button>{' '}
        <button onClick={() => { setSwing(swing + 0.01) }}>+1%</button>{' '}
        <button onClick={() => { setSwing(swing + 0.05) }}>+5%</button>
      </p>
      <p>volume</p>
      <table style={{margin: "auto"}}>
        <tbody>
          {volumes.map(({name, value}) => {
            return <tr>
              <td>{name}</td>
              <td><input type="range" min="0" max="1000" value={value} onChange={(e) => setVolume(name, parseInt(e.target.value))} /></td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
