import CatalogoExercicios from './CatalogoExercicios'

import type {
  ExercicioCatalogo,
  Treino,
} from '../types/treino'

type TreinoDetalhesProps = {
  treino: Treino

  onAdicionarExercicio: (
    exercicio: ExercicioCatalogo
  ) => void

  onExcluirExercicio: (exercicioId: number) => void

  onMoverExercicio: (
    exercicioId: number,
    direcao: 'cima' | 'baixo'
  ) => void
}

function TreinoDetalhes({
  treino,
  onAdicionarExercicio,
  onExcluirExercicio,
  onMoverExercicio,
}: TreinoDetalhesProps) {
  return (
    <section className="treino-selecionado">
      <h2>Ficha: {treino.nome}</h2>

      <p>
        Organize os exercícios aqui. Para registrar
        repetições e cargas, clique em Iniciar treino.
      </p>

      <CatalogoExercicios
        onSelecionar={onAdicionarExercicio}
      />

      <div className="lista-exercicios">
        {treino.exercicios.length === 0 && (
          <p>
            Adicione um exercício pelo catálogo para
            começar a montar sua ficha.
          </p>
        )}

        {treino.exercicios.map((exercicio, index) => (
          <div
            key={exercicio.id}
            className="exercicio"
          >
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
                  <h3>
                    {index + 1}. {exercicio.nome}
                  </h3>

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

              <div className="acoes-exercicio">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label={`Mover ${exercicio.nome} para cima`}
                  onClick={() =>
                    onMoverExercicio(exercicio.id, 'cima')
                  }
                >
                  Subir
                </button>

                <button
                  type="button"
                  disabled={
                    index === treino.exercicios.length - 1
                  }
                  aria-label={`Mover ${exercicio.nome} para baixo`}
                  onClick={() =>
                    onMoverExercicio(exercicio.id, 'baixo')
                  }
                >
                  Descer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onExcluirExercicio(exercicio.id)
                  }
                >
                  Remover da ficha
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TreinoDetalhes