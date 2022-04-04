import Phaser from 'phaser';
import { HpBar } from '../entity/ui/hp/hpbar';
import { Timer } from '../entity/ui/timer/timer';
import eventService from '../service/eventservice';
import textRenderService from '../service/textrenderservice';
import { Difficulty } from './../entity/ui/difficulty/difficulty';

export class HudScene extends Phaser.Scene {

    hpBar: HpBar;
    difficulty: Difficulty;
    timer: Timer;

    constructor() {
        super({ key: 'HudScene' });
    }

    create() {

        textRenderService.init(this);

        this.hpBar = new HpBar(this);
        this.difficulty = new Difficulty(this);
        this.timer = new Timer(this);

        this.createListeners();
    }

    private createListeners(): void {
        eventService.on('ld50:gameOver', () => {
            this.hpBar.destroy();
            Promise.all(
                [
                    this.difficulty.moveToPost(),
                    this.timer.moveToPost()
                ]
            ).then(() => {
                // Maybe...
            })
        });
    }

}