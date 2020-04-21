import {joinWithSlash} from "./utils";

export class Paths {
    constructor(base = 'models/standard') {
        this.models = base;
        this.setup();
    }

    setup(){
        this.setupScenePaths();
        this.setupCardPaths();
    }

    setupScenePaths(){
        const sceneBabylonName = 'blackjack_table.incremental.449b4.babylon';
        const modelsPath       = this.models;
        const scenePath        = joinWithSlash( modelsPath, `table` );
        const scenePathBabylon = joinWithSlash( scenePath, sceneBabylonName );

        this.scenePath = scenePath;
        this.scenePathBabylon = scenePathBabylon;
    }

    setupCardPaths() {
        const cardBabylonName = 'card.88687.babylon';
        const cardAtlasName   = 'cards.dd11b.jpg';
        const modelsPath      = this.models;
        const cardPath        = joinWithSlash( modelsPath, `card` );
        const cardPathBabylon = joinWithSlash( cardPath, cardBabylonName );
        const cardPathAtlas   = joinWithSlash( cardPath, cardAtlasName );

        this.cardPath        = cardPath;
        this.cardPathBabylon = cardPathBabylon;
        this.cardBabylonName = cardBabylonName;
        this.cardAtlasName   = cardAtlasName;
        this.cardPathAtlas   = cardPathAtlas;
    }
}