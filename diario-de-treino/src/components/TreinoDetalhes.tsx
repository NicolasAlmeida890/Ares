import { useState } from 'react'
import CatalogoExercicios from './CatalogoExercicios'
import EditarNomeTreino from './EditarNomeTreino'

import type {
  ExercicioCatalogo,
  Treino,
} from '../types/treino'

type TreinoDetalhesProps = {
  treino: Treino

  onRenomear: (nome: string) => void
  onDuplicar: () => void

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
  onRenomear,
  onDuplicar,
  onAdicionarExercicio,
  onExcluirExercicio,
  onMoverExercicio,
}: TreinoDetalhesProps) {
  const [editando, setEditando] = useState(false)

  return (
    <section className="treino-selecionado">
      <h2>Ficha: {treino.nome}</h2>

      <p>
        {editando
          ? 'Adicione, remova ou reorganize os exercícios da ficha.'
          : 'Confira os exercícios da sua ficha. Para registrar séries, clique em Iniciar treino.'}
      </p>

      <div className="acoes-ficha">
        <button
          type="button"
          onClick={() =>
            setEditando((valorAtual) => !valorAtual)
          }
        >
          {editando ? 'Concluir edição' : 'Editar ficha'}
        </button>

        {!editando && (
          <button
            type="button"
            className="botao-secundario"
            onClick={onDuplicar}
          >
            Duplicar ficha
          </button>
        )}
      </div>

      {editando && (
        <div className="edicao-ficha">
          <EditarNomeTreino
            nomeAtual={treino.nome}
            onSalvar={onRenomear}
          />

          <CatalogoExercicios
            onSelecionar={onAdicionarExercicio}
          />
        </div>
      )}

      <div className="lista-exercicios">
        {treino.exercicios.length === 0 && (
          <p>
            {editando
              ? 'Adicione um exercício pelo catálogo para começar a montar sua ficha.'
              : 'Esta ficha está vazia. Clique em Editar ficha para adicionar exercícios.'}
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

              {editando && (
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
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TreinoDetalhes