import { joinWithSlash } from "./utils";

export class Paths {
    constructor( base = 'models/standard' ){
        this.models = base;
        this.setup();
    }

    setup(){
        this.setupScenePaths();
        this.setupCardPaths();
        this.setupTablePaths();
    }

    setupTablePaths(){
        const tableClothTextureName = 'blackjack_cloth_d_hq.38a8c.jpg';
        const tableCardHolderDiffuseTextureName = 'cardholdershoe_dcardholdershoe_a_baseColor.75369.png';
        const modelsPath = this.models;
        const tablePath = joinWithSlash( modelsPath, `table` );

        this.assignModelPathToThis( tablePath, {
            tableClothTexturePath: tableClothTextureName,
            tableCardHolderDiffuseTexturePath: tableCardHolderDiffuseTextureName
        } );

        this.assignToThis( {
            tableClothTextureName,
            tableCardHolderDiffuseTextureName
        } )
    }

    setupCardPaths(){
        const cardBabylonName = 'card.88687.babylon';
        const cardTextureName = 'cards.dd11b.jpg';
        const modelsPath = this.models;
        const cardPath = joinWithSlash( modelsPath, `card` );

        this.assignModelPathToThis( cardPath, {
            cardBabylonPath: cardBabylonName,
            cardAtlasPath: cardTextureName
        } );

        this.assignToThis( {
            cardPath,
            cardBabylonName,
            cardTextureName
        } );
    }

    setupScenePaths(){
        const sceneNameBabylon = 'blackjack_table.incremental.449b4.babylon';
        const modelsPath = this.models;
        const scenePath = joinWithSlash( modelsPath, `table` );

        this.assignModelPathToThis( scenePath, {
            scenePathBabylon: sceneNameBabylon
        } );

        this.assignToThis( {
            table: scenePath
        } )
    }

    assignModelPathToThis( path, obj = {} ){
        Object.entries( obj ).forEach( ( [ key, val ] ) => {
            const newPath = joinWithSlash( path, val );
            this[ key ] = newPath;
        } );
    }

    assignToThis( obj = {} ){
        Object.assign( this, obj );
    }
}