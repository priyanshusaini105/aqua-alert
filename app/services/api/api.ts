import {
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { setGenericPassword, getGenericPassword, resetGenericPassword } from 'react-native-keychain'
const jwtDecode = require('jwt-decode')

export type ApiConfig = {
  url: string,
  timeout: number,
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

class ApiError extends Error {
  status: number
  errors: any

  constructor(message: string, status: number, errors: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

class Api {
  apisauce: ApisauceInstance
  config: ApiConfig
  private token = ''
  private jwtKey = 'jwt'
  private errorCallbacks: Set<(error: ApiError) => any> = new Set()

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.initializeToken()
  }

  private async initializeToken() {
    const res: any = await getGenericPassword({ service: this.jwtKey })
    const token = res?.password
    if (typeof token === 'string') {
      this.token = token
    }
  }

  async setToken(token: string) {
    await setGenericPassword(this.jwtKey, token, { service: this.jwtKey })
    this.token = token
  }

  async resetToken() {
    await resetGenericPassword({ service: this.jwtKey })
    this.token = ''
  }

  async isUserLoggedIn() {
    const token = await this.getStoredToken()
    const currentTime = Math.floor(Date.now() / 1000)
    return jwtDecode(token).exp > currentTime
  }

  public getToken() {
    return this.token
  }

  private async getStoredToken() {
    const res = await getGenericPassword({ service: this.jwtKey })
    if (!res) {
      return ''
    }
    return res.password
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const requestOptions: RequestInit = {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        ...options.headers
      },
      ...options
    }

    const response = await fetch(`${this.config.url}${path}`, requestOptions)
    const res = await response.json()
    if (!response.ok) {
      const error = new ApiError(res.message || response.statusText, response.status, res.errors)
      this.errorCallbacks.forEach(callback => callback(error))
      throw error
    }

    return res
  }

  get<T>(path: string): Promise<T> {
    return this.request(path)
  }

  put<T>(path: string, body: object): Promise<T> {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) })
  }

  delete<T>(path: string, body: any): Promise<T> {
    return this.request(path, { method: 'DELETE', body: JSON.stringify(body) })
  }

  post<T, B>(path: string, body: B): Promise<T> {
    return this.request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
  }

  onError(cb: (error: ApiError) => any) {
    this.errorCallbacks.add(cb)
  }
}

// Singleton instance of the API for convenience
export const API = new Api()