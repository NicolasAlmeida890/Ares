import { useState } from 'react'
import type { Exercicio, Serie } from '../types/treino'
import SerieItem from './SerieItem'

type ExercicioCardProps = {
  exercicio: Exercicio

  onAdicionarSerie: (
    exercicioId: number,
    novaSerie: Serie
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

function ExercicioCard({
  exercicio,
  onAdicionarSerie,
  onEditarSerie,
  onExcluirSerie,
  onExcluirExercicio,
}: ExercicioCardProps) {
  const [repeticoes, setRepeticoes] =
    useState('')

  const [carga, setCarga] =
    useState('')

  function adicionarSerie() {
    if (!repeticoes || !carga) {
      return
    }

    const novaSerie: Serie = {
      id: Date.now(),
      repeticoes: Number(repeticoes),
      carga: Number(carga),
    }

    onAdicionarSerie(
      exercicio.id,
      novaSerie
    )

    setRepeticoes('')
    setCarga('')
  }

  return (
    <div className="exercicio">
      <div className="cabecalho-exercicio">
        <div className="info-exercicio">
          {exercicio.imagem && (
            <img
              src={exercicio.imagem}
              alt={exercicio.nome}
              className="exercicio-imagem"
            />
          )}

          <div>
            <h2>{exercicio.nome}</h2>

            {(exercicio.grupoMuscular ||
              exercicio.equipamento) && (
              <p className="meta-exercicio">
                {exercicio.grupoMuscular}

                {exercicio.grupoMuscular &&
                  exercicio.equipamento &&
                  ' • '}

                {exercicio.equipamento}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onExcluirExercicio(
              exercicio.id
            )
          }
        >
          Excluir exercício
        </button>
      </div>

      <div className="nova-serie">
        <input
          type="number"
          placeholder="Repetições"
          value={repeticoes}
          onChange={(event) =>
            setRepeticoes(
              event.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Carga (kg)"
          value={carga}
          onChange={(event) =>
            setCarga(
              event.target.value
            )
          }
        />

        <button
          type="button"
          onClick={adicionarSerie}
        >
          Adicionar série
        </button>
      </div>

      <div className="series">
        {exercicio.series.length === 0 && (
          <p>
            Nenhuma série registrada.
          </p>
        )}

        {exercicio.series.map(
          (serie, index) => (
            <SerieItem
              key={serie.id}
              serie={serie}
              numero={index + 1}
              onEditar={(
                serieId,
                repeticoes,
                carga
              ) =>
                onEditarSerie(
                  exercicio.id,
                  serieId,
                  repeticoes,
                  carga
                )
              }
              onExcluir={(serieId) =>
                onExcluirSerie(
                  exercicio.id,
                  serieId
                )
              }
            />
          )
        )}
      </div>
    </div>
  )
}

export default ExercicioCard