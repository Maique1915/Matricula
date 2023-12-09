import React from 'react';
import '../model/util/css/Matricular.css'
import { ativas, periodos, cursos } from '../model/Filtro'
import * as html2pdf from 'html2pdf.js';


const cores = ["l0","l1","l2","l3","l4","l5","l6","l7","l8","l9", "l10"] 

export default class Comum extends React.Component{

	constructor(props){
		super(props)
		this.state = { bd: props.materias, b: 0, id: 0, j: 0, se: props.separa, desc: null }
		this.cur = props.cur
		this.arr = props.materias
		this.t = props.tela
		this.f = props.f
		this.g = props.g
		this.grade()
		this.passo = [...this.arr].splice(0, this.arr.length > 10 ? 10 : this.arr.length)
		this.b = 0
		this.inicio = 0
		this.h1 = ["07:00", " 07:50", "08:40", "09:30", "10:00","10:50", "11:40", "12:30", "14:00", "14:50",  "15:40", "16:30", "17:20", "18:10", "19:00"]
		this.s = ["Seg", "Ter", "Qua", "Qui", "Sex"]
		this.id = props.tela
		this.i = 0
		this.j = 0
		this.fun = props.fun
		this.next = this.next.bind(this);
	}

	inicia() {
        let a = window.location.href.split("/")[3]
        this.cur = a === "" ? this.cur : a
        // Verifica se o estado cur foi alterado
        if (a !== this.state.cur) {
            // Fa�a algo aqui, por exemplo, chamar uma fun��o que atualiza os componentes
			this.arr = ativas(a)
			this.grade()
			this.indices(0)
        }
    }

	indices(b){
		this.passo = []
			for (let i = b; i < b + 10 && i < this.arr.length; i++)
				this.passo.push(this.arr[b+i])
	}

	grade() {
		const m = Array(5).fill("");
		const m2 = Array(15).fill("");
		const arr = [];
		const cor = [];
		const bd = [...this.arr]
		const aux = this.state.se ? this.separa([...this.state.bd]) : [...this.state.bd]; // Evitar muta��o
		this.materias = Array(periodos(this.cur)).fill([])

		for (const a of aux) {
			const cl = Array.from(m2, () => Array.from(m));
			const v = Array.from(m2, () => Array.from(m));
			const r = Math.floor(Math.random() * cores.length);

			for (const b in a) {
				const opt = a[b]._el === false && !a[b]._di.includes(" - OPT") ? " - OPT" : "";

				for (const c in a[b]._ho) {
					for (const d in a[b]._ho[c]) {
						if (a[b]._ho[c][d]) {
							if (v[d][c] === "") v[d][c] = a[b]._di + opt;
							else v[d][c] += " / " + a[b]._di + opt;

							cl[d][c] = cores[(parseInt(b) + r) % cores.length];
						}
					}
				}
			}

			arr.push(v);
			cor.push(cl);
		}

		console.log(this.arr)
		for (const a of ativas(this.cur)) {
			this.materias[a._se - 1].push(a)
		}

		this.arr = arr
		this.cor = cor
		if(bd[0]._cu !== this.state.bd[0]._cu)
			this.setState({ id: 0, bd: bd });
	}

	separa(arr) {
		let aux = [];
		let aux2 = [];
		let count = 1;

		for (const i of arr) {
			if (i._se !== count) {
				count = i._se;
				aux.push(aux2);
				aux2 = [];
			}
			aux2.push(i);
		}

		aux.push(aux2);
		return aux;
	}

	periodos(array){
		this.materias = array
		const arr = this.separa(array)
		let aux = []
		for (const i in arr) {
			let sem = []
			for (var l = 0; l < 5; l++) {
				let h = []
				for (var c = 0; c < 6; c++) {
					h.push(this.selects(l,c, arr[i]))
				}
				sem.push(h)
			}
			aux.push(sem)
		}
		return aux
	}

	salva(){
		// Cria uma nova div
		const slide = document.createElement('div');
		const tela = document.createElement('div');

		// Adiciona uma classe � nova div
		slide.classList.add('slides2');

		const root = document.querySelector(".seila2")
		// Fazer uma c�pia do elemento
		const elementoCopiado = root.cloneNode(true);

		// Anexar a c�pia a algum lugar no DOM (por exemplo, ao final do corpo do documento)
		const elementoTexto = elementoCopiado.querySelector('.intervalo');
		// Selecionar o elemento que cont�m o texto "4� Grade poss�vel"
	    elementoTexto.textContent = "Grade";

		// Insere a nova div interna dentro da div externa
		slide.appendChild(elementoCopiado);
		tela.appendChild(slide);
		
		const options = {
			margin: [10,10,10,10],
			filename: "Grade.pdf",
			html2canvas:{scale: 5},
			jsPDF: { unit: "mm", format: "A4", orientation: "landscape"}
		}

		// Centralize o conte�do
		tela.style.textAlign = "center"; // Centralize horizontalmente
		tela.style.display = "flex";
		tela.style.width = "100%";
		tela.style.height = "100vh";
		tela.style.justifyContent = "center"; // Centralize verticalmente
		slide.style.margin = "0"; /// Centralize verticalmente

		html2pdf().set(options).from(tela).save()
	}

	atualiza(i, j, op){
		if(this.materias[this.state.id][this.state.j]._ho[j] !== null)
			this.materias[this.state.id][this.state.j]._ho[j][i] = op.checked
	}

	isChecked(i, j){
		const id = "t_"+i+"_"+j
		return <input type="checkbox" className="t_mat2" onClick={(e)=>{this.atualiza(i, j, e.target)}} name={id} id={id} value={id} />
	}

	primeiro(n){
		this.setState({id: n-1, j: 0})
	}


	option(e){
		return <option value={e} >{e}</option>
	}

	selects(){
		const key = this.state.id
		const item = cursos()
		const val = ""
		return (
			<select name={"materia"+key} defaultValue={val} id={"cursos"}>
			    {item.map((e)=>this.option(e))}
			</select>
			)
	}

	

	mudaTela(e, i){
  		e.preventDefault()
  		this.setState({b : i})
	}

	matricular(){
		//<input type="submit" value="Escolher esta" onClick={(e) => this.mudaTela(e, 1)} />
		if(this.t === 2)
			return (
			<>
				<input type="submit" value="Baixar grade" onClick={(e) => this.salva()} />
			</>)
		return ("")
	}

	tela(){
		let i = this.state.id
		return (
		<div className="grade-content">
			<div className="intervalo">
				{(i+1)+this.g+this.f}
			</div>
			{this.caso()}
		</div>
		)
	}

	muda(){
		this.i = 0
		if(this.state.b !== 1)
			return (
			<>
				<div className="salvar">
					{this.matricular()}
				</div>
					<div className="slides">
						<div className={"seila"+this.t}>
							{this.tela()}
						</div>
					</div>
				<div className="footer">
					<div className="buttom-content">
					{this.fun || " "}<br/>
					</div>
					<div className="navigation">
						{this.pages()}
					</div>
				</div>
			</>
			)

		return (
		<>
			<form class="box" action="#" method="post">
				<h1>Login</h1>
				<input type="text" name="" placeholder="Digite sua matr�cula"/>
				<input type="password" name="" placeholder="Digite sua senha"/>
				<input type="submit" value="Matricule-me"  onClick={(e) => {this.mudaTela(e, 0); alert("Ainda n�o funciona")}}/>
			</form>
		</>)
	}

	next(p){
		this.b += p ? 10 : this.b >= 10? -10: 0
		this.b = (this.arr.length < 10 +this.b) ? this.arr.length -10 : this.b - this.b%10
		this.indices(this.b)
		this.setState({})
	}

	pages(){
		let h = []
		if(this.b > 0)
			h.push(<label className="control prev" onClick={(e)=>{this.next(false)}}>{"<<"}</label>)
		if(this.t !== 3){
			for(const x in this.passo){
				h.push(this.labels(x))
			}
			if(this.b+10 < this.arr.length)
				h.push(<label className="control next"  onClick={(e)=>{this.next(true)}}>{">>"}</label>)
		}
		return h
	}

	labels(f){
		const n = parseInt(f)+1+this.b
		const i = this.t+""+(n-1)
		return (
			<label htmlFor={"radio"+i} className={"page"} onClick={(e)=>{this.primeiro(n)}} id={"bar"+i}>
				{n+this.g}
			</label>
			)
	}

	linha(a, b, c){
		let h = []
		if(b !== null){
			if(this.h1[this.i] === "09:30" || this.h1[this.i] === "12:30"){
				h.push(<th className='intervalo2' colSpan="6" scope="row">Intervalo</th>)
			}else{
				h.push(<th className="horario" scope="col">{this.h1[this.i] +" �s "+this.h1[this.i+1]}</th>)//
				for (const i in a){
					if(this.t !== 3)
						h.push(<th className={"grade " + a[i]} scope="col" name={b}>{b[i]}</th>)
					else{
						h.push(
							<th className="grade" scope="col" >
								{this.isChecked(c,i)}
							</th>
							)
					}
				}
			}
			this.i++

		}else{
			h.push(<th className="semana" scope="col"></th>)
			for (const i in a)
				h.push(<th className="semana" scope="col">{a[i]}</th>)
		}

		return h
	}

	horario(a, b, c){
		if(this.h1[this.i] === "09:30" || this.h1[this.i] === "12:30")
			return (
				<>
					<tr>{this.linha(a, b, c)}</tr>
					<tr className="tr">{this.linha(a, b, c)}</tr>
				</>)
		return (<tr className="tr">{this.linha(a, b, c)}</tr>)
	}

	horarios(a, b, c){
		let h = []
		h.push(this.horario(b, a, c))
		if(this.i < this.h1.length)
			return h
	}

	caso(){
		this.inicia()
		let u = this.arr[this.state.id] || []
		return(
			<>
			<table className="">
  				<thead>	      		
		      		<tr>{this.linha(this.s, null)}</tr>
			  	</thead>
			  	<tbody>
			      	{u.map((a,b)=>{return this.horarios(a,this.cor[this.state.id][b], b)})}
				</tbody>
			</table>
			</>
		)
	}
	
	render(){
		return this.muda()
	}
}