import {AsyncLoader} from "../AsyncLoader";

export class SpiderLabyrinthShooterGameModels extends AsyncLoader {

    constructor( root ){
        super( root );
        this.root = root;
        this.paths = root.paths;
        this.scene = root.scene;
    }

    async load(){
        /**
         * The Scene
         */
        await this.appendSceneAsync( this.paths.scene );
        // await this.setupRobotMeshes();

    }

    async setupRobotMeshes(){
        const [ robotMeshes ] = await this.importMeshAsync( this.paths.robotFileName );
        this.robotMeshes = robotMeshes;
    }

}
