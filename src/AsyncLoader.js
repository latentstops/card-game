export class AsyncLoader {

    constructor( root ){
        this.root = root;
        this.scene = root.scene;
        this.engine = root.engine;
    }

    async loadSceneAsync( path ){
        const engine = this.engine;

        return new Promise( res => {
            BABYLON.SceneLoader.Load( path, null, engine, res );
        } );
    }

    async appendSceneAsync( path ){
        const scene = this.scene;

        return new Promise( res =>
            BABYLON.SceneLoader.Append( path, null, scene, res )
        )
    }

    async loadTextureAsync( path ){
        const scene = this.scene;
        const texture = new BABYLON.Texture( path, scene );

        return new Promise( res =>
            texture.onLoadObservable.add( () => res( texture ) )
        );
    }

    async importMeshAsync( path ){
        const scene = this.scene;

        return new Promise( res =>
            BABYLON.SceneLoader.ImportMesh( '', '/', path, scene, ( ...args ) => res( [ ...args ] ) )
        );
    }

}
