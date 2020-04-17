export class GamepadController {
    constructor() {
        this.init();
        this.construct();
    }

    construct() {
        this.callbacks = [];
    }

    init() {
        this.initGamepadManager();
        this.connectGamepadManagerHandlers();
    }

    connectGamepadManagerHandlers() {
        const gamepadManager = this.gamepadManager;
        gamepadManager.onGamepadConnectedObservable.add( this.onGamepadConnected.bind(this) );
        gamepadManager.onGamepadDisconnectedObservable.add( this.onGamepadDisconnected.bind(this) );
    }

    onGamepadDisconnected (gamepad, state){
        console.log('Gamepad Disconnected');
        this.disconnectGamepadHandlers();
    };

    onGamepadConnected(gamepad, state){
        console.log('Gamepad Connected');
        this.gamepad = gamepad;
        this.gamepadState = state;
        this.connectGamepadHandlers();
    };
    disconnectGamepadHandlers(){
        const callbacks = this.callbacks;
        const attachedCallbacks = callbacks.filter(({connected}) => connected);
        attachedCallbacks.forEach(callback => {
            const {eventName, handler} = callback;
            this.delegateToGamepad(eventName, 'remove', handler);
            callback.connected = false;
        });
    }
    connectGamepadHandlers(){
        const callbacks = this.callbacks;
        const detachedCallbacks = callbacks.filter(({connected}) => !connected);
        detachedCallbacks.forEach( callback => {
            const {eventName, handler} = callback;
            this.delegateToGamepad(eventName, 'add', handler);
            callback.connected = true;
        });
    }

    onButtonUpObservable( callback ){
        this.delegateToGamepad('onButtonUpObservable', 'add', callback );
    }
    onButtonDownObservable( callback ){
        this.delegateToGamepad('onButtonDownObservable', 'add', callback );
    }

    delegateToGamepad(eventName, methodName, handler){
        const gamepad = this.gamepad;
        if(!gamepad){
            return this.callbacks.push({eventName, methodName, handler});
        }
        const observable = gamepad[eventName];
        observable[methodName].call(observable, handler);
    }

    initGamepadManager(){
        const gamepadManager = new BABYLON.GamepadManager();
        this.gamepadManager = gamepadManager;
    }
}