import { useMemo, useState } from 'react'

import { buscarExerciciosExerciseDb } from '../services/exerciseDb'

import type {
  ExercicioCatalogo,
} from '../types/treino'

type CatalogoExerciciosProps = {
  onSelecionar: (
    exercicio: ExercicioCatalogo
  ) => void
}

const ITENS_POR_PAGINA = 6

function CatalogoExercicios({
  onSelecionar,
}: CatalogoExerciciosProps) {
  const [busca, setBusca] = useState('')

  const [resultados, setResultados] =
    useState<ExercicioCatalogo[]>([])

  const [carregando, setCarregando] =
    useState(false)

  const [erro, setErro] =
    useState<string | null>(null)

  const [pesquisou, setPesquisou] =
    useState(false)

  const [filtroMusculo, setFiltroMusculo] =
    useState('Todos')

  const [filtroEquipamento, setFiltroEquipamento] =
    useState('Todos')

  const [paginaAtual, setPaginaAtual] =
    useState(1)

  async function pesquisar(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!busca.trim()) {
      return
    }

    try {
      setCarregando(true)
      setErro(null)
      setPesquisou(true)

      const exercicios =
        await buscarExerciciosExerciseDb(busca)

      setResultados(exercicios)

      setFiltroMusculo('Todos')
      setFiltroEquipamento('Todos')
      setPaginaAtual(1)
    } catch (erro) {
      console.error(erro)

      if (erro instanceof Error) {
        setErro(erro.message)
      } else {
        setErro(
          'Ocorreu um erro ao buscar os exercícios.'
        )
      }
    } finally {
      setCarregando(false)
    }
  }

  const musculos = useMemo(() => {
    const valores = resultados
      .map(
        (exercicio) =>
          exercicio.grupoMuscular
      )
      .filter(Boolean)

    return [
      'Todos',
      ...Array.from(
        new Set(valores)
      ).sort(),
    ]
  }, [resultados])

  const equipamentos = useMemo(() => {
    const valores = resultados
      .map(
        (exercicio) =>
          exercicio.equipamento
      )
      .filter(Boolean)

    return [
      'Todos',
      ...Array.from(
        new Set(valores)
      ).sort(),
    ]
  }, [resultados])

  const resultadosFiltrados =
    useMemo(() => {
      return resultados.filter(
        (exercicio) => {
          const musculoCorreto =
            filtroMusculo === 'Todos' ||
            exercicio.grupoMuscular ===
              filtroMusculo

          const equipamentoCorreto =
            filtroEquipamento === 'Todos' ||
            exercicio.equipamento ===
              filtroEquipamento

          return (
            musculoCorreto &&
            equipamentoCorreto
          )
        }
      )
    }, [
      resultados,
      filtroMusculo,
      filtroEquipamento,
    ])

  const totalPaginas = Math.ceil(
    resultadosFiltrados.length /
      ITENS_POR_PAGINA
  )

  const inicio =
    (paginaAtual - 1) *
    ITENS_POR_PAGINA

  const resultadosDaPagina =
    resultadosFiltrados.slice(
      inicio,
      inicio + ITENS_POR_PAGINA
    )

  function mudarFiltroMusculo(
    valor: string
  ) {
    setFiltroMusculo(valor)
    setPaginaAtual(1)
  }

  function mudarFiltroEquipamento(
    valor: string
  ) {
    setFiltroEquipamento(valor)
    setPaginaAtual(1)
  }

  return (
    <section className="catalogo">
      <h3>Catálogo de exercícios</h3>

      <form
        onSubmit={pesquisar}
        className="busca-exercicio"
      >
        <input
          type="text"
          placeholder="Ex: bench, squat, curl..."
          value={busca}
          onChange={(event) =>
            setBusca(event.target.value)
          }
        />

        <button
          type="submit"
          disabled={carregando}
        >
          {carregando
            ? 'Buscando...'
            : 'Buscar'}
        </button>
      </form>

      {erro && (
        <p className="mensagem-erro">
          {erro}
        </p>
      )}

      {resultados.length > 0 && (
        <div className="filtros-catalogo">
          <label>
            Músculo

            <select
              value={filtroMusculo}
              onChange={(event) =>
                mudarFiltroMusculo(
                  event.target.value
                )
              }
            >
              {musculos.map(
                (musculo) => (
                  <option
                    key={musculo}
                    value={musculo}
                  >
                    {musculo}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Equipamento

            <select
              value={filtroEquipamento}
              onChange={(event) =>
                mudarFiltroEquipamento(
                  event.target.value
                )
              }
            >
              {equipamentos.map(
                (equipamento) => (
                  <option
                    key={equipamento}
                    value={equipamento}
                  >
                    {equipamento}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
      )}

      <div className="catalogo-grid">
        {resultadosDaPagina.map(
          (exercicio) => (
            <div
              key={exercicio.id}
              className="catalogo-item"
            >
              {exercicio.imagem && (
                <img
                  src={exercicio.imagem}
                  alt={exercicio.nome}
                  className="catalogo-imagem"
                />
              )}

              <div className="catalogo-info">
                <strong>
                  {exercicio.nome}
                </strong>

                <p>
                  {
                    exercicio.grupoMuscular
                  }
                </p>

                <small>
                  {
                    exercicio.equipamento
                  }
                </small>
              </div>

              <button
                type="button"
                onClick={() =>
                  onSelecionar(
                    exercicio
                  )
                }
              >
                Adicionar
              </button>
            </div>
          )
        )}
      </div>

      {pesquisou &&
        !carregando &&
        resultadosFiltrados.length === 0 &&
        !erro && (
          <p>
            Nenhum exercício encontrado.
          </p>
        )}

      {totalPaginas > 1 && (
        <div className="paginacao">
          <button
            type="button"
            disabled={paginaAtual === 1}
            onClick={() =>
              setPaginaAtual(
                (pagina) =>
                  pagina - 1
              )
            }
          >
            Anterior
          </button>

          <span>
            Página {paginaAtual} de{' '}
            {totalPaginas}
          </span>

          <button
            type="button"
            disabled={
              paginaAtual === totalPaginas
            }
            onClick={() =>
              setPaginaAtual(
                (pagina) =>
                  pagina + 1
              )
            }
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  )
}

export default CatalogoExercicios