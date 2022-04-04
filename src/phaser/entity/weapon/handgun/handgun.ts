import audioService from '../../../service/audioservice';
import projectileService from '../../../service/projectileservice';
import { Weapon } from '../weapon';

export class Handgun extends Weapon {

    textureKey: string = 'handgun';

    projectileSpeed: number = 800;
    damage: number = 6;

    weaponDelay: number = 250;
    minDelay: number = 100;

    use(): void {
        if(this.canUse()) {
            projectileService.createProjectile(
                this.sprite.x,
                this.sprite.y,
                this.sprite.angle,
                this.projectileSpeed
            );
            this.sound();
        }
    }

    sound(): void {
        audioService.playSound('handgun');
    }

}