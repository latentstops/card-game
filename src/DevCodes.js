export class DevCodes {
    constructor(game) {
        this.parent = game;
    }

    playWithAnimations(){
        const game = cardGame;
        const scene = cardGame.scene;
        const tableMeshes = game.models.tableMeshes;
        const hasAnimations = mesh => Boolean(mesh.animations.length);
        const animatedMesh = tableMeshes.find( hasAnimations );
        const playAnimation = () => scene.beginAnimation( animatedMesh );
        let requestAnimationFrameId = null;
        const animate = () => {
            requestAnimationFrameId = requestAnimationFrame( animate );
            playAnimation();
        };
        const cancelAnimation = () => cancelAnimationFrame( requestAnimationFrameId );
        const animateAndCancelAfterMs = (ms = 1000) => ( animate(), setTimeout( cancelAnimation, ms ) );

        //animateAndCancelAfterMs();

        // const cardMeshNames = tableMeshes.map( mesh => mesh.name ).filter( name => name.toLowerCase().includes('card') );
        // const cardMeshes = tableMeshes.filter( mesh => cardMeshNames.includes(mesh.name) );
        // const visibleCardMeshes = cardMeshes.filter( m => m.isVisible );
        const cardFirstShoe = tableMeshes.find( m => m.name === 'card_firstshoe' );
        const card = cardFirstShoe;
    }

}