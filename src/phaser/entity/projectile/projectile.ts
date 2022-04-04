import Phaser from 'phaser';
import { scaleFactor } from '../../config';

const textureKey = 'projectile';

export class Projectile {

    scene: Phaser.Scene;
    sprite: Phaser.Physics.Arcade.Sprite;
    uuid: string;

    startX: number;
    startY: number;
    angle: number;
    speed: number;
    damage: number;
    speedX: number;
    speedY: number;

    constructor(
        scene: Phaser.Scene,
        x: number, 
        y: number,
        angle: number, 
        speed: number,
        damage: number,
        uuid: string
    ) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.uuid = uuid;

        this.create();
    }

    private create(): void {
        const dir = this.scene.physics.velocityFromAngle(this.angle, 1);
        
        const posX = dir.x + this.startX;
        const posY = dir.y + this.startY;

        this.speedX = dir.x * this.speed;
        this.speedY = dir.y * this.speed;

        this.sprite = this.scene.physics.add.sprite(
            posX,
            posY,
            textureKey
        )
        .setScale(scaleFactor);

        this.sprite.setData('uuid', this.uuid);
    }

    fire(): void {
        if(this.sprite) {
            // Other props here?
            // this.sprite.setMass(10);
            this.sprite.setVelocity(this.speedX, this.speedY)
        }
    }

    destroy(): void {
        if(this.sprite) {
            this.sprite.destroy();
        }
    }

}