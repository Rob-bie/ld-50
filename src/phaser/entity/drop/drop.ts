import audioService from '../../service/audioservice';
import { ItemType } from '../../service/dropservice';
import eventService from '../../service/eventservice';
import { bounce } from '../../util/tween';
import { scaleFactor } from './../../config';


export class Drop {

    scene: Phaser.Scene;
    x: number;
    y: number;
    textureKey: string;
    item: ItemType;
    uuid: string;

    sprite: Phaser.Physics.Arcade.Sprite;
    bounce: Phaser.Tweens.Tween;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        textureKey: string,
        item: ItemType,
        uuid: string
    ) {
        this.scene = scene;
        this.x = x;                                                                         
        this.y = y;
        this.textureKey = textureKey;
        this.item = item;
        this.uuid = uuid;
        
        this.init();
    }

    private init(): void {
        this.sprite = this.scene.physics.add.sprite(
            this.x,
            this.y,
            this.textureKey
        )
        .setScale(scaleFactor)
        .setData('uuid', this.uuid);

        this.bounce = bounce(this.scene, this.sprite);
    }

    collect(): void {
        audioService.playSound('pickup');
        eventService.emit('ld45:dropCollected', this.item);
        this.destroy();
    }

    private destroy(): void {
        this.bounce.stop();
        if(this.sprite) {
            this.sprite.destroy();
        }
    }

}