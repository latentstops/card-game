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
    // const cards = Array(52).fill().reduce( (acc, item, index) => {
    //     const lastCard = acc[acc.length - 1];
    //     const newCard = lastCard.clone();
    //
    //     newCard.position.z = -Math.floor(index / 13) * 10;
    //     newCard.position.x = Math.floor(index / 13) * 7;
    //
    //     acc.push( newCard );
    //     return acc;
    // }, [ card ] );
    cards.forEach( (card, index) => card.setFaceTo(cardNameMap[index].name)  );
    // cardNameMap.forEach( ({name}, index) => cards[index].setFaceTo(name)  );
    cards[0].cardFace.visibility = false;
    cards[0].cardBack.visibility = false;
    cards[0].cardFace.pickable = false;
    cardGame.cards = cards;
    cardGame.cardGroup = cardGroup;
    cardGame.cardGroup.position.x = -42;
    cardGame.cardGroup.position.y = 0;
    cardGame.cardGroup.position.z = -15;
} );