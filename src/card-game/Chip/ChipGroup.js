import { Group } from '../deps';

export class ChipGroup extends Group {

    constructor( root ){
        super(root, [], ChipGroup);
        this.root = root;
        this.scene = root.scene;
        this.items = [];
        /**
         * TODO: There is a hardcoded value need to replace with value calculated with boundingBoxInfo.
         */
        this.step = 0.4;
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

}