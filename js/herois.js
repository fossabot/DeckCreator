const { ipcRenderer } = require('electron');
const html = require('./html/herois.js');
const dataClasse = require('../js/data/classe.js');
const dataManager = require('./data-manager.js');
const monta = require('./monta-heroi.js');
const cookie = require('./cookie-manager.js');

let linkFechar = document.querySelector("#link-fechar");
let recarregar;
let user;

document.querySelector('#accordion-pure-panel').innerHTML = '<button type="button" class="btn btn-outline btn-primary btn-lg btn-block">LOADING...</button>';
document.querySelector('#accordion-hybrid-panel').innerHTML = '<button type="button" class="btn btn-outline btn-primary btn-lg btn-block">LOADING...</button>';

cookie.login().then((retorno) => {
  if(retorno){
    getHerois(retorno.game);
  }
}).catch(err => console.log(err));

function getHerois(game){
  let classes = dataClasse.listAll(game);

  classes.then((retorno) => {
    let puros = dataManager.listByType('Pure', retorno);
    let hibridos = dataManager.listByType('Hybrid', retorno);

    puros.sort(dataManager.dynamicSort('name'));
    hibridos.sort(dataManager.dynamicSort('name'));

    render('pure', 2, puros, retorno);
    render('hybrid', 2, puros, retorno);
    buttonBuilder(retorno, puros, hibridos);

  }).catch(err => console.log(err));
}

linkFechar.addEventListener('click', function () {
  ipcRenderer.send('fechar-janela-herois');
});

function render(type, colunas, puros, lista){
  let retorno = html.build(type, colunas, puros, lista);
  document.querySelector('#accordion-'+type+'-panel').innerHTML = retorno;
  if (retorno.search("recarregar-herois") > 0){
    recarregar = document.querySelector("#recarregar-herois");
    recarregar.addEventListener('click', function () {
      render('pure', 2);
      render('hybrid', 2);
    });
  }
}

function buttonBuilder(lista, puros, hibridos){
  for(let i in puros){
    for(let h in puros[i].heroes){
      let heroi = puros[i].heroes[h];
      heroi = monta.heroi(heroi, dataManager, lista, puros[i].main, puros[i].sub);
      buttonSelecionar(dataManager.getNome(puros[i].name), heroi);
    }
  }
  for(let i in hibridos){
    for(let h in hibridos[i].heroes){
      let heroi = hibridos[i].heroes[h];

      heroi = monta.heroi(heroi, dataManager, lista, hibridos[i].main, hibridos[i].sub);
      buttonSelecionar(dataManager.getNome(hibridos[i].main)+'-'+dataManager.getNome(hibridos[i].sub), heroi, lista);
      if(dataManager.getNome(hibridos[i].sub) != '___'){
        buttonSelecionar(dataManager.getNome(hibridos[i].sub)+'-'+dataManager.getNome(hibridos[i].main), heroi, lista);
      }
    }
  }
}

function buttonSelecionar(param, heroi, lista){
  myURL = new URL(document.URL);
  document.querySelector('.selecionar-'+param+'-'+dataManager.getNome(heroi.cardnumber)).addEventListener('click', function () {
    ipcRenderer.send('heroi-selecionado', heroi, myURL.searchParams.get('posicao'));
    ipcRenderer.send('fechar-janela-herois');
  });
}
