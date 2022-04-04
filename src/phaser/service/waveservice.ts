import eventService from './eventservice';
import monsterService from './monsterservice';

class WaveService {

    spawnDelay: number = 700;
    minimumDelay: number = 50;

    healthMultiplier: number = 1.0;
    damageMultiplier: number = 1.0;

    spawnIncrease: number = 50;
    healthIncrease: number = 0.90;
    damageIncrease: number = 0.35;

    waveTimer: number;
    spawnTimer: number;

    elapsed: number = 0;
    waveCount: number = 1;
    waveInterval: number = 10000;

    start(): void {
        this.createWaveTicker();
        this.createSpawnTicker();
    }

    stop(): void {
        clearInterval(this.waveTimer);
        clearInterval(this.spawnTimer);
    }

    private createWaveTicker(): void {
        this.waveTimer = window.setInterval(() => {
            this.elapsed += 1000;
            if(this.elapsed % this.waveInterval === 0) {
                this.nextWave();
            }
            eventService.emit('ld50:waveTick', this.elapsed / 1000)
        }, 1000);
    }

    private createSpawnTicker(): void {
        if(this.spawnTimer) {
            clearInterval(this.spawnTimer);
        }

        this.spawnTimer = window.setInterval(() => {
            this.spawnMonster();
        }, this.spawnDelay);
    }

    private nextWave(): void {
        this.waveCount++;

        eventService.emit('ld50:waveUpdate', this.waveCount);

        if(this.spawnDelay > this.minimumDelay) {
            this.spawnDelay -= this.spawnIncrease;
        }

        this.healthMultiplier += this.healthIncrease;
        this.damageMultiplier += this.damageIncrease;

        this.createSpawnTicker();
    }

    private spawnMonster(): void {
        monsterService.createMonster();
    }

}

let waveService = new WaveService();
export default waveService;