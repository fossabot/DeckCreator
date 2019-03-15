const jsonfile = require('jsonfile');
const fs = require('fs');
const { ipcRenderer }  = require('electron');


module.exports = {
  saveLogin(path, nome, json){
    let caminho = validaPath(path, ['/My Games','/Tabletop Simulator/']);
    let file = caminho + nome + '.json';

    jsonfile.writeFile(file, json, {spaces: 2}, function (err) {
      if (err) console.error(err)
    });
    return 1;
  },
  deleteLogin(path){
    var filePath = path + '/My Games/Tabletop Simulator/dclogin.json';

    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
    }
    return 1;
  },
  export(path, nome, json){
    let caminho = validaPath(path, ['/My Games','/Tabletop Simulator','/Saves','/Saved Objects','/DeckCreator/']);
    let file = caminho + nome + '.json';

    jsonfile.writeFile(file, json, {spaces: 2}, function (err) {
      if (err) console.error(err)
    });
    return 1;
  },
  update(path, nome, antigo, json){
    json.Nickname = nome;
    let caminho = validaPath(path, ['/My Games','/Tabletop Simulator','/Saves','/Saved Objects','/DeckCreator/']);
    let newFile = caminho + nome + '.json';
    let oldFile = caminho + antigo + '.json';
    fs.unlinkSync(oldFile);

    json = {SaveName: '',GameMode: '',Gravity: 0.5,Date: '',Table: '',Sky: '',Note: '',Rules: '',XmlUI: '',LuaScript: '',ObjectStates: [json],LuaScriptState: ''};

    jsonfile.writeFile(newFile, json, {spaces: 2}, function (err) {
      if (err) console.error(err)
    });
    return 1;
  },
  delete(path, name){
    var filePath = path + '/My Games/Tabletop Simulator/Saves/Saved Objects/DeckCreator/' + name + '.json';
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
    }
  },
  readDir(path, fileTree){
    let caminho = validaPath(path, ['/My Games','/Tabletop Simulator','/Saves','/Saved Objects','/DeckCreator/']);
    let json = [];

    fs.readdirSync(caminho).forEach(file => {
      json.push(this.readFile(path, file, fileTree).ObjectStates[0]);
    })
    return json;
  },
  readFile(path, nome, fileTree){
    let file = validaPath(path, fileTree) + nome;
    if(fs.existsSync(file)){
      return jsonfile.readFileSync(file);
    }
    return 0;
  },
  clearCache(path){
    let caminho = validaPath(path, ['/My Games','/Tabletop Simulator','/Mods','/Images/']);
    let files = [];

    fs.readdirSync(caminho).forEach(file => {
      files.push(file);
    })

    files.forEach(excluir);
    function excluir(file, index, array){
      fs.unlinkSync(caminho + file);
    }
  }
}

function validaPath(path, pastas) {
  let caminho = path;
  pastas.forEach(valida);

  function valida(pasta, index, array){
    caminho += pasta;
    if(!fs.existsSync(caminho)){
      fs.mkdirSync(caminho);
    }
  }
  return caminho;
}
