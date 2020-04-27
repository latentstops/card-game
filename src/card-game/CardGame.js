import { Game } from "./deps";
import { CardGameModels } from "./CardGameModels";
import { Paths } from "./Paths";
import { Card } from "./Card";

export class CardGame extends Game {

    constructor( config ){
        super(config);
    }

    setup(){
        super.setup();
        this.setupGameModels();
        this.connectHandlers();
    }

    setupCard(){
        this.card = new Card( this );
    }

    setupGameModels(){
        this.paths = new Paths();
        this.models = new CardGameModels( this );
    };

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

            switch ( type ) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if ( !hit || pickedMeshIsGround ) return;

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

                    const current = getGroundPosition();

                    if ( !current ) return;

                    /**
                     * The most interesting part
                     * @type {Vector3}
                     */
                    const diff = current.subtract( startingPoint );

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
                    this.card.flip( pickInfo.pickedMesh );
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