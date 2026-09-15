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

    function salvarEdicao() {
        if (!repeticoes || !carga) {
            return
        }

        onEditar(
            serie.id,
            Number(repeticoes),
            Number(carga)
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
                    value={repeticoes}
                    onChange={(event) =>
                        setRepeticoes(event.target.value)
                    }
                />

                <input
                    type="number"
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
                    onClick={() => setEditando(true)}
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