import React, { useEffect, useState, useId } from 'react';
import Comum from './Comum';
import Grafos from '../model/util/Grafos';
import Escolhe from '../model/util/Escolhe';
import { ativas } from '../model/Filtro';
import Materia from '../model/Materia';
import '../model/css/GeraGrade.css'
import '../model/css/Horarios.css'

interface GeraGradeProps {
	cur: string;
}
interface HomeState {
	names: string[];
	keys: number[];
	cr: number[];
	x: string[];
	gr: Materia[];
	estado: number;
}

type Item = Record<string | number, JSX.Element[]>

const GeraGrade: React.FC<GeraGradeProps> = ({ cur }) => {
	

	const [state, setState] = useState<HomeState>({
		names: [],
		keys: [],
		cr: [],
		estado: 0,
		x: [],
		gr: [],
	});

	let arr = ativas(cur);
	let m: Materia[] = remove([...arr])

	function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.className === 't_mat') {
			const b = e.target.checked;
			// L�gica para lidar com a classe 't_mat'
			const el = document.getElementById(e.target.value);

			if (el !== null) {
				const per: HTMLCollectionOf<Element> = el.getElementsByClassName("mat");
				for (const mat of per) {
					if (mat instanceof HTMLInputElement) {
						mat.checked = b

						let id = 0;

						if (state.estado === 0) {
							id = state.keys.indexOf(parseInt(mat.value));
						} else if (state.estado === 1) {
							id = state.x.indexOf(mat.id);
						}

						if (b && id === -1) {
							altera(true, mat);
						} else if (!b && id >= 0) {
							altera(false, mat);
						}
					}
				}
				e.target.checked = b
			}
		} else {
			if (e.target.checked === true) {
				altera(true, e.target);
			} else if (e.target.checked === false) {
				altera(false, e.target);
			}
		}
	}

	function altera(a: boolean, b: HTMLInputElement) {
		
		if (state.estado === 0) {
			const value = parseInt(b.value);

			if (a) {
				setState((prevState) => ({
					...prevState,
					keys: [...prevState.keys, value],
					names: [...prevState.names, b.id],
					cr: [...prevState.cr, parseInt(b.getAttribute('cr') || '-1')],
					
				}));
			} else {
				setState((prevState) => {
					const i = prevState.keys.findIndex((key) => key === value);

					if (i !== -1) {
						const keys = [...prevState.keys];
						keys.splice(i, 1);

						const names = [...prevState.names];
						names.splice(i, 1);

						const cr = [...prevState.cr];
						cr.splice(i, 1);

						return { ...prevState, keys, names, cr };
					}
					return prevState;
				});
			}
		} else if (state.estado === 1) {
			if (a) {
				setState((prevState) => ({
					...prevState,
					x: [...prevState.x, b.id]
				}));
			} else {
				setState((prevState) => ({
					...prevState,
					x: prevState.x.filter((id) => id !== b.id)
				}));
			}
		}

		// Evite manipula��es diretas do DOM em React sempre que poss�vel
		const checkboxId = `t_${b.parentNode?.parentNode?.id}`;
		const checkbox = document.getElementById(checkboxId) as HTMLInputElement | null;
		if (checkbox) {
			checkbox.checked = false;
		}
	}

	function periodo (m: Materia[]): Item {
		const aux: Item = {};

		for (const i in m) {
			if(!(m[i]._se in aux)){
				aux[m[i]._se] = []
			}
			if(state.estado === 0)
				aux[m[i]._se].push(periodios(i,m[i]))
			else if (state.estado === 1)
				aux[m[i]._se].push(periodios(m[i]._re,m[i]))
		}
		return aux
	}

	function remove(m: Materia[]): Materia[] {
		const e: string[] = []
		for (let i = 0; i < m.length;){
			if (e.includes(m[i]._re))
				m.splice(i,1)
			else{
				if (m[i]._di.includes(" - A") || m[i]._di.includes(" - B"))
					m[i]._di = m[i]._di.substring(0, m[i]._di.length-4)
				else if(!m[i]._el && !m[i]._di.includes(" - OPT"))
					m[i]._di += " - OPT"
				e.push(m[i]._re)
				i++
			}
		}
		return m
	}

	function iDivs (i: number | string, a: Item): JSX.Element {
		return (
			<>
				<div className="periodo">
					<input  type="checkbox" className="t_mat" name={"t_"+i} id={"t_"+i} value={i} onClick={(e)=>{handleCheck(e)}}/>
					<label >{(i)+"� Periodo"}</label>
				</div>
				<div className="as" id={String(i)}>{a[i].map(e => e)}</div>
			</>
			)
	}

	function periodios(k: number, i: Materia): JSX.Element {
		let checked = false
		if (state.estado === 0)
			checked = state.names.includes(i._re)
		else if (state.estado === 1)
			checked = state.x.includes(i._re)

		return(
			<div className="check">
				<input type="checkbox" cr={i._ap+i._at} defaultChecked={checked} className="mat" id={i._re} name={i._re} value={k} onClick={(e)=>{handleCheck(e)}}/>
				<label htmlFor={i._re}>{i._di}</label><br/>
			</div>
			)
	}

	function mudaTela(i: number) {
		setState((e) => ({ ...e, estado: i }))
	}

	function tela() {
		
		if (state.estado === 0) {
			arr = ativas(cur)
			m = remove([...arr])
			const pe = periodo(m)
			state.x = []
			return (
				<div className="teste">
					<div className="salvar" />
					<div className="slides-content">
						<div className="slides">
							<div className="intervalo">Quais mat�rias vc j� fez?</div>
							<div className="MateriasFeitas-content">
								<div className="periodo-content">
									<div className="lista">
										Voc�&nbsp;
										{"fez " + state.names.length + " mat�ria(s)" || " fez Nenhuma mat�ria"}
										<br />
										Voc�&nbsp;
										{"possui " + state.cr.reduce((accumulator, value) => accumulator + value, 0) + " cr�dito(s)" || " n�o possui cr�ditos"}
										{Object.keys(pe).map((a) => { return iDivs(a, pe) })}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="buttom-content">
						<input type="submit" value="Pr�ximo" onClick={() => mudaTela(1)} />
					</div>
				</div>
			)
		}
		else {
			if (state.estado === 1) {
				const cr = state.cr.reduce((accumulator, value) => accumulator + value, 0)
				state.gr = new Grafos(m, cr, state.keys, state.names).matriz()
				const pe = periodo(state.gr)
				let str = ""

				if (Object.keys(pe).length > 0) {
					if (state.x.length === 0)
						str = "Voc� deseja fazer todas as mat�rias"
					else if (state.x.length === state.gr.length)
						str = "Voc� n�o quer estudar este semestre"
					else
						str = "Voc� n�o deseja fazer " + state.x.length + " m�teria(s)"
				}

				return (
					<div className="teste">
						<div className="salvar" />
						<div className="slides-content">
							<div className="slides">
								<div className="intervalo">Quais mat�rias vc n�o quer fazer?</div>
								<div className="MateriasFeitas-content">
									<div className="periodo-content">
										<div className="lista">
											<br />
											{str}
											<br />
											{Object.keys(pe).length > 0 ? Object.keys(pe).map((a) => { return iDivs(a, pe) }) : <h3>Voc� fez todas as mat�rias!</h3>}&nbsp;
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="buttom-content">
							<input type="submit" value="Voltar" onClick={() => mudaTela(0)} />
							{Object.keys(pe).length > 0 ? <input type="submit" value="Pr�ximo" onClick={() => mudaTela(2)} /> : " "}
						</div>
					</div>
				)
			} else {
				const m = [...state.gr]
				let gp: Materia[][] = []
				for (const a of state.x) {
					for (const j in m) {
						if (m[j]._re === a) {
							m.splice(j, 1)
							break
						}
					}
				}

				const es = new Escolhe(m, cur)
				gp = es.exc()
				gp = gp.splice(0, gp.length > 50 ? 50 : gp.length)
				const b = <input type="submit" value="Voltar" onClick={() => mudaTela(1)} />

				return <Comum materias={gp} tela={2} fun={b} cur={cur} separa={false} g={"�"} f={" Grade poss�vel"} />
			}
		}
	}
	return tela()
}

export default GeraGrade
