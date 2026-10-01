import { useState } from 'react'
import type { FormEvent } from 'react'

type EditarNomeTreinoProps = {
  nomeAtual: string
  onSalvar: (nome: string) => void
}

function EditarNomeTreino({
  nomeAtual,
  onSalvar,
}: EditarNomeTreinoProps) {
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(nomeAtual)
  const [erro, setErro] = useState('')

  function iniciarEdicao() {
    setNome(nomeAtual)
    setErro('')
    setEditando(true)
  }

  function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nomeLimpo = nome.trim()

    if (!nomeLimpo) {
      setErro('Digite um nome para o treino.')
      return
    }

    onSalvar(nomeLimpo)
    setEditando(false)
    setErro('')
  }

  function cancelar() {
    setNome(nomeAtual)
    setErro('')
    setEditando(false)
  }

  if (!editando) {
    return (
      <button
        type="button"
        onClick={iniciarEdicao}
      >
        Renomear treino
      </button>
    )
  }

  return (
    <form onSubmit={salvar}>
      <label>
        Nome do treino
        <input
          type="text"
          value={nome}
          maxLength={80}
          onChange={(event) => {
            setNome(event.target.value)
            setErro('')
          }}
          autoFocus
        />
      </label>

      {erro && <p role="alert">{erro}</p>}

      <button type="submit">
        Salvar nome
      </button>

      <button
        type="button"
        onClick={cancelar}
      >
        Cancelar
      </button>
    </form>
  )
}

export default EditarNomeTreino