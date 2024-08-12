import { useQuery as ReactQueryUseQuery } from 'react-query'

type QueryKey = any
type QueryFunction<TData> = () => Promise<TData>
type useQueryResults<TData, TBody, TError> = {
  data: TData | undefined
  error: TError | null
  isError: boolean
  isLoading: boolean
  refetch: () => void
}
export type useQueryOptions<TData, TError> = {
  enabled?: boolean
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
  noCache?: boolean
}

export function useQuery<TData, TBody, TError>(
  queryKey: QueryKey,
  queryFunction: QueryFunction<TData>,
  options?: useQueryOptions<TData, TError>
): useQueryResults<TData, TBody, TError> {
  const { data, error, isLoading, isError, refetch } = ReactQueryUseQuery<TData, TError>(
    queryKey,
    queryFunction,
    {
      ...options,
      cacheTime: options?.noCache ? 0 : undefined
    }
  )

  return {
    data,
    error,
    isError,
    isLoading,
    refetch
  }
}
