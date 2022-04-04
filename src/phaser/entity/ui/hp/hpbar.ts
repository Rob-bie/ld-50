import Phaser from 'phaser';
import { scaleFactor } from '../../../config';
import eventService from '../../../service/eventservice';

const borderTexutreKey = 'hp-border';
const innerTextureKey = 'hp-inner';
const outerTextureKey = 'hp-outer';

const barWidth = 78; /* Includes border */

interface HpUpdate {
    currentHp: number;
    maxHp: number;
}

export class HpBar {

    scene: Phaser.Scene;
    
    border: Phaser.GameObjects.Sprite;
    inner: Phaser.GameObjects.Sprite;
    outer: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.init();
        this.createListeners();
    }

    private init(): void {
        const xPos = 150;
        const yPos = 25;

        this.inner = this.scene.add.sprite(
            xPos,
            yPos,
            innerTextureKey
        )
        .setScale(scaleFactor)
        .setAlpha(0.8);

        this.outer = this.scene.add.sprite(
            xPos,
            yPos,
            outerTextureKey
        )
        .setScale(scaleFactor);

        this.border = this.scene.add.sprite(
            xPos,
            yPos,
            borderTexutreKey
        )
        .setScale(scaleFactor);

    }

    destroy(): void {
        this.inner.destroy();
        this.outer.destroy();
        this.border.destroy();
    }

    private createListeners(): void {
        eventService.on('ld50:hpChanged', this.updateBar.bind(this));
    }

    private updateBar(hpUpdate: HpUpdate): void {
        const ratio = hpUpdate.currentHp / hpUpdate.maxHp;
        this.outer.setCrop(0, 0, barWidth * ratio, this.outer.displayHeight);
    }

}