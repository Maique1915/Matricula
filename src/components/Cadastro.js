import '../model/util/css/Horarios.css'
import React from 'react'
import MateriasArray from '../model/materiasArray'
import db from '../model/db'
import Comum from './Comum'
import Tabela from './Tabela'

class Cadastro extends React.Component{

	constructor(){
		super()
		this.array = new MateriasArray().opc
		this.materias = db
	}

	grava(e){
		const mat = document.getElementsByClassName("materias")
		const ma = new MateriasArray().materias
		console.log(mat[0])
		for(const l of mat){
			for(const m of ma){
				if(m.disciplina === l.value){
					const ind = l.name.replace("materia", "")
					if(l.value.length > 0){
						m.horario = ind.concat("1")
					}else{
						m.horario = ind.concat("0")
					}
				}
			}
		}

		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ma));
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href",     dataStr);
		downloadAnchorNode.setAttribute("download", "bd.json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		alert("salve este db.json na pasta model")
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}	
	
	render(){
		return <Comum materias = {this.materias} tela={2} f={"Grade possível"}/>
	}
}

export default Cadastro