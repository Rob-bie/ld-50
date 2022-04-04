import audioService from '../../../service/audioservice';
import projectileService from '../../../service/projectileservice';
import { Weapon } from '../weapon';

export class Shotgun extends Weapon {

    textureKey: string = 'shotgun';

    projectileSpeed: number = 1000;
    damage: number = 12;

    weaponDelay: number = 350;
    minDelay: number = 110;

    offsets: number[] = [-15, 0, 15];

    use(): void {
        if(this.canUse()) {
            this.offsets.forEach((offset) => {
                projectileService.createProjectile(
                    this.sprite.x,
                    this.sprite.y,
                    this.sprite.angle + offset,
                    this.projectileSpeed
                );
            });
            this.sound();
        }
    }

    sound(): void {
        audioService.playSound('shotgun');
    }

}
