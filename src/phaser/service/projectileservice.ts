import Phaser from 'phaser';
import { Projectile } from '../entity/projectile/projectile';
import characterService from './characterservice';

class ProjectileService {

    projectileMap: Map<string, Projectile> = new Map();
    projectileGroup: Phaser.Physics.Arcade.Group;
    scene: Phaser.Scene;

    init(scene: Phaser.Scene): void {
        this.scene = scene;
        this.projectileGroup = this.scene.physics.add.group();
    }

    createProjectile(x: number, y: number, angle: number, speed: number): void {
        const uuid = Phaser.Math.RND.uuid()
        const projectile = new Projectile(
            this.scene,
            x,
            y,
            angle,
            speed,
            characterService.char.weapon.damage,
            uuid
        );

        this.projectileMap.set(uuid, projectile);
        this.projectileGroup.add(projectile.sprite);

        projectile.fire();
    }

    getProjectile(sprite: Phaser.Physics.Arcade.Sprite): Projectile {
        const uuid = sprite.getData('uuid');
        return this.projectileMap.get(uuid);
    }

    cleanup() {
        this.projectileGroup.children.each((projectile) => {
            let sprite = projectile as Phaser.Physics.Arcade.Sprite;
            if(
                sprite &&
                (sprite.x < 0 || 
                sprite.x > this.scene.game.canvas.width ||
                sprite.y < 0 ||
                sprite.y > this.scene.game.canvas.height)
            ) {
                sprite.destroy();
            }
        });
    }

}

let projectileService = new ProjectileService();
export default projectileService;