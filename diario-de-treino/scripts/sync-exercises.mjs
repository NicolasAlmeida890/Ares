import fs from 'node:fs/promises'

const API_URL =
  'https://oss.exercisedb.dev/api/v1/exercises'

const OUTPUT =
  './public/data/exercises.json'

function esperar(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  )
}

async function buscarPagina(cursor) {
  const parametros = new URLSearchParams({
    limit: '100',
  })

  if (cursor) {
    parametros.set('cursor', cursor)
  }

  const resposta = await fetch(
    `${API_URL}?${parametros.toString()}`
  )

  if (resposta.status === 429) {
    console.log(
      'Limite atingido. Esperando 5 segundos...'
    )

    await esperar(5000)

    return buscarPagina(cursor)
  }

  if (!resposta.ok) {
    throw new Error(
      `Erro ${resposta.status}: ${resposta.statusText}`
    )
  }

  return resposta.json()
}

async function executar() {
  console.log('Sincronizando exercícios...')

  const exercicios = new Map()
  const cursoresUsados = new Set()

  let cursor
  let pagina = 1
  let totalEsperado

  while (true) {
    if (cursor) {
      if (cursoresUsados.has(cursor)) {
        console.log(
          'Cursor repetido detectado. Encerrando sincronização.'
        )
        break
      }

      cursoresUsados.add(cursor)
    }

    const dados =
      await buscarPagina(cursor)

    if (
      totalEsperado === undefined &&
      dados.meta?.total
    ) {
      totalEsperado =
        dados.meta.total

      console.log(
        `Total informado pela API: ${totalEsperado}`
      )
    }

    for (const exercicio of dados.data ?? []) {
      exercicios.set(
        exercicio.exerciseId,
        {
          id: exercicio.exerciseId,
          nome: exercicio.name,

          grupoMuscular:
            exercicio.targetMuscles?.join(', ') ||
            exercicio.bodyParts?.join(', ') ||
            'Não informado',

          equipamento:
            exercicio.equipments?.join(', ') ||
            'Peso corporal',

          imagem: exercicio.gifUrl,

          bodyParts:
            exercicio.bodyParts ?? [],

          targetMuscles:
            exercicio.targetMuscles ?? [],

          secondaryMuscles:
            exercicio.secondaryMuscles ?? [],

          instructions:
            exercicio.instructions ?? [],
        }
      )
    }

    console.log(
      `Página ${pagina}: ${dados.data?.length ?? 0} recebidos | ${exercicios.size} únicos`
    )

    if (
      totalEsperado &&
      exercicios.size >= totalEsperado
    ) {
      console.log(
        'Total de exercícios atingido.'
      )
      break
    }

    if (
      !dados.meta?.hasNextPage ||
      !dados.meta?.nextCursor
    ) {
      console.log(
        'Não há mais páginas.'
      )
      break
    }

    cursor =
      dados.meta.nextCursor

    pagina++

    await esperar(1500)
  }

  const resultado =
    Array.from(exercicios.values())

  await fs.mkdir(
    './public/data',
    {
      recursive: true,
    }
  )

  await fs.writeFile(
    OUTPUT,
    JSON.stringify(
      resultado,
      null,
      2
    ),
    'utf-8'
  )

  console.log('')
  console.log(
    `Pronto: ${resultado.length} exercícios únicos salvos.`
  )

  console.log(
    `Arquivo: ${OUTPUT}`
  )
}

executar().catch((erro) => {
  console.error(erro)
  process.exit(1)
})