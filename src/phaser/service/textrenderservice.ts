import Phaser from 'phaser';
import { fadeUpAndOut } from '../util/tween';
import eventService from './eventservice';

interface TextData {
    text: string,
    x: number,
    y: number
}

class TextRenderService {

    scene: Phaser.Scene;

    init(scene: Phaser.Scene): void {
        this.scene = scene;
        this.createListeners();
    }

    private createListeners(): void {
        eventService.on('ld50:shortLivedText', this.handleText.bind(this));
    }

    private handleText(textData: TextData): void {
        const text = this.scene.add.bitmapText(
            textData.x,
            textData.y,
            'm5x7',
            textData.text
        );

        fadeUpAndOut(this.scene, text).then(() => {
            text.destroy();
        });
    }

}

let textRenderService = new TextRenderService();
export default textRenderService;