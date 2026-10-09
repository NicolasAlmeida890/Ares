import { useState } from 'react'
import type { FormEvent } from 'react'
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
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [erro, setErro] = useState('')

  function cancelarCriacao() {
    setNomeTreino('')
    setErro('')
    setFormularioAberto(false)
  }

  function enviarTreino(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nomeLimpo = nomeTreino.trim()

    if (!nomeLimpo) {
      setErro('Digite um nome para a ficha.')
      return
    }

    onCriarTreino(nomeLimpo)
    cancelarCriacao()
  }

  return (
    <section
      className="secao-treinos"
      aria-labelledby="titulo-minhas-fichas"
    >
      <div className="cabecalho-secao">
        <div>
          <p className="rotulo-secao">Planejamento</p>
          <h2 id="titulo-minhas-fichas">Minhas fichas</h2>
          <p>Escolha uma ficha para começar seu treino.</p>
        </div>

        {!formularioAberto && (
          <button
            type="button"
            className="botao-primario"
            onClick={() => setFormularioAberto(true)}
          >
            Nova ficha
          </button>
        )}
      </div>

      {formularioAberto && (
        <form onSubmit={enviarTreino} className="formulario">
          <label>
            Nome da nova ficha
            <input
              type="text"
              placeholder="Ex.: Treino A — Peito e tríceps"
              value={nomeTreino}
              maxLength={80}
              aria-invalid={Boolean(erro)}
              aria-describedby={erro ? 'erro-nova-ficha' : undefined}
              onChange={(event) => {
                setNomeTreino(event.target.value)
                setErro('')
              }}
              autoFocus
            />
          </label>

          <div className="acoes-formulario">
            <button type="submit">Criar ficha</button>
            <button type="button" onClick={cancelarCriacao}>
              Cancelar
            </button>
          </div>

          {erro && (
            <p id="erro-nova-ficha" className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}
        </form>
      )}

      <div className="lista-treinos">
        {treinos.length === 0 && (
          <div className="estado-vazio">
            <strong>Sua primeira ficha começa aqui.</strong>
            <p>Clique em Nova ficha para organizar seus exercícios.</p>
          </div>
        )}

        {treinos.map((treino) => {
          const selecionado = treino.id === treinoAtivoId
          const quantidade = treino.exercicios.length

          return (
            <div
              key={treino.id}
              className={`treino-item ${selecionado ? 'treino-ativo' : ''}`}
            >
              <button
                type="button"
                className="treino-seletor"
                aria-pressed={selecionado}
                onClick={() => onSelecionarTreino(treino.id)}
              >
                <span className="treino-nome">{treino.nome}</span>
                <span className="treino-meta">
                  {quantidade} {quantidade === 1 ? 'exercício' : 'exercícios'}
                </span>
                <span className="treino-status">
                  {selecionado ? 'Selecionada' : 'Ver ficha'}
                </span>
              </button>

              <button
                type="button"
                className="botao-perigo"
                aria-label={`Excluir ficha ${treino.nome}`}
                onClick={() => onExcluirTreino(treino.id)}
              >
                Excluir
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default TreinoLista
