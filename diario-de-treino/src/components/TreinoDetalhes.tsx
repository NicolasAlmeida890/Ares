import CatalogoExercicios from './CatalogoExercicios'
import ExercicioCard from './ExercicioCard'

import type {
  ExercicioCatalogo,
  Serie,
  Treino,
} from '../types/treino'

type TreinoDetalhesProps = {
  treino: Treino

  onAdicionarExercicio: (
    exercicio: ExercicioCatalogo
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
  return (
    <section className="treino-selecionado">
      <h2>{treino.nome}</h2>

      <p>
        {new Date(
          treino.data
        ).toLocaleDateString('pt-BR')}
      </p>

      <CatalogoExercicios
        onSelecionar={onAdicionarExercicio}
      />

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