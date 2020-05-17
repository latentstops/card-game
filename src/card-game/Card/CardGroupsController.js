export class CardGroupsController {
    constructor(root){
        this.root = root;
        this.card = root.card;
        this.origin = root.cardGroup;
        this.params = [
            {
                node: { position: { x: 0, y: 112, z: -30 } },
                children: [

                ]
            },
            {
                node: { position: {
                    "x": 71.32923872213651,
                    "z": 15.450849718747373,
                    "y": 112
                }},
                children: [

                ]
            },
            {
                node: { position: {
                    "x": 44.083893921935484,
                    "z": 40.45084971874737,
                    "y": 112
                }},
                children: [

                ]
            },
            {
                node: { position: {
                    "x": 0,
                    "z": 50,
                    "y": 112
                }},
                children: [

                ]
            },
            {
                node: { position: {
                    "x": -44.083893921935484,
                    "z": 40.45084971874737,
                    "y": 112
                }},
                children: [

                ]
            },
            {
                node: { position: {
                    "x": -71.32923872213651,
                    "z": 15.450849718747373,
                    "y": 112
                }},
                children: [

                ]
            },
            {
                node: { position: { x: 0, y: 112, z:  35 } },
                children: [

                ]
            }
        ];
        this.setupGroups();
    }

    setupGroups(){
        const params = this.params;
        const cardGroup = this.origin;
        const groups = [];
        params.forEach( param => {
            const group = cardGroup.clone();
            Object.assign( group.node, param.node );
            groups.push( group );
        } );
        this.groups = groups;
    }

    setCardsInGroup( card, pointNum ){
        const groups = this.groups;
        const group = groups[ pointNum ];

        group.add( card );
    }

    addNewCard(name,point){
        const card = this.card;
        const cardClone = card.clone();

        cardClone.setFaceTo(name);

        this.setCardsInGroup(cardClone, point);
    }
}