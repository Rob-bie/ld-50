import Phaser from 'phaser';
import eventService from '../../../service/eventservice';
import { moveTo } from '../../../util/tween';

export class Timer {

    scene: Phaser.Scene;
    timer: Phaser.GameObjects.BitmapText;

    seconds: number = 0;
    minutes: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.init();
        this.createListeners();
    }

    moveToPost(): Promise<void> {
        return moveTo(
            this.scene,
            this.timer,
            (this.scene.game.canvas.width / 2) - this.timer.width / 2,
            200
        );
    }

    private init(): void {
        const xPos = this.scene.game.canvas.width - 115;
        const yPos = 8;

        this.timer = this.scene.add.bitmapText(
            xPos,
            yPos,
            'm5x7',
            `${this.formatTime(this.minutes)}:${this.formatTime(this.seconds)}`
        )
        .setScale(1.25);
    }

    private createListeners(): void {
        eventService.on('ld50:waveTick', this.handleTick.bind(this));
    }

    private handleTick(seconds: number): void {
        const minutePart = Math.floor(seconds / 60);
        const secondPart = seconds % 60;

        this.timer.setText(`${this.formatTime(minutePart)}:${this.formatTime(secondPart)}`);
    }

    private formatTime(time: number): string {
        if(time < 10) return `0${time}`;
        return time.toString();
    }

}