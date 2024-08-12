import { useMutation } from "app/hooks"
import { API } from "app/services/api"
import { RegisterAndLoginRes, RegisterPayload } from "app/types"


export const useRegisterUser = () =>
  useMutation<RegisterAndLoginRes, RegisterPayload>(async input => {
    const res = await API.post<RegisterAndLoginRes, RegisterPayload>('/auth/register', input)

    return res
  })
