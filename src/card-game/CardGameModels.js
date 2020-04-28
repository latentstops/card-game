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
        await this.setupAsyncCard();
        await this.setupAsyncTable();
        await this.setupAsyncPufik();
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

    async setupAsyncTable(){
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

    async setupAsyncCard(){
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