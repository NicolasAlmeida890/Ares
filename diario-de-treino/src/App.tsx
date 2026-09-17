import { useEffect, useState } from 'react'
import './App.css'

import ExercicioCard from './components/ExercicioCard'

import type {
  Exercicio,
  Serie,
  Treino,
} from './types/treino'

function App() {
  const [nomeTreino, setNomeTreino] = useState('')
  const [nomeExercicio, setNomeExercicio] = useState('')

  const [treinos, setTreinos] = useState<Treino[]>(() => {
    const treinosSalvos = localStorage.getItem('treinos')

    if (treinosSalvos) {
      return JSON.parse(treinosSalvos)
    }

    return []
  })

  const [treinoAtivoId, setTreinoAtivoId] =
    useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem(
      'treinos',
      JSON.stringify(treinos)
    )
  }, [treinos])

  const treinoAtivo = treinos.find(
    (treino) => treino.id === treinoAtivoId
  )

  function criarTreino(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!nomeTreino.trim()) {
      return
    }

    const novoTreino: Treino = {
      id: Date.now(),
      nome: nomeTreino,
      data: new Date().toISOString(),
      exercicios: [],
    }

    setTreinos((treinosAtuais) => [
      ...treinosAtuais,
      novoTreino,
    ])

    setTreinoAtivoId(novoTreino.id)
    setNomeTreino('')
  }

  function adicionarExercicio(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!nomeExercicio.trim() || !treinoAtivoId) {
      return
    }

    const novoExercicio: Exercicio = {
      id: Date.now(),
      nome: nomeExercicio,
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

    setNomeExercicio('')
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
                series: [
                  ...exercicio.series,
                  novaSerie,
                ],
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

                series: exercicio.series.map(
                  (serie) => {
                    if (serie.id !== serieId) {
                      return serie
                    }

                    return {
                      ...serie,
                      repeticoes,
                      carga,
                    }
                  }
                ),
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
            (exercicio) =>
              exercicio.id !== exercicioId
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

      <section className="secao-treinos">
        <h2>Meus treinos</h2>

        <form
          onSubmit={criarTreino}
          className="formulario"
        >
          <label>
            Nome do treino

            <input
              type="text"
              placeholder="Ex: Treino A - Peito"
              value={nomeTreino}
              onChange={(event) =>
                setNomeTreino(event.target.value)
              }
            />
          </label>

          <button type="submit">
            Criar treino
          </button>
        </form>

        <div className="lista-treinos">
          {treinos.length === 0 && (
            <p>Nenhum treino criado.</p>
          )}

          {treinos.map((treino) => (
            <div
              key={treino.id}
              className={`treino-item ${
                treino.id === treinoAtivoId
                  ? 'treino-ativo'
                  : ''
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setTreinoAtivoId(treino.id)
                }
              >
                {treino.nome}
              </button>

              <button
                type="button"
                onClick={() =>
                  excluirTreino(treino.id)
                }
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </section>

      {treinoAtivo ? (
        <section className="treino-selecionado">
          <h2>{treinoAtivo.nome}</h2>

          <p>
            {new Date(
              treinoAtivo.data
            ).toLocaleDateString('pt-BR')}
          </p>

          <form
            onSubmit={adicionarExercicio}
            className="formulario"
          >
            <label>
              Exercício

              <input
                type="text"
                placeholder="Ex: Supino reto"
                value={nomeExercicio}
                onChange={(event) =>
                  setNomeExercicio(
                    event.target.value
                  )
                }
              />
            </label>

            <button type="submit">
              Adicionar exercício
            </button>
          </form>

          <div className="lista-exercicios">
            {treinoAtivo.exercicios.length === 0 && (
              <p>
                Nenhum exercício adicionado
                neste treino.
              </p>
            )}

            {treinoAtivo.exercicios.map(
              (exercicio) => (
                <ExercicioCard
                  key={exercicio.id}
                  exercicio={exercicio}
                  onAdicionarSerie={
                    adicionarSerie
                  }
                  onEditarSerie={editarSerie}
                  onExcluirSerie={excluirSerie}
                  onExcluirExercicio={
                    excluirExercicio
                  }
                />
              )
            )}
          </div>
        </section>
      ) : (
        <p className="mensagem-selecao">
          Crie ou selecione um treino para começar.
        </p>
      )}
    </main>
  )
}

export default App