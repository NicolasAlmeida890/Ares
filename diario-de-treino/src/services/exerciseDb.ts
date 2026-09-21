import type { ExercicioCatalogo } from '../types/treino'

type ExercicioApi = {
  id: string
  slug: string
  name: string
  muscle: string
  bodyPart: string
  equipment: string
  category: string
  secondaryMuscles?: string[]
  instructions?: string[]
  gifUrl: string
}

type RespostaApi = {
  exercises?: ExercicioApi[]
}

const API_URL =
  'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/api/en/exercises.json'

let cache:
  | ExercicioCatalogo[]
  | null = null

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

async function carregarCatalogo():
  Promise<ExercicioCatalogo[]> {
  if (cache) {
    return cache
  }

  const resposta =
    await fetch(API_URL)

  if (!resposta.ok) {
    throw new Error(
      `Erro ao carregar catálogo: ${resposta.status}`
    )
  }

  const dados:
    | ExercicioApi[]
    | RespostaApi =
    await resposta.json()

  const exercicios =
    Array.isArray(dados)
      ? dados
      : dados.exercises ?? []

  cache = exercicios.map(
    (exercicio) => ({
      id: exercicio.id,
      nome: exercicio.name,

      grupoMuscular:
        exercicio.muscle ||
        exercicio.bodyPart ||
        'Não informado',

      equipamento:
        exercicio.equipment ||
        'Peso corporal',

      imagem: exercicio.gifUrl,
    })
  )

  console.log(
    `Catálogo carregado: ${cache.length} exercícios`
  )

  return cache
}

export async function buscarExerciciosExerciseDb(
  termo: string
): Promise<ExercicioCatalogo[]> {
  const busca =
    normalizarTexto(termo)

  if (!busca) {
    return []
  }

  const exercicios =
    await carregarCatalogo()

  return exercicios.filter(
    (exercicio) => {
      const texto =
        normalizarTexto(
          [
            exercicio.nome,
            exercicio.grupoMuscular,
            exercicio.equipamento,
          ].join(' ')
        )

      return texto.includes(busca)
    }
  )
}