import { Monster } from '../monster';

export class Bat extends Monster {

    textureKey: string = 'bat';
    damage: number = 3;
    speed: number = 80;
    health: number = 7;
    rotateToPlayer: boolean = false;

    playAnimation(): void {
        this.createAnimation();
        this.sprite.play('walk');
    }

    private createAnimation(): void {
        this.sprite.anims.create({
            key: 'walk',
            frames: this.sprite.anims.generateFrameNames('bat'),
            frameRate: 8,
            repeat: -1
        });
    }

}