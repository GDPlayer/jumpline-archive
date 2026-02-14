export const PLAYER_DEFAULTS = {
    WIDTH: 24,
    HEIGHT: 48,
    SPEED: 6,
    JUMP_POWER: 12,
    LIVES: 3,
    ACCELERATION: 2,
    RUNNING_SPEED: 8,
};

export const PHYSICS = {
    GRAVITY: 0.6,
    SLOW_FALL_GRAVITY: 0.2,
    FRICTION: 0.8,
};

export const WORLD_DEFAULTS = {
    CHUNK_WIDTH: 800,
    GROUND_HEIGHT: 100,
};

export const POWERUP_DURATION = {
    SLOW_FALL: 5000, // ms
    FLY: 2000, // ms
    SHRINK: 5000, // ms
    SPEED: 12000, // ms - global slowdown (player unaffected)
    INVINCIBILITY: 5000, // ms
};

export const EASTER_EGG_WORDS = ['EAGLE', 'BIRD', 'EATER', 'RICK'];

export const GOOMBA_DEFAULTS = {
    WIDTH: 30,
    HEIGHT: 30,
    SPEED: 1.5,
    COIN_REWARD: 5,
    PATROL_BUFFER: 20, // pixels from platform edge before turning around
};

export const COIN_VALUES = {
    POWERUP: 1,
    MILESTONES: [
        { distance: 100, coins: 5 },
        { distance: 900, coins: 10 },
        { distance: 4000, coins: 25 },
        { distance: 19999, coins: 50 },
    ],
    REPEATING_MILESTONE: {
        start: 20000,
        interval: 2000,
        coins: 20,
    }
};

export const PALETTES = {
    default: {
        name: 'Classic',
        price: 0,
        colors: {
            background: 'white',
            foreground: 'black',
        }
    },
    ocean: {
        name: 'Oceanic',
        price: 10,
        colors: {
            background: '#001f3f', // Navy
            foreground: '#7FDBFF', // Aqua
        }
    },
    ember: {
        name: 'Ember',
        price: 25,
        colors: {
            background: '#1a0000', // Dark Red/Brown
            foreground: '#FF851B', // Orange
        }
    },
    space: {
        name: 'Nebula',
        price: 50,
        colors: {
            background: '#2c003e', // Deep purple
            foreground: '#ff00ff', // Magenta
        }
    },
    hacker: {
        name: 'Hacker',
        price: 86,
        colors: {
            background: 'black',
            foreground: '#00FF00',
        },
        particle_effect: 'matrix',
        death_effect: 'matrix',
    },
    bread: {
        name: 'Bread',
        price: 35,
        colors: {
            background: '#D2B48C',
            foreground: '#8B4513',
        }
    },
    fish: {
        name: 'FISH',
        price: 120,
        colors: {
            background: '#3a4f6b',
            foreground: '#6b89b5',
        },
        particle_effect: 'fish',
        death_effect: 'water',
        audio_effect: 'bass_boost',
    },
    lori: {
        name: 'LORI',
        price: 100,
        colors: {
            background: 'black',
            foreground: '#9400D3',
        }
    },
    moon: {
        name: 'Moon',
        price: 180,
        colors: {
            background: '#000000',
            foreground: '#AAAAAA',
        },
        texture: '/pluto.png'
    },
    reversed: {
        name: 'Reversed',
        price: 20,
        colors: {
            background: 'black',
            foreground: 'white',
        }
    },
    gameboy: {
        name: 'Gameboy Color',
        price: 60,
        colors: {
            background: '#9bbc0f', // Light green (Normal)
            foreground: '#0f380f', // Dark green (Outlines)
        },
        audio_effect: 'super_bitcrusher',
        // Slight pixelation without extreme zoom so UI and effects stay readable
        pixel_scale: 0.5
    }
};

export const SONGS = {
    default_song: {
        name: 'Jump',
        price: 0,
        path: 'Happy Pixelated Beat - Faster.mp3'
    },
    lined_song: {
        name: 'Quartz Quadrant',
        price: 0,
        path: 'Quartz Quadrant Present.wav'
    },
};

export const DEATH_EFFECTS = {
    normal: { name: 'Normal', description: 'Splits into two pieces.' },
    crumble: { name: 'Crumble', description: 'Breaks into many small pieces.' },
    water: { name: 'Melt', description: 'Flattens and dissolves into goo.' }
};