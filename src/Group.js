import * as BABYLON from "@babylonjs/core";
import { last } from "./utils";

export class Group {

    constructor(root, items = [], ChildClass){
        this.root = root;
        this.items = items;
        this.ChildClass = ChildClass;

        this.scene = root.scene;

        this.setupNode();
    }

    setupNode(){
        if(this.node) return;
        const node = new BABYLON.TransformNode(`GroupNode-${Date.now()}`);
        this.node = node;
    }

    clear(){
        const items = this.items;
        items.forEach( item => this.remove( item ) );
        items.length = 0;
    }

    removeLast(){
        const items = this.items;

        const lastItem = items.pop();

        if ( !lastItem ) return;

        this.remove( lastItem );

        return lastItem;
    }

    extractLast(){
        const items = this.items;
        const lastItem = items.pop();

        lastItem.mesh.parent = null;

        return lastItem;
    }

    remove( item ){
        const items = this.items;
        const scene = this.scene;
        const index = items.indexOf( item );

        // delete items[ index ];
        items.splice( index, 1 );

        scene.removeMesh( item.mesh );
        this.callChildAfterAddMethod();
    }

    add( item ){
        const node = this.node;
        const items = this.items;
        const step = this.step;

        if ( items.includes( item ) ) return console.warn( 'Already exists', item );

        const mesh = item.mesh;
        const lastItem = last( items );
        const thisIsFirstItem = !lastItem;

        mesh.parent = node;

        if ( thisIsFirstItem ) {
            items.push( item );
            this.callChildAfterAddMethod(item, lastItem);
            return;
        }

        this.callChildOnAddMethod( item, lastItem );

        items.push( item );

        this.callChildAfterAddMethod(item, lastItem);
    }

    callChildOnAddMethod( item, lastItem ){
        this.onAdd && 
        this.onAdd( item, lastItem );
    }

    callChildAfterAddMethod(item, lastItem){
        this.afterAdd &&
        this.afterAdd( item, lastItem );
    }

    clone(){
        const root = this.root;
        const ChildClass = this.ChildClass;

        const newGroup = new ChildClass( root, [] );

        return newGroup;

    }
}