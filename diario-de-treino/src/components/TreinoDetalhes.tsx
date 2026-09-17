import { useState } from 'react'

import ExercicioCard from './ExercicioCard'

import type {
  Serie,
  Treino,
} from '../types/treino'

type TreinoDetalhesProps = {
  treino: Treino

  onAdicionarExercicio: (
    nome: string
  ) => void

  onAdicionarSerie: (
    exercicioId: number,
    serie: Serie
  ) => void

  onEditarSerie: (
    exercicioId: number,
    serieId: number,
    repeticoes: number,
    carga: number
  ) => void

  onExcluirSerie: (
    exercicioId: number,
    serieId: number
  ) => void

  onExcluirExercicio: (
    exercicioId: number
  ) => void
}

function TreinoDetalhes({
  treino,
  onAdicionarExercicio,
  onAdicionarSerie,
  onEditarSerie,
  onExcluirSerie,
  onExcluirExercicio,
}: TreinoDetalhesProps) {
  const [nomeExercicio, setNomeExercicio] =
    useState('')

  function enviarExercicio(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!nomeExercicio.trim()) {
      return
    }

    onAdicionarExercicio(nomeExercicio)

    setNomeExercicio('')
  }

  return (
    <section className="treino-selecionado">
      <h2>{treino.nome}</h2>

      <p>
        {new Date(
          treino.data
        ).toLocaleDateString('pt-BR')}
      </p>

      <form
        onSubmit={enviarExercicio}
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
        {treino.exercicios.length === 0 && (
          <p>
            Nenhum exercício adicionado neste treino.
          </p>
        )}

        {treino.exercicios.map((exercicio) => (
          <ExercicioCard
            key={exercicio.id}
            exercicio={exercicio}
            onAdicionarSerie={onAdicionarSerie}
            onEditarSerie={onEditarSerie}
            onExcluirSerie={onExcluirSerie}
            onExcluirExercicio={
              onExcluirExercicio
            }
          />
        ))}
      </div>
    </section>
  )
}

export default TreinoDetalhes