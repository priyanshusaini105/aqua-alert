import { API } from 'app/services/api'
import { useEffect, useState } from 'react'


type useGetResponse<T> = {
  data: T | undefined
  loading: boolean
  error: Error | unknown
  refetch: () => void
}

export const useGET = <T>(
  endpoint: string,
  dependencies: any[] = [],
  autoStart = true
): useGetResponse<T> => {
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null | unknown>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await API.get<T>(endpoint)
      setData(res)
      setLoading(false)
      setError(null)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoStart) {
      fetchData()
    }
  }, dependencies)

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}
