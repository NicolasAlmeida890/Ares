import { useEffect,useState } from 'react'
import './App.css'

import ExercicioCard from './components/ExercicioCard'

import type {
  Exercicio,
  Serie,
} from './types/treino'

function App() {
  function limparTreino() {
    setExercicios([])
  }

  const [nomeExercicio, setNomeExercicio] =
    useState('')

  const [exercicios, setExercicios] = useState<Exercicio[]>(() => {
    const dadosSalvos = localStorage.getItem('exercicios')

    if (!dadosSalvos) {
      return []
    }

    return JSON.parse(dadosSalvos)
  })

  useEffect(() => {
    localStorage.setItem(
      'exercicios',
      JSON.stringify(exercicios)
    )
  }, [exercicios])

  function adicionarExercicio(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!nomeExercicio.trim()) {
      return
    }

    const novoExercicio: Exercicio = {
      id: Date.now(),
      nome: nomeExercicio,
      series: [],
    }

    setExercicios([
      ...exercicios,
      novoExercicio,
    ])

    setNomeExercicio('')
  }

  function adicionarSerie(
    exercicioId: number,
    novaSerie: Serie
  ) {
    setExercicios((exerciciosAtuais) =>
      exerciciosAtuais.map((exercicio) => {
        if (exercicio.id === exercicioId) {
          return {
            ...exercicio,
            series: [
              ...exercicio.series,
              novaSerie,
            ],
          }
        }

        return exercicio
      })
    )
  }

  function editarSerie(
    exercicioId: number,
    serieId: number,
    repeticoes: number,
    carga: number
  ) {
    setExercicios((exerciciosAtuais) =>
      exerciciosAtuais.map((exercicio) => {
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
      })
    )
  }

  function excluirSerie(
    exercicioId: number,
    serieId: number
  ) {
    setExercicios((exerciciosAtuais) =>
      exerciciosAtuais.map((exercicio) => {
        if (exercicio.id !== exercicioId) {
          return exercicio
        }

        return {
          ...exercicio,

          series: exercicio.series.filter(
            (serie) => serie.id !== serieId
          ),
        }
      })
    )
  }

  function excluirExercicio(
    exercicioId: number
  ) {
    setExercicios((exerciciosAtuais) =>
      exerciciosAtuais.filter(
        (exercicio) =>
          exercicio.id !== exercicioId
      )
    )
  }

  return (
    <main className="container">
      <h1>Diário de Treino</h1>
      <div className="cabecalho-principal">
        <h1>Diário de Treino</h1>

        {exercicios.length > 0 && (
          <button
            type="button"
            onClick={limparTreino}
          >
            Limpar treino
          </button>
        )}
      </div>

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

      <section className="lista-exercicios">
        {exercicios.length === 0 && (
          <p>Nenhum exercício adicionado.</p>
        )}

        {exercicios.map((exercicio) => (
          <ExercicioCard
            key={exercicio.id}
            exercicio={exercicio}
            onAdicionarSerie={adicionarSerie}
            onEditarSerie={editarSerie}
            onExcluirSerie={excluirSerie}
            onExcluirExercicio={
              excluirExercicio
            }
          />
        ))}
      </section>
    </main>
  )
}

export default App