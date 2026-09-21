import type { ExercicioCatalogo } from '../types/treino'

type ExerciseDbExercise = {
  exerciseId?: string
  id?: string | number
  name?: string

  gifUrl?: string

  target?: string
  targetMuscles?: string[]

  bodyPart?: string
  bodyParts?: string[]

  equipment?: string
  equipments?: string[]
}

type ExerciseDbResponse = {
  data?: ExerciseDbExercise[]
  results?: ExerciseDbExercise[]
  exercises?: ExerciseDbExercise[]
}

const API_ORIGIN =
  ['https:', '', 'oss.exercisedb.dev'].join('/')

const API_URL =
  `${API_ORIGIN}/api/v1/exercises/search`

const MEDIA_ORIGIN =
  ['https:', '', 'static.exercisedb.dev'].join('/')

export async function buscarExerciciosExerciseDb(
  termo: string
): Promise<ExercicioCatalogo[]> {
  const busca = termo.trim()

  if (!busca) {
    return []
  }

  const parametros = new URLSearchParams({
    q: busca,
  })

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
  )

  if (!resposta.ok) {
    throw new Error(
      `Erro ExerciseDB: ${resposta.status} ${resposta.statusText}`
    )
  }

  const dados:
    | ExerciseDbExercise[]
    | ExerciseDbResponse =
    await resposta.json()

  let exercicios: ExerciseDbExercise[]

  if (Array.isArray(dados)) {
    exercicios = dados
  } else {
    exercicios =
      dados.data ??
      dados.results ??
      dados.exercises ??
      []
  }

  return exercicios.flatMap((exercicio) => {
    const id =
      exercicio.exerciseId ??
      (
        exercicio.id !== undefined
          ? String(exercicio.id)
          : ''
      )

    if (!id || !exercicio.name) {
      return []
    }

    const grupoMuscular =
      exercicio.targetMuscles?.join(', ') ||
      exercicio.target ||
      exercicio.bodyParts?.join(', ') ||
      exercicio.bodyPart ||
      'Não informado'

    const equipamento =
      exercicio.equipments?.join(', ') ||
      exercicio.equipment ||
      'Peso corporal'

    const imagem =
      exercicio.gifUrl ||
      `${MEDIA_ORIGIN}/media/${id}.gif`

    return [
      {
        id,
        nome: exercicio.name,
        grupoMuscular,
        equipamento,
        imagem,
      },
    ]
  })
}