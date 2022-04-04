import Phaser from 'phaser';
import { scaleFactor } from '../../config';
import characterService from '../../service/characterservice';
import dropService from '../../service/dropservice';
import eventService from '../../service/eventservice';
import waveService from '../../service/waveservice';

const speedVariance = 25;

export abstract class Monster {

    sprite: Phaser.Physics.Arcade.Sprite;

    abstract textureKey: string;
    abstract speed: number;
    abstract damage: number;
    abstract health: number;
    abstract rotateToPlayer: boolean;

    init(scene: Phaser.Scene, x: number, y: number, uuid: string): void {

        this.health *= waveService.healthMultiplier;
        this.damage *= waveService.damageMultiplier;
        
        this.speed = Phaser.Math.RND.between(
            this.speed - speedVariance,
            this.speed + speedVariance
        );
        
        this.sprite = scene.physics.add.sprite(
            x,
            y,
            this.textureKey
        )
        .setScale(scaleFactor)
        .setCircle(7)
        .setData('uuid', uuid);

        this.playAnimation();
    }

    private setPhysicsProps() {
        // Maybe?
    }

    applyDamage(damage: number) {
        eventService.emit(
            'ld50:shortLivedText',
            {
                x: this.sprite.x,
                y: this.sprite.y,
                text: damage.toString()
            }
        );

        this.health -= damage;
        if(this.health <= 0) {
            this.kill();
        } 
    }

    private kill(): void {
        dropService.createDrop(this.sprite.x, this.sprite.y);
        this.destroy();
    }

    private destroy(): void {
        if(this.sprite) {
            this.sprite.destroy();
        }
    }

    follow(): void {
        if(this?.sprite?.body) {
            const target = characterService.char.sprite;
            const between = Phaser.Math.Angle.Between(
                this.sprite.x,
                this.sprite.y,
                target.x,
                target.y
            );
            
            if(this.rotateToPlayer) {
                this.sprite.setRotation(between);
            }

            const velX = Math.cos(between) * this.speed;
            const velY = Math.sin(between) * this.speed;

            if(!this.rotateToPlayer) {
                this.sprite.setFlipX(velX > 0);
            }
            
            this.sprite.setVelocity(
                velX,
                velY
            );
        }
    }

    abstract playAnimation(): void;

}