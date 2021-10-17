import { Game } from "./deps";
import { CardGameModels } from "./CardGameModels";
import { Paths } from "./Paths";
import { Card, CardGroup, CardGroupsController } from "./Card";
import { Chip, ChipGroup, ChipGroupsController } from "./Chip";
import { CardGameAnimator } from "./CardGameAnimator";

export class CardGame extends Game {

    constructor( config ){
        super(config);
        // this.scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        this.chipGroups = [];
        this.cardGroups = [];
    }

    setup(){
        super.setup();
        this.setupGameModels();
        this.connectHandlers();
    }

    setupCardGameAnimator(){
        this.animator = new CardGameAnimator( this );
    }

    setupCardGroupsController(){
        this.cardGroupsController = new CardGroupsController( this );
    }

    setupCardGroup(){
        this.cardGroup = new CardGroup( this );
    }

    setupChipGroup(){
        this.chipGroup = new ChipGroup( this );
    }

    setupChip(){
        const chipMesh = this.models.chipMeshes[ 1 ];
        this.chip = new Chip( chipMesh );
    }

    setupCard(){
        this.card = new Card( this );
    }

    setupGameModels(){
        this.paths = new Paths();
        this.models = new CardGameModels( this );
    };

    setupChipGroupsController(){
        this.chipGroupsController = new ChipGroupsController( this );
    }

    setChipsInGroup( count, type, pointNum ){
        const chipGroupsController = this.chipGroupsController;
        chipGroupsController.setChipsInGroup.apply( chipGroupsController, arguments );
    }

    /**
     * Abstract Method
     * @returns {Promise<void>}
     */
    async load(){
        const models = this.models;
        await models.load();
    }

    /**
     * Abstract method
     */
    afterLoad(){
        this.setupCard();
        this.setupChip();
        this.setupChipGroup();
        this.setupChipGroupsController();
        this.setupCardGroup();
        this.setupCardGroupsController();
        this.setupCardGameAnimator();
    }

    connectHandlers(){
        this.resizeEngineOnWindowResize();
        this.pickCardOnPointerEvents();
    }

    pickCardOnPointerEvents(){

        const scene = this.scene;

        let startingPoint = null;

        scene.onPointerObservable.add( ( { event, pickInfo, type } ) => {
            const card = this.card;
            const ground = this.models.ground;

            const rightClick = event.which === 3;
            const hit = pickInfo.hit;
            const pickedMeshIsGround = pickInfo.pickedMesh === ground;
            const pickedMeshIsNotCard = !pickInfo.pickedMesh?.id?.includes('card');
            const current = getGroundPosition();

            switch ( type ) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if ( !hit || pickedMeshIsGround || pickedMeshIsNotCard ) return;

                    if ( rightClick ) {
                        card.flip( pickInfo.pickedMesh );
                        this.deActivateCameraControls();
                        return;
                    }

                    startingPoint = getGroundPosition();

                    if ( startingPoint ) {
                        this.deActivateCameraControls();
                        this.pickedMesh = pickInfo.pickedMesh;
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    this.activateCameraControls();

                    if ( startingPoint ) {
                        this.pickedMesh = null;
                        startingPoint = null;
                        return;
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if ( !startingPoint ) return;

                    if ( !current ) return;

                    /**
                     * The most interesting part
                     * @type {Vector3}
                     */
                    let diff = current.subtract( startingPoint );
                    diff = diff.multiply( new BABYLON.Vector3(0.7,1,0.7) );

                    this.pickedMesh.position.addInPlace( diff );

                    startingPoint = current;

                    break;
                case BABYLON.PointerEventTypes.POINTERWHEEL:
                    // console.log("POINTER WHEEL");
                    break;
                case BABYLON.PointerEventTypes.POINTERPICK:
                    // console.log("POINTER PICK");
                    break;
                case BABYLON.PointerEventTypes.POINTERTAP:
                    // console.log("POINTER TAP");
                    break;
                case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                    // console.log("POINTER DOUNBLE TAP");
                    // this.card.flip( pickInfo.pickedMesh );
                    const actual = current.multiply( new BABYLON.Vector3(0.7,1,0.7) );
                    this.animator.animateCardsCollection(actual);
                    break;
            }
        } );

        const getGroundPosition = () => {
            const ground = this.models.ground;
            const pickInfo = scene.pick( scene.pointerX, scene.pointerY, mesh => mesh === ground );

            if ( pickInfo.hit ) {
                return pickInfo.pickedPoint;
            }

            return null;
        }
    }
}