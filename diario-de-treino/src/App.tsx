import { useState } from 'react'
import './App.css'

type Serie = {
  id: number
  exercicio: string
  repeticoes: number
  carga: number
}

function App() {
  const [exercicio, setExercicio] = useState('')
  const [repeticoes, setRepeticoes] = useState('')
  const [carga, setCarga] = useState('')
  const [series, setSeries] = useState<Serie[]>([])

  function adicionarSerie(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!exercicio || !repeticoes || !carga) {
      return
    }

    const novaSerie: Serie = {
      id: Date.now(),
      exercicio,
      repeticoes: Number(repeticoes),
      carga: Number(carga),
    }

    setSeries([...series, novaSerie])

    setExercicio('')
    setRepeticoes('')
    setCarga('')
  }

  return (
    <main className="container">
      <h1>Diário de Treino</h1>

      <form onSubmit={adicionarSerie} className="formulario">
        <label>
          Exercício
          <input
            type="text"
            placeholder="Ex: Supino reto"
            value={exercicio}
            onChange={(event) => setExercicio(event.target.value)}
          />
        </label>

        <label>
          Repetições
          <input
            type="number"
            placeholder="Ex: 10"
            value={repeticoes}
            onChange={(event) => setRepeticoes(event.target.value)}
          />
        </label>

        <label>
          Carga (kg)
          <input
            type="number"
            placeholder="Ex: 40"
            value={carga}
            onChange={(event) => setCarga(event.target.value)}
          />
        </label>

        <button type="submit">Adicionar série</button>
      </form>

      <section>
        <h2>Séries registradas</h2>

        {series.length === 0 ? (
          <p>Nenhuma série registrada.</p>
        ) : (
          <div className="lista-series">
            {series.map((serie) => (
              <div key={serie.id} className="serie">
                <strong>{serie.exercicio}</strong>

                <span>
                  {serie.repeticoes} repetições × {serie.carga} kg
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App