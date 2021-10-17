const api = (( baseUrl) => {
    const createKeyPair = async () => request(  'createKeyPair' );
    const createMessage = async data => request(  'createMessage', data);
    const getPrivateMessage = async data => request( 'getPrivateMessage', data);
    const getMessages = async data => request( 'getMessages', data );

    return {
        createKeyPair,
        createMessage,
        getPrivateMessage
    }

    async function request( path, data ){
        const url = `${ baseUrl }/${ path }`;
        const res = await fetch( url, {
            headers: { 'content-type': 'application/json' },
            method: data ? 'post' : 'get',
            body: JSON.stringify( data )
        });

        return res.clone().json().catch( () => res.text() );
    }
})( '' );



const apiController = (( api) => {

    const createMessage = async ({ receiverPublicKey, privateMessage, publicMessage }) => {
        const { privateKey: senderPrivateKey } = await getKeys();
        return api.createMessage({ senderPrivateKey, receiverPublicKey, privateMessage, publicMessage });
    };

    const getPrivateMessage = async ({ senderPublicKey, publicMessage }) => {
        const { privateKey: receiverPrivateKey } = await getKeys();
        return api.getPrivateMessage({ senderPublicKey, receiverPrivateKey, publicMessage });
    }

    return {
        getKeys,
        createMessage,
        getPrivateMessage
    };

    async function getKeys() {
        const { keys } = localStorage;
        if( keys ){
            return JSON.parse( keys );
        } else {
            const keys = await api.createKeyPair();
            localStorage.keys = JSON.stringify( keys );
            return keys;
        }
    }
})( api );


const view = (() => {
    const selectors = {
        encryptPublicMessage:     "#mesemes .encrypt .publicMessage",
        encryptPrivateMessage:    "#mesemes .encrypt .privateMessage",
        encryptReceiverPublicKey: "#mesemes .encrypt .receiverPublicKey",
        encryptResult:            "#mesemes .encrypt .result",
        decryptPublicMessage:     "#mesemes .decrypt .publicMessage",
        decryptPrivateMessage:    "#mesemes .decrypt .privateMessage",
        decryptSenderPublicKey:   "#mesemes .decrypt .senderPublicKey",
        encryptButton:            "#mesemes .encrypt .button",
        decryptButton:            "#mesemes .decrypt .button",

        reset:                    "#mesemes .reset",
        downloadKeys:             "#mesemes .downloadKeys",
        uploadKeys:               "#mesemes .uploadKeys",
        upload:                   "#mesemes .upload",
        publicKey:                "#mesemes .publicKey",
        messages:                 "#mesemes .messages",
        encrypt:                  "#mesemes .encrypt",
        decrypt:                  "#mesemes .decrypt",

        base:                     "#mesemes"
    };

    const elements = Object.entries( selectors ).reduce(( acc, [ key, selector]) => {
        acc[ key ] = document.querySelector( selector ) || document.createElement('noop');
        return acc;
    }, {});

    return {
        elements,
        selectors
    };

})();

const controller = (( api, view ) => {

    const { elements } = view;

    elements.decryptButton.addEventListener('click', () => {
        const publicMessage = elements.decryptPublicMessage.value;
        const senderPublicKey = elements.decryptSenderPublicKey.value;

        api.getPrivateMessage({ senderPublicKey, publicMessage }).then( (res) => {
            const { privateMessage, error } = res;
            elements.decryptPrivateMessage.innerHTML = '';

            const textNode = document.createTextNode( error || privateMessage );
            elements.decryptPrivateMessage.append( textNode );
        } );
    });

    elements.encryptButton.addEventListener('click', () => {
        const publicMessage = elements.encryptPublicMessage.value;
        const privateMessage = elements.encryptPrivateMessage.value;
        const receiverPublicKey = elements.encryptReceiverPublicKey.value;

        api.createMessage({ receiverPublicKey, privateMessage, publicMessage }).then( (res) => {
            const message = res?.error?.message || 'Success';
            const messageNode = document.createTextNode( message );

            elements.encryptResult.append( messageNode );

            setTimeout(() => {
                elements.encryptResult.innerHTML = '';
            }, 2000 );
        } );
    });

    getKeysAndShow();

    elements.reset.addEventListener('dblclick', () => {
        confirm( 'Your keys will be deleted and you can never restore them. Are you sure?' );
        delete localStorage.keys;
        getKeysAndShow();
    });

    elements.downloadKeys.addEventListener( 'click', () => {
        api.getKeys().then( keys => {
            const a = document.createElement('a');
            a.download = 'keys.txt';
            a.href = `data:,${btoa(JSON.stringify(keys))}`
            document.body.appendChild(a);
            a.click();
            a.remove();
        } )
    } );

    elements.upload.addEventListener('click', e => {
        const file = elements.uploadKeys.files[0];
        file.text()
            .then( atob )
            .then( keys => localStorage.keys = keys )
            .then( getKeysAndShow )
            .then( () => alert('success') )
            .catch( () => alert('error') )
        ;
    });

    return {};

    function getKeysAndShow() {
        api.getKeys().then(keys => {
            elements.publicKey.value = keys.publicKey;
        });
    }

})( apiController, view );