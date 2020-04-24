export class CardAtlas {

    getBackSide(){
        return this.getTextureByCardName('backside');
    }

    getTextureByCardName( name ){
        const texture = this.texture;

        this.setFaceByName(texture, name);

        return texture;
    }

    constructor( root ) {
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

        for( let y = 0; y <= 4; y++ ){

            for( let x = 0; x <= 10; x++ ) {

                if( f < 13 ){

                    map.push( { name: getName(`x`, f + 1), args: [ x, y ] } );

                } else if( f === 13 ){

                    map.push( { name: `backSide`, args: [ x, y ] } );

                } else if( f > 13 && f <= 13 + 13 ){

                    map.push( { name: getName(`q`, f - 13), args: [ x, y ] } );

                } else if( f > 26 && f <= 26 + 13 ){

                    map.push( { name: getName(`s`, f - 26), args: [ x, y ] } );

                } else if( f > 39 && f <= 39 + 13 ){

                    map.push( { name: getName(`g`, f - 39), args: [ x, y ] } );

                }

                f++;

            }

        }

        function getName(prefix, num){
            const real = num + 1;
            const numMap = {
                11: 'A',
                12: 'J',
                13: 'K',
                14: 'Q',
            };
            return [prefix, numMap[real] || real].join('');
        }

        const [backSide] = map.splice(13, 1);
        map.push(backSide);

        this.cardNameMap = map;
    }

    setupUVOffsets(){
        const cardWidth = 92;
        const cardHeight = 128;

        const texture = this.texture;

        const textureSize = texture.getSize();
        const textureWidth = textureSize.width;
        const textureHeight = textureSize.height;

        const vOffset = cardHeight / textureHeight;
        const uOffset = cardWidth / textureWidth;

        this.vOffset = vOffset;
        this.uOffset = uOffset;
    }

    setFaceByName( texture, name ){
        const map = this.findMapByName( name );

        const { args: [ x, y ] } = map;

        this.setFaceByXY( x, y, texture );
    }

    findMapByName( name ) {
        const fromNameMap = this.cardNameMap;

        const mapWithSameName = map => map.name.toLowerCase() === name.toLowerCase();

        const foundMap = fromNameMap.find( mapWithSameName );

        return foundMap;
    }

    setFaceByXY( x, y, texture ){
        const experimentalNumber = 6;
        const correctedY = experimentalNumber - y;

        this.setFrameToCardFaceSide( texture, x, correctedY);
    }

    setFrameToCardFaceSide( texture, x, y ){

        if( !texture ) { return console.warn("No Texture"); }

        const uOffset = this.uOffset;
        const vOffset = this.vOffset;
        const scale = vOffset;

        texture.uScale = texture.vScale = scale;
        texture.uOffset = x * uOffset;
        texture.vOffset = y * vOffset;
    }

    get texture(){
        const texture = this.textureOrigin;
        return texture.clone();
    }

    random(count = 100, interval = 50){
        const camera = this.camera;
        const alpha = 0.55;

        let counter = 0;
        let animationFrameID = null;

        const randomizer = new function Randomizer(root) {

            this.randomize = () => {

                let x = Math.floor(Math.random() * 11 );
                let y = Math.floor(Math.random() * 4 );

                root.models.setFaceByXY( x, y );

                camera.alpha += counter > count / 2 ? alpha * 2 : alpha;

                if (counter === count) {
                    camera.alpha = Math.PI / 2;
                    return cancelAnimationFrame( animationFrameID );
                }

                this.animationFrameID = requestAnimationFrame( () => this.randomize(root) );
            };

            this.stop = () => {
                cancelAnimationFrame( this.animationFrameID );
            };
            counter++;
        }( this );

        randomizer.randomize();

        setTimeout(() => randomizer.stop(), 2000);
    }

}