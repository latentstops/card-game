import * as BABYLON from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/loaders';
import 'pepjs';

import { CardGame } from "./CardGame";

window.BABYLON = BABYLON;
window.cardGame = new CardGame({canvas: 'canvas'});
cardGame.start().then( () =>{
    return;
    const card = cardGame.card;
    const cardGroup = new BABYLON.TransformNode();

    const cardNameMap = card.atlas.cardNameMap;
    const cards = [ card ];

    for (let i = 0; i < 4; i ++ ){

        for (let j = 0 ; j < 13; j ++ ){

            const newCard = card.clone();

            newCard.position.x = j * 7;
            newCard.position.z = i * 10;

            cards.push( newCard );
            newCard.cardFace.parent = cardGroup;
        }
    }

    cards.forEach( (card, index) => {
        card.setFaceTo(cardNameMap[index].name);
        card.flip();
    }  );

    const firstCard = cards[0];
    firstCard.cardFace.visibility = false;
    firstCard.cardFace.pickable = false;
    firstCard.cardBack.visibility = false;

    cardGroup.position.x = -42;
    cardGroup.position.y = 95;
    cardGroup.position.z = -15;

    cardGame.cards = cards;
    cardGame.cardGroup = cardGroup;

    flipRandomCards();
} );

function flipRandomCards( interval ) {
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

    (function rnd(){
        const getRandomNumber =  max => Math.floor( Math.random() * max );
        const getRandomIndex = () => getRandomNumber( items.length );

        const index = getRandomIndex();

        const item = items[index];

        callback( item );

        timeoutId = setTimeout( rnd, interval );
    })();

    return () => clearTimeout( timeoutId );
}
