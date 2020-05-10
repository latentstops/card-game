export class Chip {
    constructor( mesh ){
        this.mesh = mesh;
    }

    clone(){
        const mesh = this.mesh;

        const newChip = new Chip( mesh.clone() );

        return newChip;

    }

}