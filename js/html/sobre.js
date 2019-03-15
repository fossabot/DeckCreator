const builder = require('./builder.js');

module.exports = {
  html(){
    let text = [];

    text.push(h1('Patch Notes'));
    text.push(h3('Releases:'));

    text.push(h4('1.7.0 (12/03/2019)'));
    text.push(patch([
      {
        titulo: 'Novas Funcionalidades:',
        itens: ['Agora é possível importar todos os decks que já estiverem cadastrados no seu usuário para a máquina local (pasta do TTS).']
      },
      {
        titulo: 'Novas Classes:',
        itens: ['Oracle (Beta), com 14 cartas experimentais.','Shaman (Beta), com 14 cartas experimentais.']
      },
      {
        titulo: 'Correções de bugs:',
        itens: ['Corrigido o login sendo Case Sensitive.', 'Corrigido o login que agora aceita a tecla Enter no lugar de clicar no botão de conectar.', 'Corrigido o botão Limpar Cache do TTS não estar funcionando.']
      },
      {
        titulo: 'Cartas alteradas:',
        itens: ['Wisdom (Spell): Removida provisoriamente.','Replicate (Spell): Removida provisoriamente.','Hyperthmesia (Enchantment): Removida provisoriamente.','Aura of Valor (Enchantment): Removida provisoriamente.','Foresee (Spell): Transformada em uma nova carta do Oracle.','Bloodletting (Spell): Transformada em uma nova carta do Shaman.']
      }])
    );

    text.push(h4('1.7.1b (27/02/2019)'));
    text.push(patch([
      {
        titulo: 'Correções de bugs:',
        itens: ['Corrigido o problema da página Novo Deck remover o cookie de sessão.','Corrigida busca de cartas não obter as cartas Spell/Enchantment/Talent com mais de uma página.']
      }])
    );

    text.push(h4('1.7.0b (27/02/2019)'));
    text.push(patch([
      {
        titulo: 'Novas Funcionalidades:',
        itens: ['Migração do Banco de Dados para a nuvem fazendo com que os decks agora não fiquem apenas salvos na máquina local do usuário.', 'Página de login para que os decks sejam vinculados ao seu usuário.']
      },
      {
        titulo: 'Cartas alteradas:',
        itens: ['Final Breath (Talent): Função alterada (Uso original).']
      }])
    );

    text.push(h4('1.6.1 (02/12/2018)'));
    text.push(patch([
      {
        titulo: 'Correções de bugs:',
        itens: ['Corrigido problema de não aparecerem Spell/Talents defensivos.']
      }])
    );

    text.push(h4('1.6.0 (02/12/2018)'));
    text.push(patch([
      {
        titulo: 'Novas Funcionalidades:',
        itens: ['Ver todas as cartas inseridas no deck (independente da classe escolhida) e removê-las.', 'Salvar Deck Experimental com mais ou menos do que 50 cartas.','Página Sobre.']
      },
      {
        titulo: 'Novas Classes:',
        itens: ['Blacksmith (Beta), com 14 cartas experimentais.', 'Ninja (Beta), com 14 cartas experimentais.']
      },
      {
        titulo: 'Correções de bugs:',
        itens: ['Agora ao salvar um deck ele permanece corretamente no editor para fazer alterações.', 'Ao excluir um deck, a lista de decks será recarregada corretamente.', 'Refatoração de código.']
      }])
    );

    text.push(h4('1.5.0 (26/11/2018)'));
    text.push(patch([
      {
        titulo: 'Novas Funcionalidades:',
        itens: ['Homepage com FAQ e helpdesk.']
      },
      {
        titulo: 'Melhorias Visuais:',
        itens: ['Novos ícones no menu principal.', 'Melhoria na descrição dos efeitos para os iniciantes com exemplos mais descritivos.']
      }])
    );

    text.push(h4('1.4.0 (25/11/2018)'));
    text.push(patch([
      {
        titulo: 'Novas Funcionalidades:',
        itens: ['Alterar nome do deck.']
      },
      {
        titulo: 'Correções de bugs:',
        itens: ['Agora a contagem de Enchantments do Deck aparece correta na listagem.']
      },
      {
        titulo: 'Cartas alteradas:',
        itens: ['Wisdom (Spell): Função alterada novamente (Novo efeito Search).','Paralyze (Spell): Função alterada (Afeta todos).','Cleansing (Spell): Função alterada (Afeta todos).','Replicate (Spell): Nova carta.','Clumsiness (Enchantment): Diminuição do custo.','Hyperthmesia (Enchantment): Diminuição do efeito.','Adrenaline Rush (Berserker): Diminuição do custo.','Detect Magic (Warlock): Diminuição do custo.']
      }])
    );

    text.push(h4('1.3.1 (21/11/2018)'));
    text.push(patch([
      {
        titulo: 'Correções de bugs:',
        itens: ['Refatoração de código.']
      }])
    );

    text.push(h4('1.3.0 (21/11/2018)'));
    text.push(patch([
      {
        titulo: 'Novas Funcionalidades:',
        itens: ['Lista de efeitos das cartas.', 'Página com as regras do jogo.']
      }])
    );

    text.push(h4('1.2.0 (19/11/2018)'));
    text.push(patch([
      {
        titulo: 'Novas Funcionalidades:',
        itens: ['Excluir Deck.', 'Limpar Cache do Tabletop Simulator.']
      },
      {
        titulo: 'Melhorias visuais:',
        itens: ['Mensagens de Sucesso/Aviso.', 'Novos selos em cartas novas ou que foram alteradas recentemente.', 'Agora aparece o tipo da classe ao lado do nome do herói (M/S/U).']
      },
      {
        titulo: 'Cartas alteradas:',
        itens: ['Knowledge (Talent): Texto corrigido.', 'Wisdom (Spell): Função alterada (Ainda em avaliação).', 'Squeeze (Beast): Nome alterado para Strangle.']
      },
      {
        titulo: 'Correções de bugs:',
        itens: ['Imagens de híbridos agora aparecem corretamente ao carregar deck.', 'Imagens de híbridos agora aparecem corretamente no menu de decks.']
      }])
    );

    let json = builder.element('div', {class:'col-lg-12'}, text)

    return builder.build([json]);
  }
}

function patch(lista){
  let retorno = []
  lista.forEach(function (objeto, index, array){
    retorno.push({texto: builder.text(objeto.titulo), items:ul(objeto.itens)});
  });
  return ul2(retorno);
}

function p(string){
  return builder.element('p', null, [builder.text(string)]);
}

function h1(string){
  return builder.element('h1', {class:'page-header'}, [builder.text(string)]);
}

function h3(string){
  return builder.element('h3', null, [builder.text(string)]);
}

function h4(string){
  return builder.element('h4', null, [builder.text(string)]);
}

function ul(lista, tipo){
  let li = [];
  lista.forEach(monta);
  function monta(item, index, array){
    li.push(builder.element('li', null, [builder.text(item)]));
  }
  return builder.element('ul', null, li);
}

function ul2(lista){
  let li = [];
  lista.forEach(monta);
  function monta(item, index, array){
    li.push(builder.element('li', null, [item.texto, item.items]));
  }
  return builder.element('ul', null, li);
}
