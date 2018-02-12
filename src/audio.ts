const path = ''
class Audios {
    private audio: HTMLAudioElement = document.createElement('audio');
    constructor() {
        this.audio.src = './audio/updown.mp3';
    }
    public play(type?: AudioType) {
        this.audio.play();
    }

}

enum AudioType {
    Move
}

export const Aud = new Audios();
