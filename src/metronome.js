import {staticPath} from './staticLib';

const SCHEDULE_AHEAD_TIME_S = 0.2;
const SCHEDULER_INTERVAL_S = 0.1;
const CLEANUP_INTERVAL_S = 2.0;

const BEATS_PER_BAR_BY_RHYTHM = {
    reel: 2,
    jig: 2,
    hornpipe: 4,
    "slip jig": 3,
    polka: 2,
    slide: 4,
}


function getReelNotes(swing) {
    return {
        // metroClick: [
        //     {phase: 0.0, gain: 0.5},
        //     {phase: 0.5, gain: 1.0},
        // ],
        stompStrong: [
            {phase: 0.0, gain: 0.9},
            {phase: 0.5, gain: 0.7},
        ],
        stompLight: [
            {phase: 0.25, gain: 0.7},
            {phase: 0.75, gain: 0.7},
        ],
        rim: [
            {phase: 0.0, gain: 0.4},
            {phase: 0.5, gain: 0.2},
        ],
        woodblock: [
            {phase: 0.0, gain: 0.4, detune: 500},
            {phase: 0.25, gain: 0.5},
            {phase: 0.5, gain: 0.3},
            {phase: 0.75, gain: 0.5},
        ],
        topClick1: [
            {phase: 0.0, gain: 0.5, detune: 100},
        ],
        topClick2: [
            {phase: 0.125 + (swing / 8.0), gain: 0.7},
            {phase: 0.25, gain: 0.9},
            {phase: 0.375 + (swing / 8.0), gain: 0.8},
            {phase: 0.5, gain: 0.5, detune: -50},
            {phase: 0.625 + (swing / 8.0), gain: 0.7},
            {phase: 0.75, gain: 0.9},
            {phase: 0.875 + (swing / 8.0), gain: 0.8},
        ],
    };
}

function getJigNotes(swing) {
    return {
        stompStrong: [
            {phase: 0.0, gain: 0.9},
            {phase: 0.5, gain: 0.7},
        ],
        stompLight: [
            {phase: 1/3, gain: 0.5},
            {phase: 5/6, gain: 0.5},
        ],
        rim: [
            {phase: 0.0, gain: 0.4},
            {phase: 0.5, gain: 0.15},
        ],
        woodblock: [
            {phase: 0.0, gain: 0.35, detune: 500},
            {phase: 1/3, gain: 0.3},
            {phase: 0.5, gain: 0.25},
            {phase: 5/6, gain: 0.4},
        ],
        topClick1: [
            {phase: 0.0, gain: 0.5, detune: 100},
        ],
        topClick2: [
            {phase: 1/6 + (swing / 6.0), gain: 0.6},
            {phase: 1/3 - (swing / 48.0), gain: 0.8},
            {phase: 0.5, gain: 0.5, detune: -50},
            {phase: 2/3 + (swing / 6.0), gain: 0.7},
            {phase: 5/6 - (swing / 48.0), gain: 0.9},
        ],
    };
}

function getHornpipeNotes(swing) {
    return {
        stompStrong: [
            {phase: 0.0, gain: 0.6},
            {phase: 0.5, gain: 0.5},
            {phase: 0.25, gain: 0.3, detune: 400},
            {phase: 0.75, gain: 0.3, detune: 400},
        ],
        stompLight: [
            {phase: 0.25, gain: 1.0, detune: -100},
            {phase: 0.75, gain: 1.0, detune: -100},
        ],
        rim: [
            {phase: 0.0, gain: 0.4},
            {phase: 0.25, gain: 0.15},
            {phase: 0.5, gain: 0.3},
            {phase: 0.75, gain: 0.15},
        ],
        woodblock: [
            {phase: 0.0, gain: 0.4, detune: 500},
            {phase: 0.25, gain: 0.25},
            {phase: 0.5, gain: 0.3},
            {phase: 0.75, gain: 0.25},
        ],
        topClick1: [
            {phase: 0.0, gain: 0.5, detune: 100},
        ],
        topClick2: [
            {phase: 0.125 + (swing / 8.0), gain: 0.7},
            {phase: 0.25, gain: 0.8},
            {phase: 0.375 + (swing / 8.0), gain: 0.7},
            {phase: 0.5, gain: 0.5, detune: -50},
            {phase: 0.625 + (swing / 8.0), gain: 0.7},
            {phase: 0.75, gain: 0.8},
            {phase: 0.875 + (swing / 8.0), gain: 0.7},
        ],
    };
}

function getSlipJigNotes(swing) {
    return {
        stompStrong: [
            {phase: 0.0, gain: 0.9},
            {phase: 1/3, gain: 0.65},
            {phase: 2/3, gain: 0.7},
        ],
        stompLight: [
            {phase: 2/9, gain: 0.5},
            {phase: 5/9, gain: 0.5},
            {phase: 8/9, gain: 0.6},
        ],
        rim: [
            {phase: 0.0, gain: 0.4},
            {phase: 1/3, gain: 0.15},
            {phase: 2/3, gain: 0.15},
        ],
        woodblock: [
            {phase: 0.0, gain: 0.35, detune: 500},
            {phase: 2/9, gain: 0.3},
            {phase: 1/3, gain: 0.25},
            {phase: 5/9, gain: 0.4},
            {phase: 2/3, gain: 0.25},
            {phase: 8/9, gain: 0.4},
        ],
        topClick1: [
            {phase: 0.0, gain: 0.5, detune: 100},
        ],
        topClick2: [
            {phase: 1/9 + (swing / 9.0), gain: 0.6},
            {phase: 2/9 - (swing / 72.0), gain: 0.8},
            {phase: 1/3, gain: 0.5, detune: -50},
            {phase: 4/9 + (swing / 9.0), gain: 0.7},
            {phase: 5/9 - (swing / 72.0), gain: 0.9},
            {phase: 2/3, gain: 0.5, detune: -50},
            {phase: 7/9 + (swing / 9.0), gain: 0.7},
            {phase: 8/9 - (swing / 72.0), gain: 0.9},
        ],
    };
}

function getPolkaNotes(swing) {
    return {
        stompStrong: [
            {phase: 0.0, gain: 0.9},
            {phase: 0.5, gain: 0.7, detune: 100},
        ],
        stompLight: [
            // {phase: 0.25, gain: 0.7},
            // {phase: 0.75, gain: 0.7},
        ],
        rim: [
            {phase: 0.0, gain: 0.4},
            {phase: 0.5, gain: 0.2},
        ],
        woodblock: [
            {phase: 0.0, gain: 0.4, detune: 500},
            {phase: 0.5, gain: 0.3},
        ],
        topClick1: [
            {phase: 0.0, gain: 0.5, detune: 100},
        ],
        topClick2: [
            {phase: 0.25, gain: 0.9},
            {phase: 0.5, gain: 0.5, detune: -50},
            {phase: 0.75, gain: 0.9},
        ],
    };
}

function getSlideNotes(swing) {
    return {
        stompStrong: [
            {phase: 0.0, gain: 0.8},
            {phase: 0.25, gain: 0.6},
            {phase: 0.5, gain: 0.7},
            {phase: 0.75, gain: 0.6},
        ],
        stompLight: [
            // {phase: 1/3, gain: 0.5},
            // {phase: 5/6, gain: 0.5},
        ],
        rim: [
            {phase: 0.0, gain: 0.4},
            {phase: 0.25, gain: 0.2},
            {phase: 0.5, gain: 0.3},
            {phase: 0.75, gain: 0.25},
        ],
        woodblock: [
            {phase: 0.0, gain: 0.4, detune: 500},
            {phase: 0.25, gain: 0.2},
            {phase: 0.5, gain: 0.3},
            {phase: 0.75, gain: 0.25},
        ],
        topClick1: [
            {phase: 0.0, gain: 0.3, detune: 100},
        ],
        topClick2: [
            {phase: 0.125 - 0.33 * 0.125, gain: 0.25},
            {phase: 0.125 + swing * 0.125, gain: 0.8},
            {phase: 0.25, gain: 0.5},
            {phase: 0.375 - 0.33 * 0.125, gain: 0.35},
            {phase: 0.375 + swing * 0.125, gain: 0.8},
            {phase: 0.5, gain: 0.5, detune: -50},
            {phase: 0.625 - 0.33 * 0.125, gain: 0.25},
            {phase: 0.625 + swing * 0.125, gain: 0.8},
            {phase: 0.75, gain: 0.5},
            {phase: 0.875 - 0.33 * 0.125, gain: 0.35},
            {phase: 0.875 + swing * 0.125, gain: 0.8},
        ],
    };
}


function getNotesForRhythm(rhythm, swing) {
    if (rhythm === 'reel') {
        return getReelNotes(swing);
    } else if (rhythm === 'jig') {
        return getJigNotes(swing);
    } else if (rhythm === 'hornpipe') {
        return getHornpipeNotes(swing);
    } else if (rhythm === 'slip jig') {
        return getSlipJigNotes(swing);
    } else if (rhythm === 'polka') {
        return getPolkaNotes(swing);
    } else if (rhythm === 'slide') {
        return getSlideNotes(swing);
    }
    console.error(`unknown rhythm ${rhythm}`);
}

async function loadAudioBufferFromPath(audioCtx, filename) {
    const rsvp = await fetch(staticPath(`sounds/${filename}`));
    return audioCtx.decodeAudioData(await rsvp.arrayBuffer());
}

async function loadAudioBuffers(audioCtx) {
    return {
        // metroClick: await loadAudioBufferFromPath(audioCtx, 'quartz-click.wav'),
        stompStrong: await loadAudioBufferFromPath(audioCtx, 'stomp-strong.ogg'),
        stompLight: await loadAudioBufferFromPath(audioCtx, 'stomp-light.ogg'),
        topClick1: await loadAudioBufferFromPath(audioCtx, 'top-click-1.ogg'),
        topClick2: await loadAudioBufferFromPath(audioCtx, 'top-click-2.ogg'),
        rim: await loadAudioBufferFromPath(audioCtx, 'rim.ogg'),
        woodblock: await loadAudioBufferFromPath(audioCtx, 'woodblock.ogg'),
    };
}

class Metronome {
    constructor(rhythm, bpm, swing) {
        this.audioContext = new AudioContext();
        loadAudioBuffers(this.audioContext).then((audioBuffers) => {
            this.audioBuffers = audioBuffers;
        });
        this.rhythm = rhythm;
        this.isTicking = false;
        this.bpm = bpm;
        this.swing = swing;
        this.scheduledUntilTime = 0.0;
        this.schedulerLoop = undefined;
        this.scheduledBufferSourceNodes = [];
        this.startingPhase = 0.0;

        this.kickAmp = 1;
        this.woodblockAmp = 1;
        this.clickAmp = 1;
        this.rimshotAmp = 1;
    }

    getPhase(bpm, time) {
        const intervalBetweenBeats = 60.0 / bpm;
        let curPhase = (time % intervalBetweenBeats) / intervalBetweenBeats;
        curPhase -= this.startingPhase;
        curPhase = curPhase % 1.0;
        return curPhase;
    }

    getMetronomeNotes(startTime, duration) {
        const notes = [];
        
        const intervalBetweenBeats = 60.0 / this.bpm;
        const phase = this.getPhase(this.bpm, startTime);
        const lastTickTime = startTime - ((phase + 1.0) * intervalBetweenBeats);
        let prospectiveTickTime = lastTickTime;

        while (prospectiveTickTime < (startTime + duration)) {
            const notesForCycle = getNotesForRhythm(this.rhythm, this.swing);

            for (const sound in notesForCycle) {
                for (const note of notesForCycle[sound]) { 
                    const time = note.phase * intervalBetweenBeats + prospectiveTickTime;

                    if (time >= startTime && time < (startTime + duration)) {
                        notes.push({
                            sound,
                            time,
                            gain: note.gain != null ? note.gain : 1.0,
                            detune: note.detune || 0,
                        });
                    }
                }
            }

            prospectiveTickTime += intervalBetweenBeats;
        }

        return notes;
    }

    ampForSoundName(n) {
        if (n === 'stompStrong' || n === 'stompLight') {
            return this.kickAmp;
        } else if (n === 'topClick1' || n === 'topClick2') {
            return this.clickAmp;
        } else if (n === 'rim') {
            return this.rimshotAmp;
        } else if (n === 'woodblock') {
            return this.woodblockAmp;
        } else {
            return 1;
        }
    }

    playNote(soundName, time, gain, detune) {
        if (this.audioBuffers == null) {
            console.error(`missing all audio data`);
            return;
        }
        if (this.audioBuffers[soundName] == null) {
            console.error(`missing audio buffer for soundName = ${soundName}`);
            return;
        }
        const bufferSource = new AudioBufferSourceNode(this.audioContext, {
            buffer: this.audioBuffers[soundName] || null,
            detune: detune || 0,
        });
        const gainNode = new GainNode(this.audioContext, {
            gain: gain * this.ampForSoundName(soundName),
        })
        bufferSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        bufferSource.start(time);
        this.scheduledBufferSourceNodes.push({node: bufferSource, time: time});
    }

    startTicking() {
        if (this.isTicking) return;

        const intervalBetweenBeats = 60.0 / this.bpm;
        this.startingPhase = (this.audioContext.currentTime % intervalBetweenBeats) / intervalBetweenBeats;

        const runScheduler = () => {
            const notes = this.getMetronomeNotes(this.audioContext.currentTime, SCHEDULE_AHEAD_TIME_S);
            for (const note of notes) {
                if (note.time >= this.scheduledUntilTime) {
                    this.playNote(note.sound, note.time, note.gain, note.detune);
                }
            }
            this.scheduledUntilTime = this.audioContext.currentTime + SCHEDULE_AHEAD_TIME_S;
        }

        // start scheduler loop and run once now
        runScheduler();
        this.schedulerLoop = setInterval(runScheduler, SCHEDULER_INTERVAL_S * 1000.0);

        this.cleanupLoop = setInterval(() => {
            for (let i = 0; i < this.scheduledBufferSourceNodes.length; i++) {
                const d = this.scheduledBufferSourceNodes[i];
                // stop and cleanup nodes started longer than 2 seconds ago
                if (d.time < this.audioContext.currentTime - 2.0) {
                    d.node.stop();
                    this.scheduledBufferSourceNodes.splice(i, 1);
                    i--;
                }
            }
        }, CLEANUP_INTERVAL_S * 1000.0);

        this.isTicking = true;
    }

    stopAllScheduledAudioNodes() {
        for (const d of this.scheduledBufferSourceNodes) {
            d.node.stop();
        }
        this.scheduledBufferSourceNodes = [];
    }

    stopTicking() {
        if (!this.isTicking) return;

        // stop the loop
        if (this.schedulerLoop != null) {
            clearInterval(this.schedulerLoop);
        }
        if (this.cleanupLoop != null) {
            clearInterval(this.cleanupLoop);
        }

        this.stopAllScheduledAudioNodes();
        this.scheduledUntilTime = 0.0;
        this.startingPhase = 0.0;
        this.isTicking = false;
    }

    setBpm(bpm) {
        bpm /= BEATS_PER_BAR_BY_RHYTHM[this.rhythm];

        if (this.bpm === bpm) return;

        const currentTime = this.audioContext.currentTime;
        const curPhase = this.getPhase(this.bpm, currentTime);

        this.bpm = bpm;
        const nextPhase = this.getPhase(this.bpm, currentTime);

        this.startingPhase += (nextPhase - curPhase);
        this.startingPhase = (this.startingPhase + 1.0) % 1.0;
    }

    setSwing(swing) {
        this.swing = swing;
    }

    setRhythm(rhythm) {
        this.rhythm = rhythm;
    }

    setVolumes(volumes) {
        const volumesObj = {};
        for (const o of volumes) {
            volumesObj[o.name] = o.value;
        }

        const volumeIntToAmp = (v) => {
            return (Math.exp(v / 400) - 1) / 4.755;
        }

        const globalAmp = volumeIntToAmp(volumesObj.global);
        this.kickAmp = volumeIntToAmp(volumesObj.kick) * globalAmp;
        this.woodblockAmp = volumeIntToAmp(volumesObj.woodblock) * globalAmp;
        this.clickAmp = volumeIntToAmp(volumesObj.click) * globalAmp;
        this.rimshotAmp = volumeIntToAmp(volumesObj.rimshot) * globalAmp;
    }
}

let metronomeSingleton = undefined;

export function initialize(rhythm, bpm, swing) {
    if (metronomeSingleton != null) {
        metronomeSingleton.stopTicking();
    }
    metronomeSingleton = new Metronome(rhythm, bpm, swing);
}

export function startTicking() {
    metronomeSingleton.startTicking();
}

export function stopTicking() {
    metronomeSingleton.stopTicking();
}

export function setBpm(bpm) {
    metronomeSingleton.setBpm(bpm);
}

export function setSwing(swing) {
    metronomeSingleton.setSwing(swing);
}

export function setRhythm(rhythm) {
    metronomeSingleton.setRhythm(rhythm);
}

export function isTicking() {
    return metronomeSingleton.isTicking;
}

export function setVolumes(volumes) {
    metronomeSingleton.setVolumes(volumes);
}
