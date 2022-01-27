var express = require('express');
const cors = require('cors');
var router = express.Router();
router.use(cors());

const {
  addOrUpdateCharacter,
  getCharacters,
  deleteCharacter,
  getCharacterById,
} = require('./dynamo');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
});



//LISTAR TODAS LAS CARPETAR DEL USUARIO QUE INICIO SESION
router.get('/listarcarpetas/:nickname', async (req, res) => {

  const { nickname } = req.params;

  try {

    const character = await getCharacterById(nickname); //parser a json
    const carpetas = character.Item.workspace.carpetas;
   // const archivos = character.Item.workspace.archivos;

    CarpetasUsuario = [];
    let numero;

    for (var valor of carpetas){//recorrer carpetas existentes(eliminado=0).
      
      if(valor.eliminado==0){
       // console.log("----> "+valor.nombre);
        numero=0;
        for(var file of valor.archivos){//contar los archivos existentes(eliminado=0) de una carpeta.
          if(file.eliminado==0){
            numero=numero+1;
            }
        }

        
          let esquema={
            "nombre":valor.nombre,
            "fechaCreacion":valor.fechaCreacion,
            "numeroarchivos":numero
          }
          CarpetasUsuario.push(esquema);

      }//fin del if

    }//fin del for
    
    res.json(CarpetasUsuario);


  } catch (err) {
    //console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});





module.exports = router;
