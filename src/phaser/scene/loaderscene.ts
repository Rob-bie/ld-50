import Phaser from 'phaser';
import eventService from '../service/eventservice';

export class LoaderScene extends Phaser.Scene {

    constructor() {
        super({ key: 'LoaderScene' });
    }

    preload() {
        /* Set up services */
        eventService.init(this.game);
        
        /* Load assets */
        this.load.image('background', 'assets/game/background.png');
        this.load.image('handgun', 'assets/game/handgun.png');
        this.load.image('shotgun', 'assets/game/shotgun.png');
        this.load.image('machinegun', 'assets/game/machinegun.png');
        this.load.image('projectile', 'assets/game/projectile.png');

        this.load.atlas(
            'character',
            'assets/game/character-spritesheet.png',
            'assets/game/character-json.json'
        );

        this.load.atlas(
            'bat',
            'assets/game/bat-spritesheet.png',
            'assets/game/bat-json.json'
        );
        
        this.load.image('eyeball', 'assets/game/eyeball.png');
        this.load.image('hp-boost', 'assets/game/hp-boost.png');
        this.load.image('dmg-boost', 'assets/game/dmg-boost.png');
        this.load.image('spd-boost', 'assets/game/spd-boost.png');
        this.load.image('firerate-boost', 'assets/game/firerate-boost.png');
        this.load.image('shotgun-icon', 'assets/game/shotgun-icon.png');
        this.load.image('machinegun-icon', 'assets/game/machinegun-icon.png');

        this.load.image('hp-border', 'assets/ui/hp/hp-border.png');
        this.load.image('hp-inner', 'assets/ui/hp/hp-inner.png');
        this.load.image('hp-outer', 'assets/ui/hp/hp-outer.png');

        this.load.bitmapFont(
            'm5x7',
            'assets/font/m5x7.png',
            'assets/font/m5x7.xml'
        );
        
        this.load.audio('loop', 'assets/audio/loop.mp3');
        this.load.audio('pickup', 'assets/audio/pickup.mp3');
        this.load.audio('handgun', 'assets/audio/handgun.mp3');
        this.load.audio('shotgun', 'assets/audio/shotgun.mp3');
        this.load.audio('machinegun', 'assets/audio/machinegun.mp3');
        this.load.audio('gameover', 'assets/audio/gameover.mp3');
    }

    create() {
        this.scene.start('GameScene');
    }

}