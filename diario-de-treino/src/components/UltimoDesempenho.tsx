import type {
  Exercicio,
  SessaoTreino,
} from '../types/treino'

type UltimoDesempenhoProps = {
  exercicio: Exercicio
  treinoId: number
  historico: SessaoTreino[]
}

function UltimoDesempenho({
  exercicio,
  treinoId,
  historico,
}: UltimoDesempenhoProps) {
  function encontrarExercicio(sessao: SessaoTreino) {
    return sessao.exercicios.find((anterior) => {
      const mesmoExercicio =
        exercicio.catalogoId && anterior.catalogoId
          ? exercicio.catalogoId === anterior.catalogoId
          : exercicio.id === anterior.id

      return mesmoExercicio && anterior.series.length > 0
    })
  }

  const ultimaSessao = historico
    .filter(
      (sessao) =>
        sessao.treinoId === treinoId &&
        sessao.finalizadaEm !== null &&
        encontrarExercicio(sessao) !== undefined
    )
    .sort(
      (a, b) =>
        new Date(b.iniciadaEm).getTime() -
        new Date(a.iniciadaEm).getTime()
    )[0]

  const exercicioAnterior = ultimaSessao
    ? encontrarExercicio(ultimaSessao)
    : undefined

  if (!ultimaSessao || !exercicioAnterior) {
    return (
      <p>
        Ainda não há séries anteriores deste exercício
        neste treino.
      </p>
    )
  }

  return (
    <aside className="ultimo-desempenho">
      <strong>
        Última vez neste treino —{' '}
        {new Date(
          ultimaSessao.iniciadaEm
        ).toLocaleDateString('pt-BR')}
      </strong>

      <ul>
        {exercicioAnterior.series.map((serie, index) => (
          <li key={serie.id}>
            Série {index + 1}: {serie.repeticoes} reps
            {' × '}
            {serie.carga} kg
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default UltimoDesempenho