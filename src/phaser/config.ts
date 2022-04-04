import Phaser from 'phaser';
import { GameScene } from './scene/gamescene';
import { HudScene } from './scene/hudscene';
import { LoaderScene } from './scene/loaderscene';

const baseWidth = 320;
const baseHeight = 180;

export const scaleFactor = 3;

export const gameConfig: Phaser.Types.Core.GameConfig = {
    parent: "GameContainer",
    width: baseWidth * scaleFactor,
    height: baseHeight * scaleFactor,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: !true
        }
    },
    backgroundColor: 0x828382,
    scene: [
        LoaderScene,
        GameScene,
        HudScene
    ]
};