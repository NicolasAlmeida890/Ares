export type Serie = {
  id: number
  repeticoes: number
  carga: number
}

export type Exercicio = {
  id: number
  nome: string
  series: Serie[]
}

export type Treino = {
  id: number
  nome: string
  data: string
  exercicios: Exercicio[]
}