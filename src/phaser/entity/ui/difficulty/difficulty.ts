import Phaser from 'phaser';
import eventService from '../../../service/eventservice';
import { moveTo } from '../../../util/tween';

const waveNames: string[] = [
    "          Easy          ",
    "          Easy          ",
    "          Easy          ",
    "         Normal         ",
    "         Normal         ",
    "         Uh Oh          ",
    "          Hard          ",
    "          Hard          ",
    "         Give Up        ",
    "         Give Up        ",
    "       You're Dead      ",
    "       You're Dead      ",
    "        Inevitable      ",
    "        Inevitable      ",
    "        Inevitable      ",
    "        Inevitable      ",
    "    How are you alive?  ",
];


export class Difficulty {

    scene: Phaser.Scene;
    difficulty: Phaser.GameObjects.BitmapText;

    waveCount: number = 1;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.init();
        this.createListeners();
    }

    moveToPost(): Promise<void> {
        return moveTo(
            this.scene,
            this.difficulty,
            (this.scene.game.canvas.width / 2) - this.difficulty.width / 2,
            275
        );
    }


    private init(): void {
        const xPos = this.scene.game.canvas.width / 2 - 175;
        const yPos = 8;

        this.difficulty = this.scene.add.bitmapText(
            xPos,
            yPos,
            'm5x7',
            `Mode:    >${waveNames[this.waveCount - 1]}<`
        );
            
    }

    private createListeners(): void {
        eventService.on('ld50:waveUpdate', this.handleWaveUpdate.bind(this));
    }

    private handleWaveUpdate(wave: number): void {
        const message = wave > waveNames.length ? waveNames[waveNames.length - 1] : waveNames[wave - 1];
        if(message) {
            this.difficulty.setText(`Mode:    >${message}<`);
        }
    }


}