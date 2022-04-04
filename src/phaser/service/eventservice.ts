import Phaser from 'phaser';

class EventService {

    events: Phaser.Events.EventEmitter;

    init(game: Phaser.Game) {
        this.events = game.events;
    }

    on(event: string, fn: Function) {
        this.events.on(event, fn);
    }

    off(event: string, fn: Function) {
        this.events.off(event, fn);
    }

    emit(event: string, args?: any) {
        this.events.emit(event, args);
    }

}

let eventService = new EventService();
export default eventService;