export type Serie = {
  id: number
  repeticoes: number
  carga: number
}

export type ExercicioCatalogo = {
  id: string
  nome: string
  grupoMuscular: string
  equipamento: string
}

export type Exercicio = {
  id: number
  catalogoId?: string
  nome: string
  grupoMuscular?: string
  equipamento?: string
  series: Serie[]
}

export type Treino = {
  id: number
  nome: string
  data: string
  exercicios: Exercicio[]
}