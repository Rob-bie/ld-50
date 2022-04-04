import Phaser from 'phaser';
import { scaleFactor } from '../../config';
import characterService from '../../service/characterservice';
import { Character } from '../character/character';

export abstract class Weapon {

    weaponOffset: number = 60;
    sprite: Phaser.GameObjects.Sprite;

    lastFireTime: number = 0;

    abstract textureKey: string;
    abstract projectileSpeed: number;
    abstract damage: number;
    abstract weaponDelay: number;
    abstract minDelay: number;

    init(char: Character): void {
        this.sprite = char.scene.add.sprite(
            char.startX + this.weaponOffset,
            char.startY,
            this.textureKey
        )
        .setScale(scaleFactor)
    }

    destroy(): void {
        this.sprite.destroy();
    }
y
    canUse(): boolean {
        const now = Date.now();
        const delay = Math.max(
            this.weaponDelay - characterService.char.firerateBoost,
            this.minDelay
        );
        if(now - this.lastFireTime > delay) {
            this.lastFireTime = now;
            return true;
        }

        return false;
    }

    abstract use(): void;
    abstract sound(): void;

}