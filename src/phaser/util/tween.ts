import Phaser from 'phaser';

export function fadeUpAndOut(
    scene: Phaser.Scene,
    entity: Phaser.GameObjects.GameObject
): Promise<void> {
    return new Promise((resolve) => {
        scene.tweens.add({
            targets: entity,
            duration: 500,
            x: Phaser.Math.RND.pick(['-=5', '+=5', '-=10', '+=10']),
            y: '-=30',
            alpha: 0,
            ease: 'Sine.easeInOut',
            onComplete: () => resolve()
        });
    });
}

export function moveTo(
    scene: Phaser.Scene,
    entity: Phaser.GameObjects.GameObject,
    x: number,
    y: number
): Promise<void> {
    return new Promise((resolve) => {
        scene.tweens.add({
            targets: entity,
            duration: 1000,
            x: x,
            y: y,
            ease: 'Sine.easeInOut',
            onComplete: () => resolve()
        });
    });
}

export function flash(
    scene: Phaser.Scene,
    entity: Phaser.GameObjects.GameObject
): Promise<void> {
    return new Promise((resolve) => {
        scene.tweens.add({
            targets: entity,
            duration: 125,
            alpha: 0,
            repeat: 2,
            yoyo: true,
            onComplete: () => resolve()
        });
    });
}

export function bounce(
    scene: Phaser.Scene,
    entity: Phaser.GameObjects.GameObject
): Phaser.Tweens.Tween {
    return scene.tweens.add({
        targets: entity,
        duration: 2000,
        y: '-=3',
        repeat: -1,
        yoyo: true,
        ease: 'bounce.inOut'
    });
}