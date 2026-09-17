import { useState } from 'react'
import type { Treino } from '../types/treino'

type TreinoListaProps = {
  treinos: Treino[]
  treinoAtivoId: number | null
  onCriarTreino: (nome: string) => void
  onSelecionarTreino: (treinoId: number) => void
  onExcluirTreino: (treinoId: number) => void
}

function TreinoLista({
  treinos,
  treinoAtivoId,
  onCriarTreino,
  onSelecionarTreino,
  onExcluirTreino,
}: TreinoListaProps) {
  const [nomeTreino, setNomeTreino] = useState('')

  function enviarTreino(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!nomeTreino.trim()) {
      return
    }

    onCriarTreino(nomeTreino)

    setNomeTreino('')
  }

  return (
    <section className="secao-treinos">
      <h2>Meus treinos</h2>

      <form
        onSubmit={enviarTreino}
        className="formulario"
      >
        <label>
          Nome do treino

          <input
            type="text"
            placeholder="Ex: Treino A - Peito"
            value={nomeTreino}
            onChange={(event) =>
              setNomeTreino(event.target.value)
            }
          />
        </label>

        <button type="submit">
          Criar treino
        </button>
      </form>

      <div className="lista-treinos">
        {treinos.length === 0 && (
          <p>Nenhum treino criado.</p>
        )}

        {treinos.map((treino) => (
          <div
            key={treino.id}
            className={`treino-item ${
              treino.id === treinoAtivoId
                ? 'treino-ativo'
                : ''
            }`}
          >
            <button
              type="button"
              onClick={() =>
                onSelecionarTreino(treino.id)
              }
            >
              {treino.nome}
            </button>

            <button
              type="button"
              onClick={() =>
                onExcluirTreino(treino.id)
              }
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TreinoLista