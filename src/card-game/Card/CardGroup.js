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
}