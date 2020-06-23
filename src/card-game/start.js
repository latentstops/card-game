import * as BABYLON from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/loaders';
import 'pepjs';

import { utils } from './deps';
import { CardGame } from "./CardGame";

Object.assign( window, utils );

window.BABYLON = BABYLON;
window.cardGame = new CardGame( { canvas: 'canvas' } );

cardGame.start().then( () => {
    const calod = [
        "g2","g3","g4","g5","g6","g7","g8","g9","g10","gj","gq","gk","ga",
        "x2","x3","x4","x5","x6","x7","x8","x9","x10","xj","xq","xk","xa",
        "q2","q3","q4","q5","q6","q7","q8","q9","q10","qj","qq","qk","qa",
        "s2","s3","s4","s5","s6","s7","s8","s9","s10","sj","sq","sk","sa",
    ];
    const getRandomCardName = () => calod[ Math.round( Math.random() * calod.length - 1  ) ];
    // chips
    var chipTypes = [ 1,5,25,100,500 ];

    Array(8).fill().map( (_, index) => {
        const count = Math.round( Math.random() * 50 );
        const type = chipTypes[ Math.round( Math.random() * chipTypes.length - 1) ];
        const pointNum = index + 1;

        cardGame.chipGroupsController.setChipsInGroup(
            count,
            type,
            pointNum
        )
    });

    var chipGroups = cardGame.chipGroupsController.groups;

    chipGroups.forEach( group => {
        group.items.forEach( chip => {
            chip.mesh.rotationQuaternion = null;
            chip.mesh.rotation.x = -Math.PI / 2;
        } );
    } );

    // Cards
    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 0 );
    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 0 );

    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 1 );
    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 1 );

    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 2 );
    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 2 );

    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 3 );
    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 3 );

    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 4 );
    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 4 );

    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 5 );
    cardGame.cardGroupsController.addNewCard( getRandomCardName(), 5 );

    return;
    const card = cardGame.card;
    if(!card) return;

    const cardGroup = new BABYLON.TransformNode();

    const cards = [];

    for ( let i = 0; i < 4; i++ ) {

        for ( let j = 0; j < 13; j++ ) {

            const newCard = card.clone();

            newCard.position.x = j * 15;
            newCard.position.z = i * 18;

            cards.push( newCard );
            newCard.cardFace.parent = cardGroup;
        }
    }

    cards.forEach( ( card, index ) => {
        const name = calod[ index ];
        card.setFaceTo( name );
        card.flip();
    } );

    cardGame.models.ground.parent = cardGroup;

    // const firstCard = cards[ 0 ];
    // firstCard.cardFace.visibility = false;
    // firstCard.cardFace.pickable = false;
    // firstCard.cardBack.visibility = false;

    const scale = 0.8;
    cardGroup.scaling.set(scale,scale,scale);
    cardGroup.position.x = -72;
    cardGroup.position.y = 113;
    cardGroup.position.z = -20;

    cardGame.cards = cards;
    cardGame.cardGroup = cardGroup;

    cardGame.cancelAnim = flipRandom();
    // cardGame.cancelAnim = flipWave();
} );

function flipWave( interval = 80 ){
    const cardsMatrix = getCardsMatrix();
    const rowLength = cardsMatrix[ 0 ].length;

    const colLength = cardsMatrix.length;

    let start = 0;
    let timeoutId = null;

    wave();

    return () => clearTimeout( timeoutId );

    function wave(){
        const cards = getCardsColumn( start );

        cards.forEach( card => card.flip() );

        start++;

        if ( start === rowLength ) start = 0;

        timeoutId = setTimeout( wave, interval );
    }

    function getCardsColumn( col ){
        return Array( colLength ).fill().map( ( num, row ) => cardsMatrix[ row ][ col ] );
    }

    function getCardsMatrix(){
        const cards = cardGame.cards;
        const cardsClone = Array.apply( null, cards );
        const cardsMatrix = [];

        while ( cardsClone.length ) {
            const cards13 = cardsClone.splice( 0, 13 );
            cardsMatrix.push( cards13 );
        }
        return cardsMatrix;
    }
}

function flipRandom( interval ){
    let lastCard = null;

    const flip = card => {
        lastCard && lastCard.flip();
        card.flip();
        lastCard = card;
    };

    const cancel = getRandomElementWithInterval( cardGame.cards, flip, interval );

    return cancel;
}

function getRandomElementWithInterval( items, callback, interval = 1000 ){
    let timeoutId = null;

    ( function rnd(){
        const getRandomNumber = max => Math.floor( Math.random() * max );
        const getRandomIndex = () => getRandomNumber( items.length );

        const index = getRandomIndex();

        const item = items[ index ];

        callback( item );

        timeoutId = setTimeout( rnd, interval );
    } )();

    return () => clearTimeout( timeoutId );
}