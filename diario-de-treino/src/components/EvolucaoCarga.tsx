import { useState } from 'react'

import type {
  Exercicio,
  SessaoTreino,
} from '../types/treino'

type EvolucaoCargaProps = {
  treinoId: number
  exercicios: Exercicio[]
  historico: SessaoTreino[]
}

function formatarCarga(carga: number) {
  return carga.toLocaleString('pt-BR', {
    maximumFractionDigits: 2,
  })
}

function EvolucaoCarga({
  treinoId,
  exercicios,
  historico,
}: EvolucaoCargaProps) {
  const [exercicioId, setExercicioId] = useState<number | null>(
    exercicios[0]?.id ?? null
  )

  const exercicioSelecionado =
    exercicios.find(
      (exercicio) => exercicio.id === exercicioId
    ) ?? exercicios[0]

  if (!exercicioSelecionado) {
    return null
  }

  const registros = historico
    .filter(
      (sessao) =>
        sessao.treinoId === treinoId &&
        Boolean(sessao.finalizadaEm) &&
        Number.isFinite(
          new Date(sessao.iniciadaEm).getTime()
        )
    )
    .flatMap((sessao) => {
      const exercicioAnterior = sessao.exercicios.find(
        (anterior) => {
          if (
            exercicioSelecionado.catalogoId &&
            anterior.catalogoId
          ) {
            return (
              exercicioSelecionado.catalogoId ===
              anterior.catalogoId
            )
          }

          return exercicioSelecionado.id === anterior.id
        }
      )

      if (!exercicioAnterior) {
        return []
      }

      const seriesValidas = exercicioAnterior.series.filter(
        (serie) =>
          Number.isInteger(serie.repeticoes) &&
          serie.repeticoes > 0 &&
          Number.isFinite(serie.carga) &&
          serie.carga >= 0
      )

      if (seriesValidas.length === 0) {
        return []
      }

      const maiorCarga = seriesValidas.reduce(
        (maior, serie) => Math.max(maior, serie.carga),
        0
      )

      return [
        {
          sessaoId: sessao.id,
          data: sessao.iniciadaEm,
          maiorCarga,
          quantidadeSeries: seriesValidas.length,
        },
      ]
    })
    .sort(
      (a, b) =>
        new Date(a.data).getTime() -
        new Date(b.data).getTime()
    )

  const ultima = registros[registros.length - 1]
  const anterior = registros[registros.length - 2]

  const maiorCargaRegistrada = registros.reduce(
    (maior, registro) =>
      Math.max(maior, registro.maiorCarga),
    0
  )

  const diferenca =
    ultima && anterior
      ? ultima.maiorCarga - anterior.maiorCarga
      : null

  const textoDiferenca =
    diferenca === null
      ? 'Primeiro registro'
      : `${diferenca > 0 ? '+' : ''}${formatarCarga(diferenca)} kg`

  return (
    <details className="evolucao-exercicio">
      <summary>Evolução de cargas</summary>

      <div className="conteudo-evolucao">
        <p>
          Consulte a maior carga registrada por sessão
          nesta ficha.
        </p>

        <label className="seletor-evolucao">
          Exercício
          <select
            value={exercicioSelecionado.id}
            onChange={(event) =>
              setExercicioId(Number(event.target.value))
            }
          >
            {exercicios.map((exercicio, index) => (
              <option
                key={exercicio.id}
                value={exercicio.id}
              >
                {index + 1}. {exercicio.nome}
              </option>
            ))}
          </select>
        </label>

        {ultima ? (
          <>
            <div className="metricas-evolucao">
              <p className="metrica-evolucao">
                <strong>Maior carga na última sessão</strong>
                <span>
                  {formatarCarga(ultima.maiorCarga)} kg
                </span>
              </p>

              <p className="metrica-evolucao">
                <strong>Maior carga registrada</strong>
                <span>
                  {formatarCarga(maiorCargaRegistrada)} kg
                </span>
              </p>

              <p className="metrica-evolucao">
                <strong>Diferença para a sessão anterior</strong>
                <span>{textoDiferenca}</span>
              </p>
            </div>

            <table className="tabela-evolucao">
              <caption>
                Últimas cinco sessões com séries deste exercício
              </caption>

              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Maior carga</th>
                  <th scope="col">Séries</th>
                </tr>
              </thead>

              <tbody>
                {registros
                  .slice(-5)
                  .reverse()
                  .map((registro) => (
                    <tr key={registro.sessaoId}>
                      <td>
                        {new Date(
                          registro.data
                        ).toLocaleDateString('pt-BR')}
                      </td>

                      <td>
                        {formatarCarga(registro.maiorCarga)} kg
                      </td>

                      <td>{registro.quantidadeSeries}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="mensagem-evolucao">
            Finalize uma sessão com séries deste exercício
            para acompanhar suas cargas aqui.
          </p>
        )}
      </div>
    </details>
  )
}

export default EvolucaoCarga