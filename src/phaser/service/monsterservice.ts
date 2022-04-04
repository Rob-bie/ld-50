import Phaser from 'phaser';
import { Monster } from '../entity/monster/monster';
import { Bat } from './../entity/monster/bat/bat';
import { Eyeball } from './../entity/monster/eyeball/eyeball';

const monsterTypes = [
    Bat,
    Bat,
    Eyeball
];

enum SpawnZone {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
};

class MonsterService {

    monsterMap: Map<string, Monster> = new Map();
    monsterGroup: Phaser.Physics.Arcade.Group;
    scene: Phaser.Scene;

    init(scene: Phaser.Scene): void {
        this.scene = scene;
        this.monsterGroup = this.scene.physics.add.group();
    }

    createMonster(): void {
        const monsterType = Phaser.Math.RND.pick(monsterTypes);
        const uuid = Phaser.Math.RND.uuid();

        const monster = new monsterType();

        const zone = Phaser.Math.RND.pick(
            [
                SpawnZone.TOP,
                SpawnZone.RIGHT,
                SpawnZone.BOTTOM,
                SpawnZone.LEFT
            ]
        );

        let spawnPos = {x: 0, y: 0};

        const w = this.scene.game.canvas.width;
        const h = this.scene.game.canvas.height;

        switch(zone) {
            case SpawnZone.TOP:
                spawnPos = {
                    x: Phaser.Math.RND.between(0, w),
                    y: Phaser.Math.RND.between(-50, -100)
                };
                break;
            case SpawnZone.RIGHT:
                spawnPos = {
                    x: Phaser.Math.RND.between(w + 50, w + 100),
                    y: Phaser.Math.RND.between(0, h)
                };
                break;
            case SpawnZone.BOTTOM:
                spawnPos = {
                    x: Phaser.Math.RND.between(0, w),
                    y: Phaser.Math.RND.between(h + 50, h + 100)
                };
                break;
            case SpawnZone.LEFT:
                spawnPos = {
                    x: Phaser.Math.RND.between(-50, -100),
                    y: Phaser.Math.RND.between(0, h)
                };
                break;
        }

        monster.init(this.scene, spawnPos.x, spawnPos.y, uuid);

        this.monsterMap.set(uuid, monster);
        this.monsterGroup.add(monster.sprite);

        //monster.setPhysicsProps();

    }

    getMonster(sprite: Phaser.Physics.Arcade.Sprite): Monster {
        const uuid = sprite.getData('uuid');
        return this.monsterMap.get(uuid);
    }

    destroyAll(): void {
        this.monsterMap.forEach((monster, k) => {
            if(monster?.sprite?.body) {
                monster.sprite.destroy();
                this.monsterMap.delete(k);
            }
        });
    }

    update(): void {
        this.monsterMap.forEach((monster, k) => {
            if(monster?.sprite?.body) {
                monster.follow();
            } else {
                this.monsterMap.delete(k);
            }
        });
    }

}

let monsterService = new MonsterService();
export default monsterService;