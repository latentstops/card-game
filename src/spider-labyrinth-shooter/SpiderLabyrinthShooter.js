import {Game} from "../Game";
import {joinWithSlash} from "../utils";

export class SpiderLabyrinthShooter extends Game {

    constructor(config) {
        super(config);
        this.setupPaths();
    }

    async load(){
        await this.setupSpider();
        return this.setupAsyncLabyrinth();
    }

    afterLoad(){
        console.log(this.camera);
        const labyrinthMesh = this.labyrinthMeshes[0];
        const spiderMesh = this.spiderMeshes[0];

        labyrinthMesh.scaling.set( .051,.051,-.051);
        spiderMesh.scaling.set( .002,.002,-.002);
        spiderMesh.position.set(-.02,0,0);
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

    async setupAsyncLabyrinth(){
        const scene = this.scene;

        const labyrinth = await BABYLON.SceneLoader.ImportMeshAsync( '', 'spider-labyrinth-shooter/', 'labyrinth.gltf', scene );
        const labyrinthMeshes = labyrinth.meshes;
        this.labyrinthMeshes = labyrinthMeshes;
    }

    async setupSpider(){
        const scene = this.scene;

        const spider = await BABYLON.SceneLoader.ImportMeshAsync( '', 'spider-labyrinth-shooter/', 'spider4.glb', scene );
        const spiderMeshes = spider.meshes;
        this.spiderMeshes = spiderMeshes;
    }

}
