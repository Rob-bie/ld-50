import Phaser from 'phaser';

class AudioService {

    scene: Phaser.Scene;
    soundMap: Map<string, Phaser.Sound.BaseSound> = new Map();

    init(scene: Phaser.Scene): void {
        this.scene = scene;
        this.addSounds();
    }

    private addSounds(): void {
        this.addSound('loop', true);
        this.addSound('gameover', true);
        this.addSound('pickup');
        this.addSound('handgun');
        this.addSound('shotgun');
        this.addSound('machinegun');
    }

    private addSound(key: string, loop: boolean = false): void {
        this.soundMap.set(key, this.scene.sound.add(key, { loop: loop }));
    }

    playSound(key: string): void {
        const sound = this.soundMap.get(key);
        sound.play();
    }

    stopSound(key: string): void {
        const sound = this.soundMap.get(key);
        sound.stop();
    }
    
}

let audioService = new AudioService();
export default audioService;