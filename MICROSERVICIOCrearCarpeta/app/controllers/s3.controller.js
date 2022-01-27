var express = require('express');
var router = express.Router();

var uuid = require('uuid-random');

const AWS = require('aws-sdk');
require('dotenv').config();


AWS.config.update({
	region: process.env.AWS_DEFAULT_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const  dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "AyDrive";


exports.ccarpeta = async (req, res) => {

	const { nickname, carpeta } = req.params;

	let date = new Date()
	let day = date.getDate()
	let month = date.getMonth() + 1
	let year = date.getFullYear()

	var fechaCreacion = "";

	if (month < 10) {
		fechaCreacion = `${day}-0${month}-${year}`;
	} else {
		fechaCreacion = `${day}-${month}-${year}`;
	}

	let esquema = {
		"fechaCreacion":fechaCreacion,
		"eliminado":0,
		"archivos":[],
		"nombre":carpeta
	}

	try {

		const params2 = {
			TableName: TABLE_NAME,
			Key: {
				nickname,
			},
		};
		result = await dynamoClient.get(params2).promise()
		//console.log(result.Item.workspace.carpetas);

	} catch (error) {
		console.error(error);
		res.status(500).json({ err: err, esError: 'si' });
	}

	console.log("A----------------------------------------------");

	for(var i = 0; i < result.Item.workspace.carpetas.length; i++){
		if((result.Item.workspace.carpetas[i].nombre===carpeta)&&
			(result.Item.workspace.carpetas[i].eliminado === 0)){
			//console.log("Error la carpeta ya existe");
			//res.status(400).send({ message: "ERROR: No se pudo crear la carpeta. DETALLE: La carpeta ya existe." });
			//return response.status(400).send("ERROR: No se pudo crear la carpeta. DETALLE: La carpeta ya existe.");
			res.send("ERROR: No se pudo crear la carpeta. DETALLE: La carpeta ya existe.") ;
			//return;
		}
	}

	result.Item.workspace.carpetas.push(esquema);
	//console.log(result.Item.workspace.carpetas);

	const params3 = {
		TableName: TABLE_NAME,
		Item: result.Item,
		Key: {
			nickname,
		},
	}
	resutadoFinal = dynamoClient.put(params3).promise();

	//console.log("Se creo carpeta exitosamente");
	console.log("B----------------------------------------------");
	//res.status(200).send({ message: "CORRECTO: La carpeta fue creada exitosamente" });
	//return response.status(201).send("CORRECTO: La carpeta fue creada exitosamente");
	res.send("CORRECTO: La carpeta fue creada exitosamente");
	console.log("C----------------------------------------------");

}


