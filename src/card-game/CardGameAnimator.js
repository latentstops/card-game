export class CardGameAnimator {
    constructor( root ){
        this.root = root;
        this.scene = root.scene;
        this.cardGroupsController = root.cardGroupsController;
    }

    animateCardsCollection(){
        this.setupCards();

        if( this.prevPositions ){
            this.resetPositions();
        }

        this.setupCardsPositions();

        this.prevPositions = this.cardsPositions.map( pos => Object.assign({}, pos) );

        this.startAnimateCardsCollection();
    }

    startAnimateCardsCollection(){
        const scene = this.scene;
        const cards = this.cards;

        startAnimateCardsCollection();

        function startAnimateCardsCollection(){

            if ( !cards.length ) return;

            animateRandomCard();

            setTimeout( startAnimateCardsCollection, Math.random() * 25 + 25 );
        }

        function animateRandomCard(){
            const randomCard = extractRandomItem( cards );

            scene.beginAnimation( randomCard, 0, 100, true );
        }

        function extractRandomItem( items = [] ){
            const randomIndex = Math.round( Math.random() * items.length - 1 );
            const [ item ] = items.splice( randomIndex, 1 );

            return item;
        }
    }

    setupCardsPositions(){
        const cards = this.cards;
        const cardsPositions = cards.map( card => card.position );

        this.cardsPositions = cardsPositions;
    }

    setupCards(){
        const cardGroupsController = this.cardGroupsController;
        const cards = [];

        cardGroupsController.groups.forEach( group => {

            const groupItems = group.items;

            groupItems.forEach( card => {
                const cardMesh = card.cardFace;

                group.detach( card );
                cards.push( cardMesh );
                setupCardCollectAnimation( cardMesh );
            } );

        } );

        this.cards = cards;
        this.prevCards = [...cards];

        function setupCardCollectAnimation( cardMesh ){
            const anim = new BABYLON.Animation(
                "collect",
                "position",
                60,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );

            const startPosition = cardMesh.position;

            anim.setKeys( [
                {
                    frame: 0,
                    value: startPosition
                },
                {
                    frame: 15,
                    value: new BABYLON.Vector3( 0, 113, 0 )
                }
            ] );

            var easingFunction = new BABYLON.QuadraticEase()

            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

            anim.setEasingFunction(easingFunction);

            cardMesh.animations = [ anim ];

            return cardMesh;
        }
    }

    resetPositions(){
        const prevPositions = this.prevPositions;
        const cards = this.prevCards;

        cards.forEach( (card,i) => Object.assign(card.position,prevPositions) );
    }
}