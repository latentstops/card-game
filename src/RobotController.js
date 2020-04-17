import {GamepadController} from "./GamepadController";
import {Robot} from "./Robot";

export class RobotController {
    constructor(game) {
        this.parent = game;
        this.init();
    }

    init(){
        this.initRobot();
        this.initControls();
        this.connectToGamepad();
    }

    connectToGamepad(){
        const controls = this.controls;
        const robot = this.robot;

        controls.onButtonUpObservable( () => {
            robot.idle();
        } );

        controls.onButtonDownObservable((button, state) => {
            /*console.log(button);*/
            switch (button) {
                case 12:
                    robot.walk();
                    break;
                case 15:
                    robot.right();
                    break;
                case 14:
                    robot.left();
                    break;
                case 0:
                    robot.run();
                    break;
            }
        });
    }

    initControls(){
        const controls = new GamepadController();
        this.controls = controls;
    }

    initRobot(){
        const robot = new Robot(this.parent);
        this.robot = robot;
    }

}