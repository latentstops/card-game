import { Game } from './deps';
import { HouseGameModels } from './HouseGameModels';

export class HouseGame extends Game {
    constructor(config){
        super(config);
    }

    setup(){
        super.setup();
        this.setupModels();
    }

    async load(){
        await this.models.load()
    }

    afterLoad(){

    }

    setupModels(){
        this.models = new HouseGameModels();
    }
}
