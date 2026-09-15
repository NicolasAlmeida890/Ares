import { useState } from 'react'
import './App.css'

type Serie = {
  id: number
  repeticoes: number
  carga: number
}

type Exercicio = {
  id: number
  nome: string
  series: Serie[]
}

function App() {
  const [nomeExercicio, setNomeExercicio] = useState('')
  const [exercicios, setExercicios] = useState<Exercicio[]>([])

  const [repeticoes, setRepeticoes] = useState('')
  const [carga, setCarga] = useState('')

  function adicionarExercicio(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nomeExercicio.trim()) return

    const novoExercicio: Exercicio = {
      id: Date.now(),
      nome: nomeExercicio,
      series: [],
    }

    setExercicios([...exercicios, novoExercicio])
    setNomeExercicio('')
  }

  function adicionarSerie(exercicioId: number) {
    if (!repeticoes || !carga) return

    const novaSerie: Serie = {
      id: Date.now(),
      repeticoes: Number(repeticoes),
      carga: Number(carga),
    }

    const exerciciosAtualizados = exercicios.map((exercicio) => {
      if (exercicio.id === exercicioId) {
        return {
          ...exercicio,
          series: [...exercicio.series, novaSerie],
        }
      }

      return exercicio
    })

    setExercicios(exerciciosAtualizados)

    setRepeticoes('')
    setCarga('')
  }

  return (
    <main className="container">
      <h1>Diário de Treino</h1>

      <form onSubmit={adicionarExercicio} className="formulario">
        <label>
          Exercício
          <input
            type="text"
            placeholder="Ex: Supino reto"
            value={nomeExercicio}
            onChange={(event) => setNomeExercicio(event.target.value)}
          />
        </label>

        <button type="submit">Adicionar exercício</button>
      </form>

      <section className="lista-exercicios">
        {exercicios.length === 0 && (
          <p>Nenhum exercício adicionado.</p>
        )}

        {exercicios.map((exercicio) => (
          <div key={exercicio.id} className="exercicio">
            <h2>{exercicio.nome}</h2>

            <div className="nova-serie">
              <input
                type="number"
                placeholder="Repetições"
                value={repeticoes}
                onChange={(event) => setRepeticoes(event.target.value)}
              />

              <input
                type="number"
                placeholder="Carga (kg)"
                value={carga}
                onChange={(event) => setCarga(event.target.value)}
              />

              <button
                type="button"
                onClick={() => adicionarSerie(exercicio.id)}
              >
                Adicionar série
              </button>
            </div>

            <div className="series">
              {exercicio.series.map((serie, index) => (
                <div key={serie.id} className="serie">
                  <span>Série {index + 1}</span>

                  <span>
                    {serie.repeticoes} reps × {serie.carga} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default App