import Phaser from 'phaser';
import { Drop } from '../entity/drop/drop';

enum BoostType {
    HpBoost = "hpboost",
    DmgBoost = "dmgboost",
    SpdBoost = "spdboost",
    FirerateBoost = "firerateboost"
}

enum WeaponType {
    Gun = "gun"
}

enum NoType {
    Nothing
}

interface Weighted {
    weight: number;
}

interface BoostItem {
    type: BoostType,
    value: number
}

export interface WeaponItem {
    type: WeaponType,
    subtype: string
}

export type ItemType = BoostItem | WeaponItem | NoType.Nothing
export type ActualItem = BoostItem | WeaponItem

interface DropTableItem extends Weighted {
    item: ItemType,
    textureKey?: string
}

class DropService {

    globalDropTable: DropTableItem[] = [
        {
            item: {
                type: BoostType.HpBoost,
                value: 8
            },
            weight: 6,
            textureKey: 'hp-boost'
        },
        {
            item: {
                type: BoostType.DmgBoost,
                value: 2
            },
            weight: 8,
            textureKey: 'dmg-boost'
        },
        {
            item: {
                type: BoostType.SpdBoost,
                value: 10
            },
            weight: 4,
            textureKey: 'spd-boost'
        },
        {
            item: {
                type: BoostType.FirerateBoost,
                value: 15
            },
            weight: 8,
            textureKey: 'firerate-boost'
        },
        {
            item: {
                type: WeaponType.Gun,
                subtype: 'shotgun'
            },
            weight: 3,
            textureKey: 'shotgun-icon'
        },
        {
            item: {
                type: WeaponType.Gun,
                subtype: 'machinegun'
            },
            weight: 3,
            textureKey: 'machinegun-icon'
        },
        {
            item: NoType.Nothing,
            weight: 70
        }
    ]

    dropMap: Map<string, Drop> = new Map();
    dropGroup: Phaser.Physics.Arcade.Group;
    scene: Phaser.Scene;

    init(scene: Phaser.Scene): void {
        this.scene = scene;
        this.dropGroup = this.scene.physics.add.group();
    }

    destroyAll(): void {
        this.dropMap.forEach((drop, k) => {
            if(drop?.sprite?.body) {
                drop.sprite.destroy();
                this.dropMap.delete(k);
            }
        });
    }

    createDrop(x: number, y: number): void {
        const uuid = Phaser.Math.RND.uuid()
        const drop = this.selectDrop(this.globalDropTable);

        if(drop.item !== NoType.Nothing) {
            const d = new Drop(
                this.scene,
                x,
                y,
                drop.textureKey,
                drop.item,
                uuid
            );
            this.dropMap.set(uuid, d);
            this.dropGroup.add(d.sprite);
        }

    }

    private selectDrop<T extends Weighted>(candidates: T[]): T {
        let sum = 0;
        
        candidates.forEach((c) => {
            sum += c.weight;
        });
    
        let rand = Phaser.Math.Between(0, sum);
        for(let i = 0; i < candidates.length; i++) {
            if(rand <= candidates[i].weight) {
                return candidates[i];
            }
            rand -= candidates[i].weight;
        }
    
        return candidates[0];
    }

    getDrop(sprite: Phaser.Physics.Arcade.Sprite): Drop {
        const uuid = sprite.getData('uuid');
        return this.dropMap.get(uuid);
    }

}

let dropService = new DropService();
export default dropService;