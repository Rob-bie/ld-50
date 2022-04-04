import { Character } from '../entity/character/character';

class CharacterService {

    char: Character;

    init(char: Character): void {
        this.char = char;
    }
    
}

let characterService = new CharacterService();
export default characterService;