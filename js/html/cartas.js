const builder = require('./builder.js');

module.exports = {
  cartas(lista){
    let colunas = 5;
    let cards = [];
    // main.sort(dynamicSort('number'));
    // sub.sort(dynamicSort('number'));

    lista.forEach(addCard);
    // sub.forEach(addCard);

    function addCard(card, index, array){
      let childs = [];

      childs.push(builder.element('img', {src:'https://gdurl.com/'+card.imgurl, height: '100%', width: '100%'}, []));
      if(card.stamp == 'new'){
        childs.push(builder.element('img', {class:'selo-novidade', src:'https://gdurl.com/ZG-x', height: '25%', width: '30%'}, []));
      }
      else if(card.stamp == 'updated'){
        childs.push(builder.element('img', {class:'selo-novidade', src:'https://gdurl.com/0hHB', height: '25%', width: '30%'}, []));
      }
      childs.push(builder.element('h4', {id:'card-text-'+card.number, class:'qtde-cards'}, [builder.text('0')]));

      cards.push(builder.element('div', {id:'card-'+card.number, class: 'col-lg-2'}, childs));
    }

    let rows = [];
    rows.push(builder.element('div', {class: 'row'}, cards));

    return builder.build([{ node: 'element', tag: 'div', attr:{class: 'col-lg-12'}, child: rows }]);
  }
}
