import { useState } from 'react'
import type { Serie } from '../types/treino'

type SerieItemProps = {
  serie: Serie
  numero: number

  onEditar: (
    serieId: number,
    repeticoes: number,
    carga: number
  ) => void

  onExcluir: (serieId: number) => void
}

function SerieItem({
  serie,
  numero,
  onEditar,
  onExcluir,
}: SerieItemProps) {
  const [editando, setEditando] = useState(false)

  const [repeticoes, setRepeticoes] = useState(
    String(serie.repeticoes)
  )

  const [carga, setCarga] = useState(
    String(serie.carga)
  )

  function iniciarEdicao() {
    setRepeticoes(String(serie.repeticoes))
    setCarga(String(serie.carga))
    setEditando(true)
  }

  function salvarEdicao() {
    if (
      repeticoes.trim() === '' ||
      carga.trim() === ''
    ) {
      window.alert('Preencha as repetições e a carga.')
      return
    }

    const repeticoesNumero = Number(repeticoes)
    const cargaNumero = Number(carga)

    if (
      !Number.isInteger(repeticoesNumero) ||
      repeticoesNumero <= 0
    ) {
      window.alert(
        'As repetições devem ser um número inteiro maior que zero.'
      )
      return
    }

    if (
      !Number.isFinite(cargaNumero) ||
      cargaNumero < 0
    ) {
      window.alert(
        'A carga deve ser um número maior ou igual a zero.'
      )
      return
    }

    onEditar(
      serie.id,
      repeticoesNumero,
      cargaNumero
    )

    setEditando(false)
  }

  function cancelarEdicao() {
    setRepeticoes(String(serie.repeticoes))
    setCarga(String(serie.carga))
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="serie serie-editando">
        <span>Série {numero}</span>

        <input
          type="number"
          min="1"
          step="1"
          aria-label="Repetições"
          value={repeticoes}
          onChange={(event) =>
            setRepeticoes(event.target.value)
          }
        />

        <input
          type="number"
          min="0"
          step="any"
          aria-label="Carga em quilogramas"
          value={carga}
          onChange={(event) =>
            setCarga(event.target.value)
          }
        />

        <div className="acoes-serie">
          <button
            type="button"
            onClick={salvarEdicao}
          >
            Salvar
          </button>

          <button
            type="button"
            onClick={cancelarEdicao}
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="serie">
      <span>Série {numero}</span>

      <span>
        {serie.repeticoes} reps × {serie.carga} kg
      </span>

      <div className="acoes-serie">
        <button
          type="button"
          onClick={iniciarEdicao}
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onExcluir(serie.id)}
        >
          Excluir
        </button>
      </div>
    </div>
  )
}

export default SerieItem