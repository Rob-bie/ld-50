import Phaser from 'phaser';
import { Character } from '../entity/character/character';
import audioService from '../service/audioservice';
import cameraService from '../service/cameraservice';
import characterService from '../service/characterservice';
import dropService from '../service/dropservice';
import eventService from '../service/eventservice';
import monsterService from '../service/monsterservice';
import projectileService from '../service/projectileservice';
import waveService from '../service/waveservice';
import { Handgun } from './../entity/weapon/handgun/handgun';

export class GameScene extends Phaser.Scene {

    char: Character;
    keys: object;
    
    fireAccumulator: number = 0;
    holdDownDelay: number = 50;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {

        this.createBackground();

        this.char = new Character(
            this,
            this.game.canvas.width / 2,
            this.game.canvas.height / 2,
            new Handgun()
        );

        this.createListeners();

        this.initServices();
        this.createCollisions();
        this.initController();

        this.loadHud();

        this.start();
    }

    private createBackground(): void {
        this.add.image(
            this.game.canvas.width / 2,
            this.game.canvas.height / 2,
            'background'
        );
    }

    private createListeners(): void {
        eventService.on('ld50:gameOver', () => {
            audioService.stopSound('loop');

            waveService.stop();
            monsterService.destroyAll();
            dropService.destroyAll();

            this.char.destroy();

            setTimeout(() => {
                cameraService.fade();
                audioService.playSound('gameover');
            }, 750);

        });
    }

    private loadHud() {
        this.scene.run('HudScene');
    }

    private start(): void {
        waveService.start();
        audioService.playSound('loop');
    }

    private handleMovement(): void {
        const wDown = this.keys['W'].isDown;
        const aDown = this.keys['A'].isDown;
        const sDown = this.keys['S'].isDown;
        const dDown = this.keys['D'].isDown;

        if(!wDown && !aDown && !sDown && !dDown) this.char.idle();

        if(wDown) this.char.up();
        if(aDown) this.char.left();
        if(sDown) this.char.down();
        if(dDown) this.char.right();
    }

    private handleFire(delta: number): void {
        this.fireAccumulator += delta;
        if(this.input.activePointer.isDown && this.fireAccumulator > this.holdDownDelay) {
            this.fireAccumulator = 0;
            this.char.useWeapon();
        }
        
    }

    update(_time: number, delta: number): void {
        
        if(this.char.alive) {
            this.handleMovement();
            this.handleFire(delta);
            this.char.update(delta);
        }

        monsterService.update();
        projectileService.cleanup();
    }

    private initServices(): void {
        audioService.init(this);
        cameraService.init(this);
        characterService.init(this.char);
        projectileService.init(this);
        monsterService.init(this);
        dropService.init(this);
    }

    private createCollisions(): void {
        /* Monsters collide with monsters */
        this.physics.add.collider(
            monsterService.monsterGroup,
            monsterService.monsterGroup
        )

        this.physics.add.collider(
            monsterService.monsterGroup,
            characterService.char.sprite,
            (_p, m) => {
                const monster = monsterService.getMonster(
                    m as Phaser.Physics.Arcade.Sprite
                );
                
                this.char.applyDamage(monster.damage);
            }
        );

        this.physics.add.collider(
            monsterService.monsterGroup,
            projectileService.projectileGroup,
            (m, p) => {
                const monster = monsterService.getMonster(
                    m as Phaser.Physics.Arcade.Sprite
                );

                const projectile = projectileService.getProjectile(
                    p as Phaser.Physics.Arcade.Sprite
                );

                if(monster?.sprite?.body) {
                    monster.applyDamage(projectile.damage + characterService.char.dmgBoost);
                }

                projectile.destroy();
            }
        );

        this.physics.add.collider(
            dropService.dropGroup,
            this.char.sprite,
            (_p, d) => {
                const drop = dropService.getDrop(
                    d as Phaser.Physics.Arcade.Sprite
                );
                
                drop.collect();
            }
        )
    }

    private initController(): void {
        this.keys = this.input.keyboard.addKeys('W,A,S,D');
    }


}