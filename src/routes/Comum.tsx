import React, { useEffect, useState, useId } from 'react';
import '../model/css/Matricular.css'
import { cursos, horarios, dimencao, ativas, periodos } from '../model/Filtro'
import * as html2pdf from 'html2pdf.js'
import { Link } from 'react-router-dom';
import Materia from '../model/Materia'
import 'bootstrap/scss/bootstrap.scss'

const cores: string[] = ["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10"];
const s: string[] = ["Seg", "Ter", "Qua", "Qui", "Sex", "S�b"];
const c: Record<string, string> = { "engcomp": "Engenharia de computa��o", "fisica": "F�sica", "turismo": "Turismo", "matematica": "Matem�tica" };

type ComumProps = {
	cur: string;
	materias: Materia[];
	separa: boolean;
	tela: number;
	f: string;
	fun?: JSX.Element;
	g: string;
}

type HomeState = {
	b: number;
	c: number;
	id: number;
	ind: number;
	materias: Materia[];
}

const Comum: React.FC<ComumProps> = (props) => {
	const [state, setState] = useState({ b: 0, c: 0, ind: 0, id: 0, materias: props.materias })
	//	let {cur, materias, separa, tela, f, fun, g}: ComumProps = props

	const _p: ComumProps = props
	let _cur = props.cur === undefined ? "engcomp" : props.cur
	let _passo: string[][][] = [];
	let _quadros: string[][][] = [];
	let _h1: string[][] | undefined = [];
	let _j: number = 0;
	let _i: number = 0;
	let _td: number = 0;
	let _s: string[] = [];
	let _cor: string[][][] = [];




	function inicia(): void {
		_h1 = horarios(_cur)
		_h1 = _h1 == undefined? []: _h1

		grade()
		_passo = [..._quadros].splice(0, _quadros.length > 10 ? 10 : _quadros.length)
		
		_j = 0
		_i = 0

		indices(0)
	}

	function indices(b: number): void {
		_passo = []
		for (let i = b; i < b + 10 && i < _quadros.length; i++)
			_passo.push(_quadros[b + i])
	}

	function grade() {
		const arr = []
		const cor = []
		const bd = [...state.materias]

		const [th, td] = dimencao(_cur)
		const aux = _p.separa ? separa(bd) : bd
		_td = td
		_s = s.slice(0, td)
		const m = Array(td).fill("")
		const m2 = Array(th).fill("")
		for (const a of aux) {
			const cl = Array.from(m2, () => Array.from(m))
			const v = Array.from(m2, () => Array.from(m))
			const r = Math.floor(Math.random() * cores.length)

			for (const b in a) {

				const opt = a[b]._el === false && !a[b]._di.includes(" - OPT") ? " - OPT" : "";
				for (let c = 0; c < td; c++) {
					for (let d = 0; d < th; d++) {
						if (a[b]._ho[c]) {
							if (a[b]._ho[c][d]) {
								if (v[d][c] === "" || v[d][c] === undefined) v[d][c] = a[b]._di + opt
								else v[d][c] += " / " + a[b]._di + opt
								cl[d][c] = cores[(parseInt(b) + r) % cores.length]
							}
						}
					}
				}
			}
			arr.push(v);
			cor.push(cl);
		}

		_quadros = arr
		_cor = cor
	}

	function separa(arr: Materia[]): Materia[][] {
		const aux: Materia[][] = [];
		for (const i of arr) {
			if (i._se !== aux.length) {
				for (let j = aux.length; j < i._se; j++)
					aux.push([])
			}
			aux[i._se - 1].push(i);
		}
		return aux.filter(e => e.some(elemento => elemento !== undefined && elemento !== null));
	}

	function salva(): void {
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
			margin: [10, 10, 10, 10],
			filename: "Grade.pdf",
			html2canvas: { scale: 5 },
			jsPDF: { unit: "mm", format: "A4", orientation: "landscape" }
		}

		// Centralize o conte�do
		tela.style.textAlign = "center"; // Centralize horizontalmente
		tela.style.display = "flex";
		tela.style.flexDirection = "column";
		tela.style.width = "100%";
		tela.style.height = "100vh";
		tela.style.justifyContent = "center"; // Centralize verticalmente
		tela.style.alignItems = "center"; // Centralize verticalmente
		tela.style.margin = "auto"; /// Centralize verticalmente
		slide.style.margin = "auto"; /// Centralize verticalmente

		html2pdf().set(options).from(tela).save()
	}

	function isChecked(i: number, j: number): JSX.Element {
		const id = `t_${String(i)}_${String(j)}`
		return <input type="checkbox" className="t_mat2" name={id} id={id} value={id} />
	}

	function primeiro(n: number): void {
		setState((e) => ({ ...e, id: n - 1 }))
	}

	function selected(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
		const checkbox = document.getElementById('section1')
		checkbox.checked = false
		const arr = Object.entries(c).filter(item => {
			if (item[1] === e.target.innerText)
				return true
			return false
		})[0]
		_cur = arr[0]
		state.materias = ativas(_cur)
		const p = periodos(_cur)
		
		primeiro(state.id > p ? p : state.id + 1)
	}

	function option(e: string): JSX.Element {
		return <Link key={useId()} to={"/" + e} onClick={(f) => selected(f)}>{c[e]}</Link>
	}

	function selects() {
		const item = cursos()
		return (
			<div className="accordion">
				<input type="checkbox" id="section1" />
				<label htmlFor="section1">Cursos</label>
				<div className="content-cursos">
					<div className="cursos">
						{item.map((e) => option(e))}
					</div>
				</div>
			</div>
		)
	}

	function mudaTela(i):void {
		setState((e) => ({ ...e, b: i}))
	}

	function matricular(): JSX.Element {
		if (_p.tela === 2)
			return (
				<>
					<input type="submit" value="Baixar grade" onClick={() => salva()} />
				</>)
		return (
			selects()
		)
	}

	function tela(): JSX.Element {
		let i = state.id
		return (
			<div className="grade-content">
				<div className="intervalo">
					{(i + 1) + _p.g + _p.f}
				</div>
				{caso()}
			</div>
		)
	}

	function muda(): JSX.Element {
		_i = 0
		if (state.b !== 1)
			return (
				<>
					<div className="salvar">
						{matricular()}
					</div>
					<div className="slides">
						<div className={"seila" + _p.tela}>
							{tela()}
						</div>
					</div>
					<div className="footer">
						<div className="buttom-content">
							{_p.fun || " "}<br />
						</div>
						<div className="navigation">
							{pages()}
						</div>
					</div>
				</>
			)

		return (
			<>
				<form className="box" action="#" method="post">
					<h1>Login</h1>
					<input type="text" name="" placeholder="Digite sua matr�cula" />
					<input type="password" name="" placeholder="Digite sua senha" />
					<input type="submit" value="Matricule-me" onClick={() => { mudaTela(0); alert("Ainda n�o funciona") }} />
				</form>
			</>)
	}

	function next(p: boolean): void {
		let b = state.c + (p ? 10 : state.c >= 10 ? -10 : 0)
		b = (_quadros.length < 10 + b) ? _quadros.length - 10 : b - b % 10
		indices(b)
		setState((e) => ({ ...e, c: b }))
	}

	function labels(f: number): JSX.Element {
		const n = f + 1 + state.c
		const i = _p.tela + "" + (n - 1)
		return (
			<label  htmlFor={"radio" + i} className={"page"} onClick={() => { primeiro(n) }} id={"bar" + i}>
				{n + _p.g}
			</label>
		)
	}

	function pages(): JSX.Element[] {
		const h: JSX.Element[] = []
		if (state.c > 0)
			h.push(<label key={useId()}  className="control prev" onClick={() => { next(false) }}>{"<<"}</label>)
		if (_p.tela !== 3) {
			for (const x in _passo) {
				h.push(labels(parseInt(x)))
			}
			if (state.c + 10 < _quadros.length)
				h.push(<label key={useId()} className="control next" onClick={() => { next(true) }}>{">>"}</label>)
		}
		return h
	}

	function linha(a: string[], b: string[] | null, c: number) {
		const h: JSX.Element[] = []
		const s = _td === 6 ? "semana1" : "semana2"
		const key = "th_" + String(_i) + "_" + String(_j) + "_";
		if (b !== null) {
			h.push(<th key={key} className="horario" scope="col">{_h1[_i][0] + " �s " + _h1[_i][1]}</th>)//
			for (const i in a) {
				if (_p.tela !== 3)
					h.push(<th key={key + "_" + String(i)} className={"grade " + a[i]} scope="col" name={b}>{b[i]}</th>)
				else {
					h.push(
						<th key={key + "_" + String(i)} className="grade" scope="col" >
							{isChecked(c, i)}
						</th>
					)
				}
			}
			_i++
		} else {
			h.push(<th key={key} className={"semana " + s} scope="col"></th>)
			for (const i in a)
				h.push(<th key={key + "_" + String(i)} className={"semana " + s} scope="col">{a[i]}</th>)
		}
		return h
	}

	function horario(a: string[], b: string[], c: number) {
		if (_i > 0 && _h1[_i][0] !== _h1[_i - 1][1]) {
			return (
				<>
					<tr><th className='intervalo2' colSpan={7} scope="row">Intervalo</th></tr>
					<tr className="tr">{linha(a, b, c)}</tr>
				</>)
		}
		return (<tr className="tr">{linha(a, b, c)}</tr>)
	}

	function getHorarios(a: string[], b: string[], c: number) {
		const h: JSX.Element[] = []
		if (_i < _h1.length)
			h.push(horario(b, a, c))
		return h
	}

	function caso() {
		inicia()
		let u = _quadros[state.id] || []
		return (
			<>
				<table className="">
					<thead>
						<tr>{linha(_s, null, 0)}</tr>
					</thead>
					<tbody>
						{u.map((a, b) => { return getHorarios(a, _cor[state.id][b], b) })}
					</tbody>
				</table>
			</>
		)
	}


	return muda()
	
}

export default Comum