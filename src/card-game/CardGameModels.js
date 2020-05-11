import { Vector3 } from "@babylonjs/core";
import { utils, AsyncLoader } from "./deps";

const { deepAssign, joinWithSlash } = utils;

export class CardGameModels extends AsyncLoader {
    constructor( root ){
        super( root.scene );
        this.parent = root;
        this.paths = root.paths;
        this.scene = root.scene;
        this.camera = root.camera;
        this.engine = root.engine;

        this.cardAtlas = null;
        this.cardMeshes = [];
    }

    async load(){
        await this.setupAsyncObjects();

        this.setupGround();
        this.beautifyScene();
    }

    async setupAsyncObjects(){
        // await this.setupAsyncScene();
        // await this.setupAsyncCardEvolution();
        await this.setupAsyncCard();
        await this.setupAsyncTable();
        await this.setupAsyncChair();
        await this.setupAsyncChip();
        // await this.setupAsyncPufik();
    }

    async setupAsyncPufik(){
        const [ pufikMeshes ] = await this.importMeshAsync( `models/standard/pufik/pufik.glb` );

        const pufikMesh = pufikMeshes[ 1 ];
        const pufikMaterial = pufikMesh.material;

        deepAssign( pufikMesh, {
            scaling: new Vector3( 50, 50, 50 ),
            position: new Vector3( 0, 95, 0 ),
            // rotation: new Vector3( 0, -Math.PI, 0 )
        } );

        deepAssign( pufikMaterial, {
            useAlphaFromAlbedoTexture: false
        } );

        this.pufikMesh = pufikMesh;
        this.pufikMeshes = pufikMeshes;
    }

    beautifyScene(){
        this.correctDefaultLight();
        // this.connectTextures();
    }

    setupGround(){
        const scene = this.scene;
        const ground = BABYLON.Mesh.CreateGround( "ground", 1000, 1000, 1, scene, false );
        const groundMaterial = new BABYLON.StandardMaterial( "ground", scene );

        deepAssign( groundMaterial, {
            specularColor: BABYLON.Color3.White(),
            alpha: 0,
        } );

        deepAssign( groundMaterial, {
            position: { y: -0.15 }
        } );

        ground.material = groundMaterial;


        this.ground = ground;
    }

    async setupAsyncChip(){
        const scene = this.scene;
        const chip = await BABYLON.SceneLoader.ImportMeshAsync( '', '/', 'chip/chip.glb', scene );
        const chipMeshes = chip.meshes;
        const textureNames = [
            "Chips_W1_BaseColor.jpg",
            "Chips_R5_BaseColor.jpg",
            "Chips_G25_BaseColor.jpg",
            "Chips_B100_BaseColor.jpg",
            "Chips_V500_BaseColor.jpg"
        ];
        const texturesAsync = textureNames.map( name => this.loadTextureAsync(`chip/${name}`) );
        const textures = await Promise.all( texturesAsync );

        this.chipTextures = textures;
        this.chipMeshes = chipMeshes;
    }

    async setupAsyncChair(){
        const scene = this.scene;
        const chairImported = await BABYLON.SceneLoader.ImportMeshAsync( '', '/', 'chair.glb', scene );
        const chairMeshes = chairImported.meshes;

        const chair1 = getMeshByName( "chair_01" );
        chair1.position.set(128,0,82);
        chair1.rotationQuaternion = null;
        chair1.rotation.z = 0;
        chair1.rotation.y = -Math.PI * 0.67;
        chair1.rotation.x = -Math.PI/2;

        const chair2 = chair1.clone();
        chair2.position.set(0,0,137);
        chair2.rotationQuaternion = null;
        chair2.rotation.z = 0;
        chair2.rotation.y = -Math.PI;
        chair2.rotation.x = -Math.PI / 2;

        const chair3 = chair1.clone();
        chair3.position.set(-128,0,82);
        chair3.rotationQuaternion = null;
        chair3.rotation.z = 0;
        chair3.rotation.y = Math.PI * 0.67;
        chair3.rotation.x = -Math.PI / 2;


        function getMeshByName( name ){
            return scene.meshes.find( m => m.name === name );
        }

        this.chairMeshes = chairMeshes;
    }

    async setupAsyncTable(){
        const scene = this.scene;

        const table = await BABYLON.SceneLoader.ImportMeshAsync( '', '/', 'table.glb', scene );
        const tableMeshes = table.meshes;

        this.tableMeshes = tableMeshes;
    }

    async setupAsyncTableEvolution(){
        const scene = this.scene;
        const tablePath = this.paths.table;

        const [ tableMeshes ] = await this.importMeshAsync( this.paths.scenePathBabylon );
        const tableDiffuseTexture = await this.loadTextureAsync( joinWithSlash( tablePath, 'blackjack_table_mat_baseColor.65452.jpg' ) );
        const tableMaterial = scene.getMaterialByName( 'blackjack_table_mat' );

        const tableClothDiffuseTexture = await this.loadTextureAsync( this.paths.tableClothTexturePath );
        const tableClothMaterial = scene.getMaterialByName( 'blackjack_cloth_mat' );

        tableClothMaterial.diffuseTexture = tableClothDiffuseTexture;

        const tableMesh = scene.getMeshByName( 'table' );

        this.tableMesh = tableMesh;
        this.tableMeshes = tableMeshes;
        this.tableClothMaterial = tableClothMaterial;
        this.tableClothDiffuseTexture = tableClothDiffuseTexture;
    }

    async setupAsyncScene(){
        const scene = this.scene;

        const sceneTemplate = await BABYLON.SceneLoader.ImportMeshAsync( '', '/', 'scene.glb', scene );
        const sceneTemplateMeshes = sceneTemplate.meshes;

        this.sceneTemplateMeshes = sceneTemplateMeshes;
    }

    async setupAsyncCard(){

        const scene = this.scene;

        const card = await BABYLON.SceneLoader.ImportMeshAsync( '', '/', 'card.2mesh.glb', scene );
        const cardMeshes = card.meshes;

        // const scale = 10;
        //
        // cardMeshes.forEach( mesh => mesh.scaling.set( scale, scale, scale ) );

        this.cardMeshes = cardMeshes;
        // this.cardAtlasTexture = await this.loadTextureAsync( `/models/standard/card/cards.dd11b.jpg` );
        this.cardAtlasTexture = await this.loadTextureAsync( `/cards.atlas.png` );

    }

    async setupAsyncCardEvolution(){
        const [ cardMeshes ] = await this.importMeshAsync( this.paths.cardBabylonPath );
        this.cardMeshes = cardMeshes;
        this.cardAtlasTexture = await this.loadTextureAsync( this.paths.cardAtlasPath );
    }

    correctDefaultLight(){
        const scene = this.scene;
        const defaultLight = scene.getLightByID( "default light" );

        deepAssign( defaultLight, {
            direction: { x: Math.PI / 2 }
        } );

        this.defaultLight = defaultLight;
    }

}