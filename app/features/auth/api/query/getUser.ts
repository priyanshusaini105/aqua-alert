import { useQuery, useQueryOptions } from "app/hooks";
import { API } from "app/services/api";
import { ProfileMeRes } from "app/types";


export const useGetUserQuery = (options?: useQueryOptions<ProfileMeRes, any>) =>
  useQuery('user-data', () => API.get<ProfileMeRes>('/users/profile'), options)
