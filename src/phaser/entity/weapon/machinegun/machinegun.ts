import audioService from '../../../service/audioservice';
import projectileService from '../../../service/projectileservice';
import { Weapon } from '../weapon';

export class MachineGun extends Weapon {

    textureKey: string = 'machinegun';

    projectileSpeed: number = 1000;
    damage: number = 4;

    weaponDelay: number = 175;
    minDelay: number = 50;
    projectileCount: number = 2;

    use(): void {
        if(this.canUse()) {
            for(let i = 0; i < this.projectileCount; i++) {
                projectileService.createProjectile(
                    this.sprite.x,
                    this.sprite.y,
                    this.sprite.angle,
                    this.projectileSpeed
                );
            }
            this.sound();
        }
    }

    sound(): void {
        audioService.playSound('machinegun');
    }

}