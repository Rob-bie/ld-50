import { Monster } from '../monster';

export class Eyeball extends Monster {

    textureKey: string = 'eyeball';
    damage: number = 4;
    speed: number = 30;
    health: number = 5;
    rotateToPlayer: boolean = true;

    playAnimation(): void {

    }


}