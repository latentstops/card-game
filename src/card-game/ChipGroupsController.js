export class ChipGroupsController {

    setChipsInGroup( count, type, pointNum ){
        const chip = this.chip;
        const groups = this.groups;
        const chipTextures = this.chipTextures;
        const mesh = chip.mesh;
        const material = mesh.material;
        const defaultTexture = chipTextures[ 0 ];

        const typeMap = {
            1: chipTextures[0],
            5: chipTextures[1],
            25: chipTextures[2],
            100: chipTextures[3],
            500: chipTextures[4],
        };

        const group = groups[ pointNum ];

        const texture = typeMap[ type ] || defaultTexture;
        const materialClone = material.clone();
        texture.uScale = -1;
        materialClone.albedoTexture = texture;
        mesh.material = materialClone;

        group.setChips( count, chip );
    }

    constructor( root ){
        this.root = root;
        this.chip = root.chip;
        this.origin = root.chipGroup;
        this.chipTextures = root.models.chipTextures;

        this.params = [
            {
                position: { x: 0, y: 111.5, z: 0 }
            },
            {
                position: { x: -25.2, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            },{
                position: { x: -17.9, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            },{
                position: { x: -10.6, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            },{
                position: { x: -3.3, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            },{
                position: { x: 4, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            },{
                position: { x: 11.3, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            },{
                position: { x: 18.6, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            },{
                position: { x: 25.9, y: 118, z: -67.5, },
                rotation: { x: Math.PI / 1.88 }
            }
        ];
        this.setupGroups();
    }

    setupGroups(){
        const origin = this.origin;
        const params = this.params;
        const groups = [];

        params.forEach( param => {
            const group = origin.clone();
            const groupNode =group.node;
            Object.assign( groupNode.rotation, param.rotation );
            Object.assign( groupNode.position, param.position );
            groups.push( group );
        } );

        this.groups = groups;
    }

}