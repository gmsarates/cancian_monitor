var request = require('request');
const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const vgmUrl= 'https://www.fernandocancian.com/imovel/?tipo=casa&finalidade=locacao';

let last_text = null;

setInterval(() => {
    got(vgmUrl).then(response => {
        console.log(new Date());
        console.log('Consultando site...');
        const dom = new JSDOM(response.body);
        let result = dom.window.document.querySelector('.lista_imoveis_paginacao .fontepadrao_cor_grande').textContent;
        let num = result.match(/(\d+)/g);
        num = num[0];

        console.log(num, 'imóveis cadastrados');
        if (last_text == null || result !== last_text) {
            console.log('Enviando via Whatsapp');
            last_text = result;

            request.post(
                'http://62.72.8.127:3333/message/text?key=CANCIAN', { json: {
                        "id": "555191155222",
                        "message": `Número de imóveis no site FERNANDO CANCIAN alterado: *${num} imóveis*`
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
                        "message": `Número de imóveis no site FERNANDO CANCIAN alterado: *${num} imóveis*`
                    } 
                },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                }
            );
        }

        console.log('FIM', '');
    }).catch(err => {
      console.log(err);
    });
}, 60000);
