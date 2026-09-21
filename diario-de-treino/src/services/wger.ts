import type { ExercicioCatalogo } from '../types/treino'

type WgerTranslation = {
  name: string
}

type WgerMuscle = {
  name: string
  name_en?: string
}

type WgerEquipment = {
  name: string
}

type WgerImage = {
  image: string
  is_main: boolean
}

type WgerExercise = {
  id: number

  category?: {
    name: string
  }

  muscles: WgerMuscle[]
  equipment: WgerEquipment[]
  translations: WgerTranslation[]
  images: WgerImage[]
}

type WgerResponse = {
  count: number
  results: WgerExercise[]
}

const API_URL =
  'https://wger.de/api/v2/exerciseinfo/'

export async function buscarExerciciosWger(
  termo: string
): Promise<ExercicioCatalogo[]> {
  const parametros = new URLSearchParams({
    limit: '30',
    'language__code': 'pt-br',
    'name__search': termo.trim(),
  })

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
  )

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível carregar os exercícios.'
    )
  }

  const dados: WgerResponse =
    await resposta.json()

  return dados.results.flatMap((exercicio) => {
    const traducao = exercicio.translations[0]

    if (!traducao?.name) {
      return []
    }

    const imagemPrincipal =
      exercicio.images.find(
        (imagem) => imagem.is_main
      ) ?? exercicio.images[0]

    const grupoMuscular =
      exercicio.muscles
        .map(
          (musculo) =>
            musculo.name_en || musculo.name
        )
        .join(', ') ||
      exercicio.category?.name ||
      'Não informado'

    const equipamento =
      exercicio.equipment
        .map((item) => item.name)
        .join(', ') || 'Peso corporal'

    return [
      {
        id: String(exercicio.id),
        nome: traducao.name,
        grupoMuscular,
        equipamento,
        imagem: imagemPrincipal?.image,
      },
    ]
  })
}