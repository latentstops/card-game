export class CardGameModels {
    constructor(game) {
        this.parent = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.engine = game.engine;
        this.load();
    }

    load(){
        this.loadTable();
        // this.loadCards();
    }

    loadTable(){
        const scene = this.scene;
        BABYLON.SceneLoader.ImportMesh('','/', 'models/standard/table/blackjack_table.incremental.449b4.babylon', scene, (tableMeshes) => {
            this.tableMeshes = tableMeshes;
        });
    }

    loadCards(){
        const scene = this.scene;
        BABYLON.SceneLoader.ImportMesh('','/', 'models/standard/card/card.88687.babylon', scene, (cardMeshes) => {
            this.cardMeshes = cardMeshes;
        });
    }

}