import { Group } from '../deps';

export class CardGroup extends Group {
    constructor( root ){
        super( root, [], CardGroup );
        this.step = 13;
    }
    onAdd(item, lastItem){
        const step = this.step;
        const lastItemMesh = lastItem.mesh;
        const lastItemMeshPosition = lastItemMesh.position;
        const meshPosition = item.mesh.position;
        const meshRotation = item.mesh.rotation;

        meshPosition.x = lastItemMeshPosition.x - 3;
        meshPosition.z = lastItemMeshPosition.z - 3;
        meshPosition.y = lastItemMeshPosition.y + 0.3;
        // meshRotation.z = Math.random();
    }

    afterAdd(){
        this.updatePointDisplay();
    }
    get points(){
        const items = this.items;
        const points = items
            .map( ( { name } ) => Number( name.substr( 1, 2 ) ) || 10 )
            .reduce( ( a, b ) => a + b );

        return points;
    }

    updatePointDisplay(){
        this.removePointMesh();
        this.createPointDisplay();
    }

    removePointMesh(){
        const scene = this.scene;
        const pointMesh = this.pointsMesh;
        if(!pointMesh) return;
        scene.removeMesh( pointMesh );
    }

    createPointDisplay(){
        const num = `${ this.points }`;
        this.setPointDisplayNumber(num);
    }

    setPointDisplayNumber(num){
        const scene = this.scene;
        const node = this.node;

        const font = "bold 120px Arial";

        const pointTexture = new BABYLON.DynamicTexture( "dynamic texture", { width: 150, height: 150 }, scene );
        const plane = BABYLON.MeshBuilder.CreatePlane( "plane", { height: 1, width: 1 }, scene );
        const stdMaterial = new BABYLON.StandardMaterial();

        pointTexture.drawText( num, 0, 100, font, "green", "white", true, true );
        stdMaterial.diffuseTexture = pointTexture;

        plane.material = stdMaterial;
        Object.assign( plane.position, { x: node.position.x, z: node.position.z - 15, y: 120 } );
        plane.scaling.set( 5, 5, 5 );
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        this.pointsMesh = plane;
    }
}