import { Game, RobotController } from './deps';
import { HouseGameModels } from './HouseGameModels';
import { joinWithSlash, setScalingFactorTo, assignPositionTo } from "../utils";

export class HouseGame extends Game {
    constructor( config ){
        super( config );
    }

    setup(){
        super.setup();
        this.setupRobotController();
        this.setupPaths();
        this.setupModels();
    }

    beforeLoad(){
        console.log( 'beforeLoad' );
    }

    async load(){
        await this.models.load();
        await this.robotController.load();
    }

    afterLoad(){
        const scene = this.scene;

        this.correctView();
        scene.enablePhysics();
    }

    correctView(){
        const scene = this.scene;
        const models = this.models;
        const robotController = this.robotController;
        const sceneMeshes = scene.meshes;
        const robotMeshes = robotController.robotMeshes;

        const sceneScalingFactor = 10;

        const robotScalingFactor = 0.33;
        const robotPosition = new BABYLON.Vector3( 0.19, 0, -0.35 );

        sceneMeshes && sceneMeshes.forEach( setScalingFactorTo( sceneScalingFactor ) );
        robotMeshes && robotMeshes.forEach( robotMesh => {
            setScalingFactorTo( robotScalingFactor )( robotMesh );
            assignPositionTo( robotPosition )( robotMesh );
        } );
    }

    setupModels(){
        this.models = new HouseGameModels( this );
    }

    setupPaths(){
        this.paths = {
            root: '',
            models: 'models/standard',
            sceneHouseFileName: 'scene-house.glb',
            robotFileName: 'dummy3.babylon',
            get scene(){
                return joinWithSlash( this.root, this.sceneHouseFileName );
            },

            get robot(){
                return joinWithSlash( this.root, this.robotFileName );
            }
        };
    }

    setupRobotController(){
        const robotController = new RobotController( this );
        this.robotController = robotController;
    }
}
