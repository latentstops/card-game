import { Vector3 } from "@babylonjs/core";
import { joinWithSlash, deepAssign } from "../utils";


export class CardGameModels {
    constructor( root ){
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
        const pufikMeshes = await this.loadAsyncMesh( `models/standard/pufik/pufik.glb` );

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

        const tableMeshes = await this.loadAsyncMesh( this.paths.scenePathBabylon );
        const tableDiffuseTexture = await this.loadAsyncTexture( joinWithSlash( tablePath, 'blackjack_table_mat_baseColor.65452.jpg' ) );
        const tableMaterial = scene.getMaterialByName( 'blackjack_table_mat' );

        const tableClothDiffuseTexture = await this.loadAsyncTexture( this.paths.tableClothTexturePath );
        const tableClothMaterial = scene.getMaterialByName( 'blackjack_cloth_mat' );

        tableClothMaterial.diffuseTexture = tableClothDiffuseTexture;

        const tableMesh = scene.getMeshByName( 'table' );

        this.tableMesh = tableMesh;
        this.tableMeshes = tableMeshes;
        this.tableClothMaterial = tableClothMaterial;
        this.tableClothDiffuseTexture = tableClothDiffuseTexture;
    }

    async setupAsyncCard(){
        this.cardMeshes = await this.loadAsyncMesh( this.paths.cardBabylonPath );
        this.cardAtlasTexture = await this.loadAsyncTexture( this.paths.cardAtlasPath );
    }

    correctDefaultLight(){
        const scene = this.scene;
        const defaultLight = scene.getLightByID( "default light" );

        deepAssign( defaultLight, {
            direction: { x: Math.PI / 2 }
        } );

        this.defaultLight = defaultLight;
    }

    async loadAsyncTexture( path ){
        const scene = this.scene;
        const texture = new BABYLON.Texture( path, scene );

        return new Promise( res =>
            texture.onLoadObservable.add( () => res( texture ) )
        );
    }

    async loadAsyncMesh( path ){
        const scene = this.scene;

        return new Promise( res =>
            BABYLON.SceneLoader.ImportMesh( '', '/', path, scene, res )
        );
    }

}