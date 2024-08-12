import { useMutation } from "app/hooks";
import { API } from "app/services/api";


export const useLogoutUser = () => useMutation(() => API.post('/auth/logout', {}))
