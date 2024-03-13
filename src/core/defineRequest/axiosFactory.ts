import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isArray, isFunction, isString } from '@/index'

const GetMethod = ['get', 'delete', 'head', 'options'] as const
const PostMethod = ['post', 'put', 'patch', 'postForm', 'putForm', 'patchForm'] as const

export type OptionsItem =
  | string
  | ((...args: any[]) => any)
  | [url: string, method: typeof GetMethod[number] | typeof PostMethod[number]]
export type DefineRequestOptions = Record<string, OptionsItem>
export type DefineRequestReturns<Options extends object = object> = {
  [K in keyof Options]: Options[K] extends (...args: any[]) => any
    ? Options[K]
    : (params: any, config: AxiosRequestConfig) => Promise<AxiosResponse>
}

export function defineRequestAxiosFactory(request: AxiosInstance) {
  // TODO: Better Type declaration like `defineProps`
  return <T extends DefineRequestOptions = DefineRequestOptions>(options: T) => {
    const result: Record<string, any> = {}

    for (const [key, val] of Object.entries(options)) {
      if (isString(val)) {
        result[key] = key.startsWith('get')
          ? (params: any, config: AxiosRequestConfig) => request(val, { params, ...config })
          : (params: any, config: AxiosRequestConfig) => request.post(val, params, config)
      }

      if (isArray(val)) {
        const [url, method] = val

        result[key]
          = GetMethod.includes(method as any)
            ? (params: any, config: AxiosRequestConfig) => request(url, { params, ...config })
            : (params: any, config: AxiosRequestConfig) => request[method](url, params, config)
      }

      if (isFunction(val))
        result[key] = val
    }

    return result as DefineRequestReturns<T>
  }
}
