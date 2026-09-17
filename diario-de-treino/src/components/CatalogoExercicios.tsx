 import { useState } from 'react'

import { exerciciosCatalogo } from '../data/exercicios'

import type {
  ExercicioCatalogo,
} from '../types/treino'

type CatalogoExerciciosProps = {
  onSelecionar: (
    exercicio: ExercicioCatalogo
  ) => void
}

function CatalogoExercicios({
  onSelecionar,
}: CatalogoExerciciosProps) {
  const [busca, setBusca] = useState('')

  const buscaNormalizada =
    busca.toLowerCase().trim()

  const exerciciosFiltrados =
    exerciciosCatalogo.filter((exercicio) => {
      return (
        exercicio.nome
          .toLowerCase()
          .includes(buscaNormalizada) ||
        exercicio.grupoMuscular
          .toLowerCase()
          .includes(buscaNormalizada) ||
        exercicio.equipamento
          .toLowerCase()
          .includes(buscaNormalizada)
      )
    })

  return (
    <section className="catalogo">
      <h3>Adicionar exercício</h3>

      <input
        type="text"
        placeholder="Pesquisar exercício, músculo ou equipamento..."
        value={busca}
        onChange={(event) =>
          setBusca(event.target.value)
        }
      />

      <div className="catalogo-grid">
        {exerciciosFiltrados.map(
          (exercicio) => (
            <div
              key={exercicio.id}
              className="catalogo-item"
            >
              <div>
                <strong>
                  {exercicio.nome}
                </strong>

                <p>
                  {exercicio.grupoMuscular}
                  {' • '}
                  {exercicio.equipamento}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onSelecionar(exercicio)
                }
              >
                Adicionar
              </button>
            </div>
          )
        )}

        {exerciciosFiltrados.length === 0 && (
          <p>Nenhum exercício encontrado.</p>
        )}
      </div>
    </section>
  )
}

export default CatalogoExercicios