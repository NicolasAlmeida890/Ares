import type { SessaoTreino } from '../types/treino'

type ResumoSessaoProps = {
  sessao: SessaoTreino
}

function ResumoSessao({ sessao }: ResumoSessaoProps) {
  const exerciciosRealizados = sessao.exercicios.filter(
    (exercicio) => exercicio.series.length > 0
  )

  const todasAsSeries = sessao.exercicios.flatMap(
    (exercicio) => exercicio.series
  )

  const volumeTotal = todasAsSeries.reduce(
    (total, serie) =>
      total + serie.repeticoes * serie.carga,
    0
  )

  const inicio = new Date(sessao.iniciadaEm).getTime()

  const fim = sessao.finalizadaEm
    ? new Date(sessao.finalizadaEm).getTime()
    : null

  const duracaoSegundos =
    fim !== null &&
    Number.isFinite(inicio) &&
    Number.isFinite(fim)
      ? Math.max(0, Math.floor((fim - inicio) / 1000))
      : null

  function formatarDuracao(segundos: number) {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)

    if (horas > 0) {
      return `${horas} h ${minutos} min`
    }

    if (minutos > 0) {
      return `${minutos} min`
    }

    return `${segundos} s`
  }

  return (
    <div className="resumo-sessao">
      <p>
        <strong>Duração: </strong>
        {duracaoSegundos === null
          ? 'Não disponível'
          : formatarDuracao(duracaoSegundos)}
      </p>

      <p>
        <strong>Exercícios realizados: </strong>
        {exerciciosRealizados.length}
      </p>

      <p>
        <strong>Séries registradas: </strong>
        {todasAsSeries.length}
      </p>

      <p>
        <strong>Volume registrado: </strong>
        {volumeTotal.toLocaleString('pt-BR', {
          maximumFractionDigits: 2,
        })}{' '}
        kg
      </p>
    </div>
  )
}

export default ResumoSessao