const { ipcRenderer, remote }  = require('electron');
const dialog = remote.dialog;
const data = require('./data.js');
const panel = require('./panel-cards.js');
const html = require('./html-builder.js');
const deck = require('./deck-builder.js');
const conta = require('./conta.js');
const file = require('./file-manager.js');

let listaDeCartas = [];
let herois = [];
let buttons = [];
let nomeDoTime = 'NovoDeck';

ipcRenderer.send('get-cookies');

ipcRenderer.on('send-cookies', (event, cookies) => {
  cookiesHeroi = filtraCookies(cookies, 'heroi');
  for (let i in cookiesHeroi){
    let json = JSON.parse(cookiesHeroi[i].value);
    json.panel = cookiesHeroi[i].name.replace('heroi','');
    herois.push(json);
  }

  for(let i in herois){
    renderPanel(herois[i]);
    buttons.push(herois[i]);
  }

  buttons.push({class: 'Spell', type: 'Spell', main: 'Spell', sub: 'Spell'});
  buttons.push({class: 'Enchantment', type: 'Enchantment', main: 'Enchantment', sub: 'Enchantment'});
  buttons.push({class: 'Talent', type: 'Talent', main: 'Talent', sub: 'Talent'});
  renderSidebar(buttons);

  cookiesCards = filtraCookies(cookies, 'cards');
  if(cookiesCards[0]){
    listaDeCartas = JSON.parse(cookiesCards[0].value);
  }

  cookiesNome = filtraCookies(cookies, 'nome');
  if(cookiesNome[0]){
    nomeDoTime = cookiesNome[0].value;
    document.querySelector("#nome-time").textContent = nomeDoTime;
  }

  updateHeroPanels();
  updateOtherPanels();

  addEventSelecionar(1);
  addEventSelecionar(2);
  addEventSelecionar(3);

  function filtraCookies(cookies, nome){
    return cookies.filter(
      function(cookie){
        return cookie.domain == 'deckcreator.com' && cookie.name.includes(nome)
      }
    );
  }
});

document.querySelector("#link-fechar").addEventListener('click', function () {
  ipcRenderer.send('fechar-janela-principal');
});

function addEventSelecionar(number){
  document.querySelector('.selecionar-heroi-'+number).addEventListener('click' , function(){
    ipcRenderer.send('seleciona-heroi', number);
    ipcRenderer.send('set-card-cookie', listaDeCartas);
  });
}

document.querySelector("#salvar-deck").addEventListener('click' , function(){
  if(listaDeCartas.length != 50){
    dialog.showMessageBox({message: 'Você precisa ter 50 cartas em seu deck para poder salvá-lo', title: 'Deck Incompleto'}, () => {
    });
    return;
  }

  // for(let i in herois){
  //   herois[i].deck = data.getClasseByCard(herois[i]);
  //   herois[i].deck.cards = [];
  // }

  let object = {
    name: nomeDoTime,
    cards: listaDeCartas,
    heroes: herois
  }

  let deckRetorno = deck.build(object);

  ipcRenderer.send('get-path', 'documents');
  ipcRenderer.on('return-path', (event, path) => {
    if (file.save(path, nomeDoTime, deckRetorno)){
      ipcRenderer.send('pagina-index');
    }
    else {
      ipcRenderer.send('set-card-cookie', listaDeCartas);
      ipcRenderer.send('pagina-editor');
    };
  });
});

function renderPanel(heroi){
  document.querySelector('#panel'+heroi.panel).innerHTML = document.querySelector('#panel'+heroi.panel).innerHTML.replace('panel-default','panel-'+heroi.sub.toLowerCase());
  document.querySelector('#nome-heroi-'+heroi.panel).textContent = heroi.name;
  document.querySelector('#classe-heroi-'+heroi.panel).textContent = heroi.class + ' ('+heroi.deck.alligment+')';
  document.querySelector('#txt-heroi-'+heroi.panel).textContent = 'Alterar';
  document.querySelector('#img-heroi-'+heroi.panel).innerHTML = '<img src="../icons-transparent/'+heroi.main.toLowerCase()+'.svg" height="300%" width="300%"/>';
}

function renderSidebar(buttons){
  let innerHTML = document.querySelector('#side-menu').innerHTML;
  let retorno = html.returnJSON(innerHTML);
  retorno.child = [];
  let resultado = html.menuItem(retorno, buttons);

  document.querySelector('#side-menu').innerHTML = html.returnHTML(resultado);
  for(let i in buttons){
    document.querySelector('#cards-'+buttons[i].class.toLowerCase().replace(' ','')).addEventListener('click', function () {
      let txt = '#cards-'+buttons[i].class.toLowerCase().toLowerCase().replace(' ','');
      renderCards(buttons[i]);
      ipcRenderer.send('set-card-cookie', listaDeCartas);
    });
  }
  document.querySelector("#update-nome").addEventListener('click', function(){
    eventUpdateNome();
  });
  document.querySelector('#campo-nome').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      eventUpdateNome();
    }
  });
  function eventUpdateNome(){
    let campo = document.querySelector("#campo-nome");

    nomeDoTime = campo.value;
    campo.value = '';
    document.querySelector("#nome-time").textContent = nomeDoTime;

    ipcRenderer.send('set-nome-cookie', nomeDoTime);
  }
}

function renderCards(classe){
  let main = data.getMainCardsByClass(classe.main);
  let sub = data.getSubCardsByClass(classe.sub);

  main.sort(dynamicSort('number'));
  sub.sort(dynamicSort('number'));

  let cartas = main.concat(sub);

  let retorno = html.cartas(cartas);
  console.log(retorno);
  document.querySelector('#skill-cards').innerHTML = retorno;

  for(let i in cartas){
    document.querySelector('#card-'+cartas[i].number).addEventListener('click', function () {
      if(conta.obj(listaDeCartas, cartas[i]) < 3){
        if(listaDeCartas.length < 50){
          addObj(cartas[i]);
        }
      }
      else{
        removeObj(listaDeCartas, cartas[i]);
        removeObj(listaDeCartas, cartas[i]);
        removeObj(listaDeCartas, cartas[i]);
      }
      updateCardPanels(cartas[i]);
      updateOtherPanels();
      updateHeroPanels();
    });
    document.querySelector('#card-'+cartas[i].number).addEventListener('contextmenu', function () {
      if(conta.obj(listaDeCartas, cartas[i]) == 0){
        addObj(cartas[i]);
        addObj(cartas[i]);
        addObj(cartas[i]);
      } else{
        removeObj(listaDeCartas, cartas[i]);
      }
      updateCardPanels(cartas[i]);
      updateOtherPanels();
      updateHeroPanels();
    });
    updateCardPanels(cartas[i]);
  }
  updateHeroPanels();
  updateOtherPanels();

  function deckFull(){
    if(listaDeCartas.length >= 50){
      return true;
    }
    return false;
  }
  function addObj(carta){
    if(deckFull()){
      return;
    }
    carta.deck = data.getClasseByCard(carta);
    carta.deck.cards = [];
    listaDeCartas.push(carta);
  }
  function removeObj(lista, obj){
    let count = 0;
    for(let i in lista){
      if(lista[i].number == obj.number){
        lista.splice(i, 1);
        break;
      }
    }
    return count;
  }
}

function updateHeroPanels(){
  for(let i in herois){
    let valor = conta.mainClass(listaDeCartas, herois[i]) + conta.subClass(listaDeCartas, herois[i]);
    document.querySelector('#qtde-heroi-'+herois[i].panel).textContent = valor;
  }
}

function updateCardPanels(carta){
  document.querySelector('#card-text-'+carta.number).textContent = conta.obj(listaDeCartas, carta);
}

function updateOtherPanels(){
  document.querySelector('#all-cards').textContent = listaDeCartas.length;
  document.querySelector('#spell-cards').textContent = conta.class(listaDeCartas, 'Spell') + conta.class(listaDeCartas, 'Enchantment');
  document.querySelector('#talent-cards').textContent = conta.class(listaDeCartas, 'Talent');
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}
