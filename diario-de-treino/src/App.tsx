import { useEffect, useState } from 'react'
import './App.css'

import TreinoLista from './components/TreinoLista'
import TreinoDetalhes from './components/TreinoDetalhes'

import type {
  Exercicio,
  ExercicioCatalogo,
  Serie,
  Treino,
} from './types/treino'

function App() {
  const [treinos, setTreinos] =
    useState<Treino[]>(() => {
      const treinosSalvos =
        localStorage.getItem('treinos')

      if (!treinosSalvos) {
        return []
      }

      return JSON.parse(treinosSalvos)
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
    (treino) =>
      treino.id === treinoAtivoId
  )

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
    if (!treinoAtivoId) {
      return
    }

    const novoExercicio: Exercicio = {
      id: Date.now(),
      catalogoId: exercicioCatalogo.id,
      nome: exercicioCatalogo.nome,
      grupoMuscular:
        exercicioCatalogo.grupoMuscular,
      equipamento:
        exercicioCatalogo.equipamento,
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
              if (
                exercicio.id !== exercicioId
              ) {
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
              if (
                exercicio.id !== exercicioId
              ) {
                return exercicio
              }

              return {
                ...exercicio,

                series: exercicio.series.map(
                  (serie) => {
                    if (
                      serie.id !== serieId
                    ) {
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
              if (
                exercicio.id !== exercicioId
              ) {
                return exercicio
              }

              return {
                ...exercicio,

                series:
                  exercicio.series.filter(
                    (serie) =>
                      serie.id !== serieId
                  ),
              }
            }
          ),
        }
      })
    )
  }

  function excluirExercicio(
    exercicioId: number
  ) {
    setTreinos((treinosAtuais) =>
      treinosAtuais.map((treino) => {
        if (treino.id !== treinoAtivoId) {
          return treino
        }

        return {
          ...treino,

          exercicios:
            treino.exercicios.filter(
              (exercicio) =>
                exercicio.id !== exercicioId
            ),
        }
      })
    )
  }

  function excluirTreino(
    treinoId: number
  ) {
    setTreinos((treinosAtuais) =>
      treinosAtuais.filter(
        (treino) =>
          treino.id !== treinoId
      )
    )

    if (treinoAtivoId === treinoId) {
      setTreinoAtivoId(null)
    }
  }

  return (
    <main className="container">
      <h1>Diário de Treino</h1>

      <TreinoLista
        treinos={treinos}
        treinoAtivoId={treinoAtivoId}
        onCriarTreino={criarTreino}
        onSelecionarTreino={
          setTreinoAtivoId
        }
        onExcluirTreino={excluirTreino}
      />

      {treinoAtivo ? (
        <TreinoDetalhes
          treino={treinoAtivo}
          onAdicionarExercicio={
            adicionarExercicio
          }
          onAdicionarSerie={
            adicionarSerie
          }
          onEditarSerie={editarSerie}
          onExcluirSerie={excluirSerie}
          onExcluirExercicio={
            excluirExercicio
          }
        />
      ) : (
        <p className="mensagem-selecao">
          Crie ou selecione um treino para começar.
        </p>
      )}
    </main>
  )
}

export default App