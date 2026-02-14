// perlinNoise.js

class PerlinNoise {
    constructor() {
        this.p = new Array(512);
        this.permutation = new Array(256);
        this.seed();
    }

    seed() {
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = Math.floor(Math.random() * 256);
        }
        for (let i = 0; i < 256; i++) {
            this.p[i] = this.permutation[i];
            this.p[i + 256] = this.permutation[i];
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        switch (hash & 0xF) {
            case 0x0: return x + y;
            case 0x1: return -x + y;
            case 0x2: return x - y;
            case 0x3: return -x - y;
            case 0x4: return x;
            case 0x5: return -x;
            case 0x6: return y;
            case 0x7: return -y;
            case 0x8: return x + y;
            case 0x9: return -x + y;
            case 0xA: return x - y;
            case 0xB: return -x - y;
            case 0xC: return x;
            case 0xD: return -x;
            case 0xE: return y;
            case 0xF: return -y;
            default: return 0; // Should not happen
        }
    }

    noise(x, y) {
        let X = Math.floor(x) & 255;
        let Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        let u = this.fade(x);
        let v = this.fade(y);

        let A = this.p[X] + Y;
        let B = this.p[X + 1] + Y;

        return this.lerp(v,
            this.lerp(u, this.grad(this.p[A], x, y),
                         this.grad(this.p[B], x - 1, y)),
            this.lerp(u, this.grad(this.p[A + 1], x, y - 1),
                         this.grad(this.p[B + 1], x - 1, y - 1))
        );
    }

    // Octave noise for more natural looking patterns
    octaveNoise(x, y, octaves, persistence) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }
}

export const perlin = new PerlinNoise();
