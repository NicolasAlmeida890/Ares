import ExercicioCard from './components/ExercicioCard'
import { useEffect, useState } from 'react'
import './App.css'

import TreinoLista from './components/TreinoLista'
import TreinoDetalhes from './components/TreinoDetalhes'

import type {
  Exercicio,
  ExercicioCatalogo,
  Serie,
  Treino,
  SessaoTreino,
} from './types/treino'

function App() {
  const [treinos, setTreinos] = useState<Treino[]>(() => {
    const treinosSalvos = localStorage.getItem('treinos')

    return treinosSalvos ? JSON.parse(treinosSalvos) : []
  })

  const [treinoAtivoId, setTreinoAtivoId] =
    useState<number | null>(null)

  const [sessaoAtual, setSessaoAtual] =
    useState<SessaoTreino | null>(() => {
      const sessaoSalva =
        localStorage.getItem('ares:sessaoAtual')

      return sessaoSalva ? JSON.parse(sessaoSalva) : null
    })

  useEffect(() => {
    localStorage.setItem('treinos', JSON.stringify(treinos))
  }, [treinos])

  useEffect(() => {
    if (sessaoAtual) {
      localStorage.setItem(
        'ares:sessaoAtual',
        JSON.stringify(sessaoAtual)
      )
    } else {
      localStorage.removeItem('ares:sessaoAtual')
    }
  }, [sessaoAtual])

  const [historico, setHistorico] =
    useState<SessaoTreino[]>(() => {
      const historicoSalvo =
        localStorage.getItem('ares:historico')

      return historicoSalvo
        ? JSON.parse(historicoSalvo)
        : []
    })

  useEffect(() => {
    localStorage.setItem(
      'ares:historico',
      JSON.stringify(historico)
    )
  }, [historico])

  const treinoAtivo = treinos.find(
    (treino) => treino.id === treinoAtivoId
  )

  function iniciarTreino() {
    if (
      !treinoAtivo ||
      sessaoAtual ||
      treinoAtivo.exercicios.length === 0
    ) {
      return
    }

    const novaSessao: SessaoTreino = {
      id: Date.now(),
      treinoId: treinoAtivo.id,
      nomeTreino: treinoAtivo.nome,
      iniciadaEm: new Date().toISOString(),
      finalizadaEm: null,

      exercicios: treinoAtivo.exercicios.map(
        (exercicio) => ({
          ...exercicio,
          series: [],
        })
      ),
    }

    setSessaoAtual(novaSessao)
  }

  function adicionarSerieNaSessao(
    exercicioId: number,
    novaSerie: Serie
  ) {
    setSessaoAtual((sessao) => {
      if (!sessao) {
        return null
      }

      return {
        ...sessao,
        exercicios: sessao.exercicios.map((exercicio) => {
          if (exercicio.id !== exercicioId) {
            return exercicio
          }

          return {
            ...exercicio,
            series: [...exercicio.series, novaSerie],
          }
        }),
      }
    })
  }

  function editarSerieNaSessao(
    exercicioId: number,
    serieId: number,
    repeticoes: number,
    carga: number
  ) {
    setSessaoAtual((sessao) => {
      if (!sessao) {
        return null
      }

      return {
        ...sessao,
        exercicios: sessao.exercicios.map((exercicio) => {
          if (exercicio.id !== exercicioId) {
            return exercicio
          }

          return {
            ...exercicio,
            series: exercicio.series.map((serie) =>
              serie.id === serieId
                ? { ...serie, repeticoes, carga }
                : serie
            ),
          }
        }),
      }
    })
  }

  function excluirSerieDaSessao(
    exercicioId: number,
    serieId: number
  ) {
    setSessaoAtual((sessao) => {
      if (!sessao) {
        return null
      }

      return {
        ...sessao,
        exercicios: sessao.exercicios.map((exercicio) => {
          if (exercicio.id !== exercicioId) {
            return exercicio
          }

          return {
            ...exercicio,
            series: exercicio.series.filter(
              (serie) => serie.id !== serieId
            ),
          }
        }),
      }
    })
  }

  function excluirExercicioDaSessao(exercicioId: number) {
    setSessaoAtual((sessao) => {
      if (!sessao) {
        return null
      }

      return {
        ...sessao,
        exercicios: sessao.exercicios.filter(
          (exercicio) => exercicio.id !== exercicioId
        ),
      }
    })
  }

  function finalizarTreino() {
    if (!sessaoAtual) {
      return
    }

    const temSeries = sessaoAtual.exercicios.some(
      (exercicio) => exercicio.series.length > 0
    )

    if (!temSeries) {
      window.alert(
        'Registre pelo menos uma série antes de finalizar.'
      )
      return
    }

    const sessaoFinalizada: SessaoTreino = {
      ...sessaoAtual,
      finalizadaEm: new Date().toISOString(),
    }

    setHistorico((historicoAtual) => [
      sessaoFinalizada,
      ...historicoAtual.filter(
        (sessao) => sessao.id !== sessaoFinalizada.id
      ),
    ])

    setSessaoAtual(null)
  }

  function cancelarTreino() {
    const confirmou = window.confirm(
      'Descartar esta sessão? A ficha e o histórico serão mantidos.'
    )

    if (confirmou) {
      setSessaoAtual(null)
    }
  }

  function criarTreino(nome: string) {
    const novoTreino: Treino = {
      id: Date.now(),
      nome,
      data: new Date().toISOString(),
      exercicios: [],
    }

    setTreinos((treinosAtuais) => [
      ...treinosAtuais,
      novoTreino,
    ])

    setTreinoAtivoId(novoTreino.id)
  }

  function adicionarExercicio(
    exercicioCatalogo: ExercicioCatalogo
  ) {
    if (treinoAtivoId === null) {
      return
    }

    const novoExercicio: Exercicio = {
      id: Date.now(),
      catalogoId: exercicioCatalogo.id,
      nome: exercicioCatalogo.nome,
      grupoMuscular: exercicioCatalogo.grupoMuscular,
      equipamento: exercicioCatalogo.equipamento,
      imagem: exercicioCatalogo.imagem,
      series: [],
    }

    setTreinos((treinosAtuais) =>
      treinosAtuais.map((treino) => {
        if (treino.id !== treinoAtivoId) {
          return treino
        }

        return {
          ...treino,
          exercicios: [
            ...treino.exercicios,
            novoExercicio,
          ],
        }
      })
    )
  }

  function adicionarSerie(
    exercicioId: number,
    novaSerie: Serie
  ) {
    setTreinos((treinosAtuais) =>
      treinosAtuais.map((treino) => {
        if (treino.id !== treinoAtivoId) {
          return treino
        }

        return {
          ...treino,
          exercicios: treino.exercicios.map(
            (exercicio) => {
              if (exercicio.id !== exercicioId) {
                return exercicio
              }

              return {
                ...exercicio,
                series: [...exercicio.series, novaSerie],
              }
            }
          ),
        }
      })
    )
  }

  function editarSerie(
    exercicioId: number,
    serieId: number,
    repeticoes: number,
    carga: number
  ) {
    setTreinos((treinosAtuais) =>
      treinosAtuais.map((treino) => {
        if (treino.id !== treinoAtivoId) {
          return treino
        }

        return {
          ...treino,
          exercicios: treino.exercicios.map(
            (exercicio) => {
              if (exercicio.id !== exercicioId) {
                return exercicio
              }

              return {
                ...exercicio,
                series: exercicio.series.map((serie) => {
                  if (serie.id !== serieId) {
                    return serie
                  }

                  return {
                    ...serie,
                    repeticoes,
                    carga,
                  }
                }),
              }
            }
          ),
        }
      })
    )
  }

  function excluirSerie(
    exercicioId: number,
    serieId: number
  ) {
    setTreinos((treinosAtuais) =>
      treinosAtuais.map((treino) => {
        if (treino.id !== treinoAtivoId) {
          return treino
        }

        return {
          ...treino,
          exercicios: treino.exercicios.map(
            (exercicio) => {
              if (exercicio.id !== exercicioId) {
                return exercicio
              }

              return {
                ...exercicio,
                series: exercicio.series.filter(
                  (serie) => serie.id !== serieId
                ),
              }
            }
          ),
        }
      })
    )
  }

  function excluirExercicio(exercicioId: number) {
    setTreinos((treinosAtuais) =>
      treinosAtuais.map((treino) => {
        if (treino.id !== treinoAtivoId) {
          return treino
        }

        return {
          ...treino,
          exercicios: treino.exercicios.filter(
            (exercicio) => exercicio.id !== exercicioId
          ),
        }
      })
    )
  }

  function excluirTreino(treinoId: number) {
    setTreinos((treinosAtuais) =>
      treinosAtuais.filter(
        (treino) => treino.id !== treinoId
      )
    )

    if (treinoAtivoId === treinoId) {
      setTreinoAtivoId(null)
    }
  }

  return (
    <main className="container">
      <h1>Diário de Treino</h1>

      {sessaoAtual ? (
        <section className="sessao-atual">
          <h2>
            Em andamento: {sessaoAtual.nomeTreino}
          </h2>

          <p>
            Iniciado em{' '}
            {new Date(
              sessaoAtual.iniciadaEm
            ).toLocaleString('pt-BR')}
          </p>

          <div className="lista-exercicios">
            {sessaoAtual.exercicios.length === 0 && (
              <p>
                Nenhum exercício nesta sessão.
                Você pode cancelá-la e começar novamente.
              </p>
            )}

            {sessaoAtual.exercicios.map((exercicio) => (
              <ExercicioCard
                key={`${sessaoAtual.id}-${exercicio.id}`}
                exercicio={exercicio}
                onAdicionarSerie={adicionarSerieNaSessao}
                onEditarSerie={editarSerieNaSessao}
                onExcluirSerie={excluirSerieDaSessao}
                onExcluirExercicio={excluirExercicioDaSessao}
              />
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={finalizarTreino}
            >
              Finalizar treino
            </button>

            <button
              type="button"
              onClick={cancelarTreino}
            >
              Cancelar sessão
            </button>
          </div>
        </section>
      ) : (
        <>
          <TreinoLista
            treinos={treinos}
            treinoAtivoId={treinoAtivoId}
            onCriarTreino={criarTreino}
            onSelecionarTreino={setTreinoAtivoId}
            onExcluirTreino={excluirTreino}
          />

          {treinoAtivo ? (
            <>
              <button
                type="button"
                onClick={iniciarTreino}
                disabled={
                  treinoAtivo.exercicios.length === 0
                }
              >
                Iniciar treino
              </button>

              <TreinoDetalhes
                treino={treinoAtivo}
                onAdicionarExercicio={adicionarExercicio}
                onAdicionarSerie={adicionarSerie}
                onEditarSerie={editarSerie}
                onExcluirSerie={excluirSerie}
                onExcluirExercicio={excluirExercicio}
              />
            </>
          ) : (
            <p className="mensagem-selecao">
              Crie ou selecione um treino para começar.
            </p>
          )}
        </>
      )}

      <section className="historico">
        <h2>Histórico de treinos</h2>

        {historico.length === 0 && (
          <p>Nenhum treino finalizado ainda.</p>
        )}

        {historico.map((sessao) => (
          <details
            key={sessao.id}
            className="exercicio"
          >
            <summary>
              {sessao.nomeTreino} —{' '}
              {new Date(
                sessao.iniciadaEm
              ).toLocaleString('pt-BR')}
            </summary>

            {sessao.finalizadaEm && (
              <p>
                Finalizado em{' '}
                {new Date(
                  sessao.finalizadaEm
                ).toLocaleString('pt-BR')}
              </p>
            )}

            {sessao.exercicios.map((exercicio) => (
              <div key={exercicio.id}>
                <h3>{exercicio.nome}</h3>

                {exercicio.series.length === 0 ? (
                  <p>Nenhuma série registrada.</p>
                ) : (
                  <ul>
                    {exercicio.series.map(
                      (serie, index) => (
                        <li key={serie.id}>
                          Série {index + 1}:{' '}
                          {serie.repeticoes} repetições
                          {' × '}
                          {serie.carga} kg
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}
          </details>
        ))}
      </section>
    </main>
  )
}

export default App