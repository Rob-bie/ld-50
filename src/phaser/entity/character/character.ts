import Phaser from 'phaser';
import eventService from '../../service/eventservice';
import { flash } from '../../util/tween';
import { MachineGun } from '../weapon/machinegun/machinegun';
import { Weapon } from '../weapon/weapon';
import { scaleFactor } from './../../config';
import { ActualItem, WeaponItem } from './../../service/dropservice';
import { Shotgun } from './../weapon/shotgun/shotgun';

const textureKey = 'character';

export class Character {

    scene: Phaser.Scene;
    startX: number;
    startY: number;

    maxHealth: number = 100;
    currentHealth: number = 100;
    speed: number = 250;

    sprite: Phaser.Physics.Arcade.Sprite;
    weapon: Weapon;
    weaponRadius: number = 60;

    lastHit: number = Date.now();
    hitThrottle: number = 1000;
    alive: boolean = true;
    switchingWeapons: boolean = false;

    dmgBoost: number = 0;
    spdBoost: number = 0;
    firerateBoost: number = 0;


    constructor(
        scene: Phaser.Scene,
        startX: number,
        startY: number,
        weapon: Weapon
    ) {

        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.weapon = weapon;

        this.maxHealth = 100;
        this.currentHealth = 100;

        this.speed = 250;

        this.init();
        this.createListeners();
    }

    private init(): void {
        this.sprite = this.scene.physics.add.sprite(
            this.startX,
            this.startY,
            textureKey
        )
        .setCircle(10, -2, 5)
        .setScale(scaleFactor);

        this.createAnimation();
        this.sprite.play('walk');

        this.sprite.setCollideWorldBounds(true);

        this.weapon.init(this);
    }

    private createAnimation(): void {
        this.sprite.anims.create({
            key: 'walk',
            frames: this.sprite.anims.generateFrameNames('character'),
            frameRate: 8,
            repeat: -1
        });
    }

    private createListeners(): void {
        eventService.on('ld45:dropCollected', this.handleUpgrade.bind(this));
    }

    private handleUpgrade(item: ActualItem): void {
        let textData = {x: this.sprite.x, y: this.sprite.y, text: ''};
        switch(item.type) {
            case 'hpboost':
                textData.text = '+ hp';
                this.applyHp(item.value);
                break;
            case 'spdboost':
                textData.text = '+ speed';
                this.spdBoost += item.value;
                break;
            case 'dmgboost':
                textData.text = '+ damage';
                this.dmgBoost += item.value;
                break;
            case 'firerateboost':
                textData.text = '+ firerate';
                this.firerateBoost += item.value;
                break;
            case 'gun':
                this.switchingWeapons = true;

                const weapon = item as WeaponItem;
                const gunType = weapon.subtype;
                
                if(gunType === 'shotgun') {
                    textData.text = 'shotgun';
                    this.weapon.destroy();
                    this.weapon = new Shotgun();
                }

                if(gunType === 'machinegun') {
                    textData.text = 'machinegun';
                    this.weapon.destroy();
                    this.weapon = new MachineGun();
                }

                this.weapon.init(this);
                this.switchingWeapons = false;

                break;
        }

        eventService.emit('ld50:shortLivedText', textData);
    }

    idle(): void {
        this.sprite.setVelocity(0, 0);
    }

    up(): void {
        this.sprite.setVelocityY(-(this.speed + this.spdBoost));
    }

    down(): void {
        this.sprite.setVelocityY(this.speed + this.spdBoost);
    }

    left(): void {
        this.sprite.setVelocityX(-(this.speed + this.spdBoost));
        this.sprite.setFlipX(false);
    }

    right(): void {
        this.sprite.setVelocityX(this.speed + this.spdBoost);
        this.sprite.setFlipX(true);
    }

    useWeapon(): void {
        if(!this.switchingWeapons && this.alive) {
            this.weapon.use();
        }
    }
    
    private applyHp(hp: number): void {
        this.currentHealth += hp;
        if(this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        eventService.emit(
            'ld50:hpChanged', 
            { 
                currentHp: this.currentHealth, 
                maxHp: this.maxHealth 
            }
        );
    }

    applyDamage(damage: number): void {
        const hitTime = Date.now();
        if(hitTime - this.lastHit > this.hitThrottle) {
            this.lastHit = hitTime;
            this.currentHealth -= damage;
            if(this.currentHealth <= 0) {
                this.currentHealth = 0;
                this.die();
            } else {
                flash(this.scene, this.sprite);
            }

            eventService.emit(
                'ld50:hpChanged', 
                { 
                    currentHp: this.currentHealth, 
                    maxHp: this.maxHealth 
                }
            );
        }
    }

    destroy(): void {
        this.weapon.destroy();
        this.sprite.destroy();
    }

    private die() {
        this.alive = false;
        eventService.emit('ld50:gameOver');
    }

    private syncWeapon() {
        if(!this.switchingWeapons) {
            const dx = this.scene.game.input.activePointer.y - this.sprite.y;
            const dy = this.scene.game.input.activePointer.x - this.sprite.x;
    
            const angle = Math.atan2(dx, dy);
            
            const xPos = Math.cos(angle) * this.weaponRadius;
            const yPos = Math.sin(angle) * this.weaponRadius;
            this.weapon.sprite.setPosition(xPos + this.sprite.x, yPos + this.sprite.y);
    
            const weaponAngle = (360 / (2 * Math.PI)) * angle;
    
            this.weapon.sprite.setFlipY(
                !(weaponAngle > -90 && weaponAngle < 90)
            );
        
            this.weapon.sprite.setAngle(weaponAngle);
        }
    }

    update(_delta: number): void {
        if(this.alive) {
            this.syncWeapon();
        }
    }

}