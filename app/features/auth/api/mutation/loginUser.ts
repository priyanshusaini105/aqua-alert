import { useMutation } from 'app/hooks'
import { API } from 'app/services/api'
import { LoginPayload, RegisterAndLoginRes } from 'app/types'

export const useLoginUser = () =>
  useMutation<RegisterAndLoginRes, LoginPayload>(values => API.post('/auth/login', values))
