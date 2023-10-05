var request = require('request');
const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const cancian = 'https://www.fernandocancian.com/imovel/?tipo=casa&finalidade=locacao';
const rede = 'https://www.redeimobiliarias.com/aluguel/casas/';

let last_text = null;

function notify(message) {
    console.log('Enviando via Whatsapp');

    request.post(
        'http://62.72.8.127:3333/message/text?key=CANCIAN', { json: {
                "id": "555191155222",
                "message": message
            } 
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    );

    request.post(
        'http://62.72.8.127:3333/message/text?key=CANCIAN', { json: {
                "id": "555597157763",
                "message": message
            } 
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    );
}

setInterval(() => {
    console.log(new Date());
    console.log('Consultando site FERNANDO CANCIAN...');
    got(cancian).then(response => {
        const dom = new JSDOM(response.body);
        let result = dom.window.document.querySelector('.lista_imoveis_paginacao .fontepadrao_cor_grande').textContent;
        let num = result.match(/(\d+)/g);
        num = num[0];

        console.log(num, 'imóveis cadastrados');
        if (last_text == null || result !== last_text) {
            last_text = result;
            notify(`Número de imóveis no site FERNANDO CANCIAN alterado: *${num} imóveis*`);
        }

        console.log('FIM CANCIAN', '');
    }).catch(err => {
        console.log(err);
    });

    console.log('Consultando site REDE...');
    got(rede).then(response => {
        const dom = new JSDOM(response.body);
        let result = dom.window.document.querySelector('#content .container-fluid .breadcrumb li:nth-child(1)').textContent;
        let num = result.match(/(\d+)/g);
        num = num[2];

        console.log(num, 'imóveis cadastrados');
        if (last_text == null || result !== last_text) {
            last_text = result;
            notify(`Número de imóveis no site REDE alterado: *${num} imóveis*`);
        }

        console.log('FIM REDE', '');
    }).catch(err => {
        console.log(err);
    });
}, 60000);
