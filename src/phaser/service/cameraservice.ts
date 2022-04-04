import Phaser from 'phaser';

class CameraService {

    scene: Phaser.Scene;

    init(scene: Phaser.Scene): void {
        this.scene = scene;
    }

    fade(): void {
        this.scene.cameras.main.fade();
    }
    
}

let cameraService = new CameraService();
export default cameraService;