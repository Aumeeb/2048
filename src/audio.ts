class Audios {
    private readonly audio: HTMLAudioElement = new Audio('./audio/updown.mp3');

    constructor() {
        this.audio.preload = 'auto';
    }

    public play(): void {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
    }
}

export const Aud = new Audios();
