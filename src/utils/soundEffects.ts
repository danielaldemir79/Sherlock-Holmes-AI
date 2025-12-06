// Sound effects using Web Audio API
export class SoundEffects {
    private audioContext: AudioContext | null = null;

    constructor() {
        // Initialize AudioContext when first used
        this.initAudioContext();
    }

    private initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    private async ensureAudioContext() {
        if (!this.audioContext) return false;
        
        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        return true;
    }

    // Success sound - pleasant "ding"
    async playCorrectSound() {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Create a pleasant bell-like sound
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    // Error sound - buzzer
    async playIncorrectSound() {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Create a buzzer sound
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

        oscillator.type = 'sawtooth';
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    // Tick sound for countdown
    async playTickSound(timeLeft: number) {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Different pitch based on urgency
        let frequency = 800; // Normal tick
        if (timeLeft <= 3) frequency = 1200; // High pitched for urgency
        else if (timeLeft <= 5) frequency = 1000; // Medium urgency

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Sherlock Holmes theme melody (simplified version)
    async playHolmesTheme() {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        // Simplified version of the classic Sherlock Holmes theme
        // Using notes from the famous detective melody
        const melody = [
            { note: 659, duration: 300 }, // E
            { note: 698, duration: 300 }, // F#
            { note: 784, duration: 400 }, // G
            { note: 659, duration: 300 }, // E
            { note: 587, duration: 600 }, // D
            { note: 523, duration: 300 }, // C
            { note: 587, duration: 300 }, // D
            { note: 659, duration: 400 }, // E
            { note: 523, duration: 800 }, // C (longer)
        ];

        for (let i = 0; i < melody.length; i++) {
            setTimeout(() => {
                this.playMelodyNote(melody[i].note, melody[i].duration / 1000);
            }, melody.slice(0, i).reduce((sum, note) => sum + note.duration, 0));
        }
    }

    // Play a melody note with specific duration
    private async playMelodyNote(frequency: number, duration: number) {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'triangle'; // Warmer sound for melody
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime + duration * 0.8);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Quiz complete sound - fanfare
    async playQuizCompleteSound() {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        const frequencies = [523, 659, 784, 1047]; // C, E, G, C (major chord)
        
        for (let i = 0; i < frequencies.length; i++) {
            setTimeout(() => {
                this.playNote(frequencies[i], 0.3);
            }, i * 200);
        }
    }

    // Notification sound - simple beep
    async playNotificationSound() {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 440; // A note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    private async playNote(frequency: number, duration: number) {
        if (!(await this.ensureAudioContext()) || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
}