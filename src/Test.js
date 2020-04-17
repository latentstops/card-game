export class Test {
    constructor(game) {
        this.parent = game;
        this.scene = game.scene;
        this.engine = game.engine;
        this.init();
    }

    init(){
        this.load();
    }

    load(){
        const scene = this.scene;
        const engine = this.engine;
        // This is really important to tell Babylon.js to use decomposeLerp and matrix interpolation
        BABYLON.Animation.AllowMatricesInterpolation = true;



        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.6;
        light.specular = BABYLON.Color3.Black();

        // var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
        // light2.position = new BABYLON.Vector3(0, 5, 5);
        // engine.displayLoadingUI();

        BABYLON.SceneLoader.ImportMesh(
            "",
            "",
            "test.babylon",
            scene,
            (newMeshes, particleSystems, skeletons) => {
                var skeleton = skeletons[0];
                this.skeleton = skeleton;
                window.meshes = newMeshes;
                engine.hideLoadingUI();
            });
    }
}