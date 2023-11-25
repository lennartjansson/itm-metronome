const LOW_NOTCHES = [
    20, 22, 24, 26, 28,
    30, 32, 34, 36, 38,
    40, 42, 44, 46, 48,
    50, 52, 54, 56, 58,
];

const REPEATING_NOTCHES = [
    60, 63, 66, 69,
    72, 76, 80, 84,
    88, 92, 96, 100,
    104, 108, 112, 116,
]

const NOTCHES = [
    ...LOW_NOTCHES,
    ...REPEATING_NOTCHES,
    ...REPEATING_NOTCHES.map(t => t * 2),
    ...REPEATING_NOTCHES.map(t => t * 4),
    ...REPEATING_NOTCHES.map(t => t * 8)
];

export function nextNotchUp(bpm) {
    for (const notch of NOTCHES) {
        if (notch > bpm) {
            return notch;
        }
    }
    return NOTCHES[NOTCHES.length - 1];
}

export function nextNotchUpNTimes(bpm, n) {
    let o = bpm;
    for (let i = 0; i < n; i++) {
        o = nextNotchUp(o);
    }
    return o;
}

export function nextNotchDown(bpm) {
    for (let i = NOTCHES.length - 1; i >= 0; i--) {
        const notch = NOTCHES[i];
        if (notch < bpm) {
            return notch;
        }
    }
    return 20;
}

export function nextNotchDownNTimes(bpm, n) {
    let o = bpm;
    for (let i = 0; i < n; i++) {
        o = nextNotchDown(o);
    }
    return o;
}
