import { loadAudioBufferFromPath } from "./metronome";

let dronesSingleton = undefined;

const SEMITONES = [
    "low G",
    "low G♯",
    "low A",
    "B♭",
    "B",
    "C",
    "C♯",
    "D",
    "E♭",
    "E",
    "F",
    "F♯",
    "G",
    "high G♯",
    "high A",
]

export function centDetuneToName(cents) {
    const semis = Math.round(cents / 100);
    const semiName = SEMITONES[
        Math.min(
            SEMITONES.length - 1,
            Math.max(
                semis + 7,
                0,
            )
        )
    ];
    const detune = cents - semis * 100;
    if (Math.abs(detune) < 0.01) {
        return semiName;
    }
    return `${semiName} (${detune > 0 ? '+' : ''}${detune}¢)`;
}

class Drones {
    constructor(audioContext) {
        this.detune = 0;
        this.audioContext = audioContext;
        this.pipeDronesBuffer = null;
        this.bufferSource = null;
        let audioLoadedResolve;
        this.waitForAudioLoaded = new Promise((resolve) => {
            audioLoadedResolve = resolve;
        });
        this.dronesAmp = 1;

        loadAudioBufferFromPath(audioContext, 'pipe-drones-d.ogg').then((buf) => {
            this.pipeDronesBuffer = buf;
            if (this.onAudioLoaded != null) {
                this.onAudioLoaded();
            }
            audioLoadedResolve();
        });
    }

    start() {
        this.waitForAudioLoaded.then(() => {
            this.bufferSource = new AudioBufferSourceNode(this.audioContext, {
                buffer: this.pipeDronesBuffer,
                detune: this.detune,
            });
            this.gainNode = new GainNode(this.audioContext, {
                gain: this.dronesAmp,
            })
            this.bufferSource.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            this.bufferSource.loop = true;
            this.bufferSource.start(0, Math.random() * this.pipeDronesBuffer.duration * 0.8);
        });

        // setTimeout(() => {
        //     this.bufferSource.detune.value = -200;
        // }, 2000);
    }

    stop() {
        if (this.bufferSource != null) {
            this.bufferSource.stop(0);
            this.bufferSource = null;
        }
        this.waitForAudioLoaded.then(() => {
            setTimeout(() => {
                if (this.bufferSource != null) {
                    this.bufferSource.stop(0);
                    this.bufferSource = null;
                }
            }, 0);
        })
    }

    setDetune(cents) {
        this.detune = cents;
        this.waitForAudioLoaded.then(() => {
            if (this.bufferSource != null) {
                this.bufferSource.detune.value = cents;
            }
        });
    }

    setVolumes(volumes) {
        const volumesObj = {};
        for (const o of volumes) {
            volumesObj[o.name] = o.value;
        }

        const volumeIntToAmp = (v) => {
            return (Math.exp(v / 400) - 1) / 3.49;
        }

        const globalAmp = volumeIntToAmp(volumesObj.global);
        this.dronesAmp = volumeIntToAmp(volumesObj.drones) * globalAmp;
        if (this.gainNode != null) {
            this.gainNode.gain.value = this.dronesAmp;
        }
    }
}

export function initialize(audioContext) {
    if (dronesSingleton != null) {
        dronesSingleton.stop();
    }
    dronesSingleton = new Drones(audioContext);
}

export function start() {
    dronesSingleton.start();
}

export function stop() {
    dronesSingleton.stop();
}

export function setOnAudioLoaded(f) {
    dronesSingleton.onAudioLoaded = f;
}

export function setDetune(cents) {
    dronesSingleton.setDetune(cents);
}

export function setVolumes(volumes) {
    dronesSingleton.setVolumes(volumes);
}
