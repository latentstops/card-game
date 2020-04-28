import { GamepadController } from "../GamepadController";
import { Robot } from "./Robot";
import { assignPositionTo } from "../utils";

export class RobotController {
    constructor( game ){
        this.parent = game;
        this.init();
    }

    async load(){
        await this.robot.load();
        this.connectToGamepad();
        this.robotMeshes = this.robot.meshes;
    }

    init(){
        this.initRobot();
        this.initControls();
    }

    connectToGamepad(){
        const controls = this.controls;
        const robot = this.robot;

        controls.onButtonUpObservable( () => {
            robot.idle();
        } );

        controls.onButtonDownObservable( ( button, state ) => {
            console.log( button );
            switch ( button ) {
                case 12:
                    robot.walk();
                    robot.meshes[ 0 ].position.z += 0.01;
                    break;
                case 15:
                    robot.right();
                    robot.meshes[ 0 ].position.x += 0.01;
                    break;
                case 14:
                    robot.left();
                    robot.meshes[ 0 ].position.x -= 0.01;
                    break;
                case 0:
                    robot.run();
                    break;
            }
        } );
    }

    initControls(){
        this.initGamepadController();
        this.initKeyboardController();
    }

    initKeyboardController(){
        const robot = this.robot;
        let timeoutId = null;

        window.addEventListener( 'keydown', e => {
            console.log( e );
            const button = e.which;
            switch ( button ) {
                case 83:
                    robot.walk();
                    robot.meshes[ 0 ].position.z -= 0.01;
                    break;
                case 87:
                    robot.walk();
                    robot.meshes[ 0 ].position.z += 0.01;
                    break;
                case 68:
                    robot.right();
                    robot.meshes[ 0 ].position.x += 0.01;
                    break;
                case 65:
                    robot.left();
                    robot.meshes[ 0 ].position.x -= 0.01;
                    break;
                case 0:
                    robot.run();
                    break;
            }
        } );

        window.addEventListener( 'keyup', e => {
            robot.idle();
        } );
    }

    initGamepadController(){
        const controls = new GamepadController();
        this.controls = controls;
    }

    initRobot(){
        const robot = new Robot( this.parent );
        this.robot = robot;
    }

}