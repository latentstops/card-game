export class CardGameModels {
    constructor(game) {
        this.parent = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.engine = game.engine;

        this.setupPaths();
        this.load();
    }

    load(){
        // this.loadTable();
        this.loadCards();
    }

    loadTable(){
        const scene = this.scene;
        BABYLON.SceneLoader.ImportMesh('','/', 'models/standard/table/blackjack_table.incremental.449b4.babylon', scene, (tableMeshes) => {
            this.tableMeshes = tableMeshes;

        });
    }

    loadCards(){
        const scene = this.scene;
        const cardPathBabylon = this.paths.cardPathBabylon;

        BABYLON.SceneLoader.ImportMesh('','/', cardPathBabylon, scene, async (cardMeshes) => {
            this.setupMeshes( cardMeshes );            
            await this.setCardFaceMaterial();
            this.setupFaceUV();
            this.setFrameToCardFaceSide(0,2);
            this.generate();
            this.correctDefaultLight(scene);
            this.setCardBackside();
        });        
        
    }

    setCardBackside() {
        const texture = this.cardFace.material.diffuseTexture.clone();
        const material = this.cardFace.material.clone();
        material.texture = texture;

        this.cardBack.material = material;

        const map = this.finMapByName('backside');
        this.setFaceByXY(map.args[0], map.args[1], cardGame.models.cardBack);
    }

    correctDefaultLight(scene) {
        const defaultLight = scene.getLightByID("default light");
        defaultLight.direction.x = Math.PI / 2;

        this.parent.defaultLight = defaultLight;
    }

    random(count = 100, interval = 50){
        const camera = this.camera;
        let counter = 0;
        let animationFrameID = null;
        this.random.alpha = 0.55;
        (function randomize(self) {
            let x = Math.floor(Math.random() * 11);
            let y = Math.floor(Math.random() * 4);
            cardGame.models.setFaceByXY(x, y);

            camera.alpha += counter > count / 2 ? self.random.alpha * 2 : self.random.alpha;

            if (counter === count) {
                camera.alpha = Math.PI / 2;
                return cancelAnimationFrame(animationFrameID);
            }

            animationFrameID = requestAnimationFrame(randomize.bind(null,self));
            counter++;
        })(this);

        (function changeCameraView() {
            setTimeout(changeCameraView, interval);
        })();
    }

    setFaceByName(name){
        const map = this.finMapByName(name);
        this.setFaceByXY(...map.args);
    }

    finMapByName(name) {
        const nameMap = this.nameMap;
        const map = nameMap.find(map => map.name.toLowerCase() === name.toLowerCase());
        return map;
    }

    setFaceByXY( x, y, mesh ){
        const Y = 6 - y;
        this.setFrameToCardFaceSide(x, Y, mesh);
    }

    setFrameToCardFaceSide(x,y, mesh){
        this.x = x;
        this.y = y;
        const card = mesh || this.cardFace;
        const faceUV = this.faceUV;
        const cardTexture = card.material.diffuseTexture;
        const uOffset = faceUV.uOffset;
        const vOffset = faceUV.vOffset;
        const scale = vOffset;
        const yStep = 0.125;

        cardTexture.uScale = cardTexture.vScale = scale;
        cardTexture.uOffset = x * uOffset;
        cardTexture.vOffset = y * vOffset;
    }

    setupFaceUV(){
        const cardWidth = 92;
        const cardHeight = 128;

        const card = this.cardFace;
        const texture = card.material.diffuseTexture;

        const textureSize = texture.getSize();
        const textureWidth = textureSize.width;
        const textureHeight = textureSize.height;

        const vOffset = cardHeight / textureHeight;
        const uOffset = cardWidth / textureWidth;

        const columns = Math.floor(textureWidth / cardWidth);
        const rows = Math.floor(textureHeight / cardHeight);

        const faceUV = new Array(6);
        faceUV.rows = rows;
        faceUV.columns = columns;
        faceUV.columnsDiff = ( textureWidth - (columns * cardWidth)) / textureWidth ;
        faceUV.rowDiff = (textureHeight - (rows * cardHeight)) / textureHeight;

        faceUV.textureSize = textureSize;
        faceUV.textureWidth = textureSize.width;
        faceUV.textureHeight = textureSize.height;
        faceUV.cardWidth = cardWidth;
        faceUV.cardHeight = cardHeight;
        faceUV.vOffset = vOffset;
        faceUV.uOffset = uOffset;

/*        let f = 0;

        for( let c = 1; c <= columns; c++ ) {
            
            for( let r = 1; r <= rows; r++  ){
            
                const Ubottom_left = c * ( 1 / columns );
                const Vtop_right = r * ( 1 / rows );
                const Utop_right = (c + 1) * (1 / columns);
                const Vbottom_left = (r + 1) * ( 1 / rows);

                faceUV[f] = new BABYLON.Vector4(Ubottom_left, Vbottom_left, Utop_right, Vtop_right);

                f++;
            }

        }*/

        this.faceUV = faceUV;
    }
    generate(){
        const map = [];

        let f = 0;

        for( let y = 0; y <= 4; y++ ){

            for( let x = 0; x <= 10; x++ ) {

                if( f < 13 ){

                    map.push( { name: getName(`x`, f + 1), args: [x,y] } );

                } else if( f === 13 ){

                    map.push( { name: `backSide`, args: [x,y] } );

                } else if( f > 13 && f <= 13 + 13 ) {

                    map.push( { name: getName(`q`, f-13), args: [x,y] } );

                } else if( f > 26 && f <= 26+13 ){

                    map.push( { name: getName(`s`, f-26), args: [x,y] } );

                } else if( f > 39 && f <= 39+13 ){

                    map.push( { name: getName(`g`, f-39), args: [x,y] } );

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

        this.nameMap = map;

        return map;
    }
    setCardFaceMaterial(){
        const scene = this.scene;
        const cardPathAtlas = this.paths.cardPathAtlas;
        const mesh = this.cardFace;

        const mat = new BABYLON.StandardMaterial("mat", scene);
        const texture = new BABYLON.Texture(cardPathAtlas, scene);
        const textureLoadPromise = new Promise(res => texture.onLoadObservable.add(res));

        mat.diffuseTexture = texture;
        mesh.material = mat;

        return textureLoadPromise;
    }

    setupMeshes( cardMeshes ){
        const cardFace = cardMeshes[0];
        const cardBack = cardMeshes[1];
        const cardFaceMaterial = cardFace.material;
        const cardBackMaterial = cardBack.material;

        this.cardFace = cardFace;
        this.cardBack = cardBack;
        this.cardMeshes = cardMeshes;
        this.cardFaceMaterial = cardFaceMaterial;
        this.cardBackMaterial = cardBackMaterial;
    }

    setupPaths(){
        const cardPath        = 'models/standard/card';
        const cardBabylonName = 'card.88687.babylon';
        const cardAtlasName   = 'cards.dd11b.jpg';

        const cardPathBabylon = join([cardPath, cardBabylonName], '/');
        const cardPathAtlas  = join([cardPath, cardAtlasName], '/');
        
        this.paths = { 
            cardPath, 
            cardPathBabylon,
            cardBabylonName,
            cardAtlasName,
            cardPathAtlas
        };
    }

}

function join(paths, separator = '/'){
    return paths.join( separator );
}
