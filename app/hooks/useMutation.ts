import { useMutation as ReactQueryUseMutation } from 'react-query'

type MutationFn<TData, TBody> = (body: TBody) => Promise<TData>

type useMutationReturn<TData, TError, TBody> = {
  isLoading: boolean
  isError: boolean
  error: TError | null
  data: TData | undefined
  mutate: (
    body: TBody,
    options?: {
      onSuccess?: (data: TData, body: TBody) => void
      onError?: (error: TError, body: TBody) => void
    }
  ) => void
}

export function useMutation<TData, TBody, TError = any>(
  mutationFm: MutationFn<TData, TBody>,
  options?: {}
): useMutationReturn<TData, TError, TBody> {
  const { data, error, isLoading, isError, mutate } = ReactQueryUseMutation<TData, TError, TBody>(
    mutationFm,
    options
  )

  return {
    data,
    error,
    isError,
    isLoading,
    mutate
  }
}
