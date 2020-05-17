import { cardNameMap } from '../deps' ;

export class CardAtlas {

    getBackSide(){
        const texture =  this.getTextureByCardName( 'backside' );

        texture.uOffset = -0.444;
        texture.vOffset = 0;

        return texture;
    }

    getTextureByCardName( name ){
        return this.setFaceByName( name );
    }

    constructor( root ){
        this.root = root;
        this.engine = root.engine;
        this.scene = root.scene;
        this.paths = root.paths;
        this.textureOrigin = root.models.cardAtlasTexture;

        this.setup();
    }

    setup(){
        this.setupUVOffsets();
        this.setupCardNameMap();
    }

    setupCardNameMap(){
        const map = [];

        let f = 0;

        for ( let y = 0; y <= 5; y++ ) {

            for ( let x = 1; x <= 9; x++ ) {

                const name = cardNameMap[ f ];
                map.push( { name, args: [ x, y ] } );

                f++;

            }

        }

        this.cardNameMap = map;
    }

    setupUVOffsets(){
        const cardWidth = 113.777777;
        const cardHeight = 158.33333;

        const texture = this.texture;

        const textureSize = texture.getSize();
        const textureWidth = textureSize.width;
        const textureHeight = textureSize.height;

        const vOffset = cardHeight / textureHeight;
        const uOffset = cardWidth / textureWidth;

        this.vOffset = vOffset;
        this.uOffset = uOffset;
    }

    setFaceByName( name ){
        this.name = name;

        const map = this.findMapByName( name );

        const { args: [ x, y ] } = map;

        return this.setFaceByXY( x, y );
    }

    findMapByName( name ){
        const fromNameMap = this.cardNameMap;

        const mapWithSameName = map => map.name.toLowerCase() === name.toLowerCase();

        const foundMap = fromNameMap.find( mapWithSameName );

        return foundMap;
    }

    setFaceByXY( x, y ){
        const texture = this.texture;
        const experimentalNumber = 0;
        const correctedY = experimentalNumber - y;

        this.setFrameToCardFaceSide( texture, x, correctedY );

        return texture;
    }

    setFrameToCardFaceSide( texture, x, y ){

        if ( !texture ) {
            return console.warn( "No Texture" );
        }

        const uOffset = this.uOffset;
        const vOffset = this.vOffset;
        const scale = vOffset;

        texture.uScale = -1;
        texture.vScale = 1;
        texture.uOffset = x * uOffset;
        texture.vOffset = y * vOffset;
    }

    get texture(){
        const texture = this.textureOrigin || new BABYLON.Texture();
        return texture.clone();
    }

    random( count = 100, interval = 50 ){
        const camera = this.camera;
        const alpha = 0.55;

        let counter = 0;
        let animationFrameID = null;

        const randomizer = new function Randomizer( root ){

            this.randomize = () => {

                let x = Math.floor( Math.random() * 11 );
                let y = Math.floor( Math.random() * 4 );

                root.models.setFaceByXY( x, y );

                camera.alpha += counter > count / 2 ? alpha * 2 : alpha;

                if ( counter === count ) {
                    camera.alpha = Math.PI / 2;
                    return cancelAnimationFrame( animationFrameID );
                }

                this.animationFrameID = requestAnimationFrame( () => this.randomize( root ) );
            };

            this.stop = () => {
                cancelAnimationFrame( this.animationFrameID );
            };
            counter++;
        }( this );

        randomizer.randomize();

        setTimeout( () => randomizer.stop(), 2000 );
    }

}