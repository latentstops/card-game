import * as BABYLON from "@babylonjs/core";
import { last } from './deps';
export class ChipGroup {

    constructor( root ){
        this.root = root;
        this.scene = root.scene;
        this.chips = [];
        this.setupNode();
    }

    setupNode(){
        if(this.node) return;
        const node = new BABYLON.TransformNode("ChipGroupNode");
        this.node = node;
    }


    setChips( count, chip ){
        this.clear();
        this.addMany( count, chip );
    }

    addMany( count, chip ){
        if( !chip ) return console.warn('No chip provided');

        Array(count).fill().forEach( () => {
            const newChip = chip.clone();

            this.add( newChip );
        } );
    }

    extractLast(){
        const items = this.chips;
        const lastItem = items.pop();

        lastItem.mesh.parent = null;

        return lastItem;
    }

    clear(){
        const chips = this.chips;
        chips.forEach( item => this.remove( item ) );
        chips.length = 0;
    }

    removeLast() {
        const scene = this.scene;
        const items = this.chips;

        const lastItem = items.pop();

        if(!lastItem) return;

        this.remove( lastItem );

        return lastItem;
    }

    remove( chip ){
        const chips = this.chips;
        const scene = this.scene;
        const index = chips.indexOf( chip );

        delete chips[ index ];

        scene.removeMesh( chip.mesh );
    }

    add( chip ){
        const node = this.node;
        const items = this.chips;

        if( items.includes( chip ) ) return console.warn('Already exists');

        const mesh = chip.mesh;
        const lastItem = last( items );
        const thisIsFirstChip = !lastItem;

        mesh.parent = node;

        if( thisIsFirstChip ) return items.push( chip );

        const lastItemMesh = lastItem.mesh;
        const lastItemMeshPosition = lastItemMesh.position;
        const meshPosition = mesh.position;
        /**
         * TODO: There is a hardcoded value need to replace with value calculated with boundingBoxInfo.
         */
        meshPosition.y = lastItemMeshPosition.y + 0.4;

        return items.push( chip );
    }

    clone(){
        const root = this.root;
        const node = this.node;

        const nodeClone = node.clone();
        const newGroup = new ChipGroup( root, nodeClone );

        return newGroup;

    }

}