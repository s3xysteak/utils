import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isArray, isFunction, isString } from '@/index.ts'

const GET_METHOD = ['get', 'delete', 'head', 'options'] as const
const POST_METHOD = ['post', 'put', 'patch', 'postForm', 'putForm', 'patchForm'] as const

export type OptionsItem =
  | string
  | ((...args: any[]) => any)
  | [url: string, method: typeof GET_METHOD[number] | typeof POST_METHOD[number]]
export type DefineRequestOptions = Record<string, OptionsItem>
export type DefineRequestReturns<Options extends object = object> = {
  [K in keyof Options]: Options[K] extends (...args: any[]) => any
    ? Options[K]
    : (params: any, config: AxiosRequestConfig) => Promise<AxiosResponse>
}

/**
 * Define a request factory for axios.
 *
 * @example
 * ```js
 * import axiosInstance from '@/api'
 *
 * const defineRequest = defineRequestAxiosFactory(axiosInstance)
 *
 * const api = defineRequest({
 *   // Start with `get` will use `get` method, otherwise use `post` method.
 *   getUser: '/user/list',
 *
 *   editUser: '/user/edit',
 *
 *   // Custom axios method.
 *   updatePicture: ['/user/picture', 'postForm'],
 *
 *   // Custom Request, which will call the function you defined.
 *   customFunc: (params, config) => axios.post('/user/custom', params, config),
 * })
 *
 * const use = async () => {
 *   // `get` Request
 *   const resGet = await api.getUser({ id: 1})
 *
 *   // `post` Request
 *   const resPost = await api.editUser({ id: 1, name: 'newName' })
 *
 *   // `postForm` Request
 *   const resPostForm = await api.updatePicture({ file: 'file' })
 *
 *   const resCustom = await api.customFunc({ id: 1 })
 * }
 * ```
 */
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
          = GET_METHOD.includes(method as any)
            ? (params: any, config: AxiosRequestConfig) => request(url, { params, ...config })
            : (params: any, config: AxiosRequestConfig) => request[method](url, params, config)
      }

      if (isFunction(val))
        result[key] = val
    }

    return result as DefineRequestReturns<T>
  }
}
