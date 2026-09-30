type PageResult<T> = {
  data: T[] | null
  error: { message: string } | null
}

/** Lê uma tabela inteira, passando do limite padrão de 1000 linhas do PostgREST. */
export async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => PromiseLike<PageResult<T>>
): Promise<{ data: T[]; error: { message: string } | null }> {
  const chunkSize = 1000
  const all: T[] = []
  let from = 0

  while (true) {
    const { data, error } = await fetchPage(from, from + chunkSize - 1)
    if (error) return { data: all, error }
    const chunk = data ?? []
    all.push(...chunk)
    if (chunk.length < chunkSize) break
    from += chunkSize
  }

  return { data: all, error: null }
}
