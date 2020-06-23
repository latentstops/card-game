import { Group, last } from '../deps';

export class CardGroup extends Group {
    constructor( root ){
        super( root, [], CardGroup );
        this.step = 13;
    }
    detach( card ){
        super.detach( card );

        const cardMesh = card.cardFace;
        const cardParent = cardMesh.parent;

        if( !cardParent ) return;

        const cardParentPos = cardParent.position;
        const cardMeshPos = cardMesh.position;
        const actualPos = cardMeshPos.add( cardParentPos );

        cardMesh.parent = null;

        Object.assign( cardMeshPos, actualPos );
        
        this.updatePointDisplay();
    }

    onAdd(item, lastItem){
        this.lastItem = lastItem;

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
        const cards = this.items;
        const points = cards
            .map( ( { name } ) => Number( name.substr( 1, 2 ) ) || 10 )
            .reduce( ( a, b ) => a + b, 0 );

        return points;
    }

    updatePointDisplay(){
        const items = this.items;

        this.removePointMesh();
        if( !items.filter(Boolean).length) return;

        this.createPointDisplay();
        this.animatePointMesh();
    }

    animatePointMesh(){
        const pointsMesh = this.pointsMesh;
        const scene = this.scene;

        if( !pointsMesh ) return;
        const startPositionY = pointsMesh.position.y;

        const upDownAnimation = new BABYLON.Animation(
            "upDown",
            "position.y",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        upDownAnimation.setKeys( [
            {
                frame: 0,
                value: startPositionY
            },
            {
                frame: 30,
                value: startPositionY + 1
            },
            {
                frame: 150,
                value: startPositionY
            }
        ] );

        pointsMesh.animations = [ upDownAnimation ];
        scene.beginAnimation( pointsMesh, 0, 150, true );
    }

    createPointDisplay(){
        const num = `${ this.points }`;
        this.setPointDisplayNumber(num);
    }

    removePointMesh(){
        const scene = this.scene;
        const pointsMesh = this.pointsMesh;
        if(!pointsMesh) return;
        scene.removeMesh( pointsMesh );
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