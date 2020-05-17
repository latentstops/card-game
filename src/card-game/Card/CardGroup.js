import { Group } from '../deps';

export class CardGroup extends Group {
    constructor( root ){
        super( root, [], CardGroup );
    }
}