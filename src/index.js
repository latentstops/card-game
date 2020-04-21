import * as BABYLON from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer";
import '@babylonjs/loaders';
import "@babylonjs/inspector";
import 'pepjs';

import { CardGame } from "./CardGame";

window.BABYLON = BABYLON;
window.cardGame = new CardGame({canvas: 'canvas'});
cardGame.start().then( () =>{
    const card = cardGame.models.card;
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

    cards.forEach( (card, index) => card.setFaceTo(cardNameMap[index].name)  );

    const firstCard = cards[0];
    firstCard.cardFace.visibility = false;
    firstCard.cardFace.pickable = false;
    firstCard.cardBack.visibility = false;

    cardGroup.position.x = -42;
    cardGroup.position.y = 0;
    cardGroup.position.z = -15;

    cardGame.cards = cards;
    cardGame.cardGroup = cardGroup;

    randomize();
} );

function randomize(){
    const cards = cardGame.cards;
    let timeoutId = null;

    (function rnd(){
        const index = Math.floor( Math.random() * cardGame.cards.length );
        const card = cardGame.cards[index];
        card.playRotationIf();

        timeoutId = setTimeout(rnd, 1000);
    })();

    return () => clearTimeout( timeoutId );
}