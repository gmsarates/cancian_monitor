var request = require('request');
const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const vgmUrl= 'https://www.fernandocancian.com/imovel/?tipo=casa&finalidade=locacao';

let last_text = null;

setTimeout(() => {
    got(vgmUrl).then(response => {
      const dom = new JSDOM(response.body);
      let result = dom.window.document.querySelector('.lista_imoveis_paginacao .fontepadrao_cor_grande').textContent;
      let num = result.match(/(\d+)/g);
      num = num[0];

      if (last_text == null || result !== last_text) {
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
    }).catch(err => {
      console.log(err);
    });
}, 60000);
