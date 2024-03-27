import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isArray, isFunction, isString } from '../..'

export type OptionsItem =
  | string
  | ((...args: any[]) => any)
  | [url: string, method: keyof ReturnType<typeof defineMethodMap>]

export type DefineRequestOptions = Record<string, OptionsItem>

export type DefineRequestReturns<Options = any> = {
  [K in keyof Options]: Options[K] extends (...args: any[]) => any
    ? Options[K]
    : <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => Promise<AxiosResponse<Res, any>>
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
 *   // Start with `http methods` will use `http methods` method, otherwise use `post` method.
 *   getUser: '/user/list',
 *
 *   deleteUser: '/user/delete',
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
 *   // `delete` Request
 *   const resDelete = await api.deleteUser({ id: 1 })
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
  const methodMap = defineMethodMap(request)

  // TODO: Better Type declaration like `defineProps`
  return <T extends DefineRequestOptions = DefineRequestOptions>(options: T) => {
    const result: Record<string, any> = {}

    for (const [key, val] of Object.entries(options)) {
      if (isString(val)) {
        const matchVal = (key.match(/^[a-z]*/) as RegExpMatchArray)[0]

        result[key] = matchVal in methodMap
          ? methodMap[matchVal as keyof typeof methodMap](val)
          : methodMap.post(val)
      }

      if (isArray(val)) {
        const [url, method] = val
        if (!(method in methodMap))
          throw new Error(`Method ${method} is not supported.`)

        result[key] = methodMap[method](url)
      }

      if (isFunction(val))
        result[key] = val
    }

    return result as DefineRequestReturns<T>
  }
}

function defineMethodMap(request: AxiosInstance) {
  return {
    get: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.get<Res>(url, { params, ...config }),
    put: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.put<Res>(url, params, config),
    head: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.head<Res>(url, { params, ...config }),
    options: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.options<Res>(url, { params, ...config }),

    post: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.post<Res>(url, params, config),
    patch: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.patch<Res>(url, params, config),
    delete: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.delete<Res>(url, { params, ...config }),

    postForm: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.postForm<Res>(url, params, config),
    putForm: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.putForm<Res>(url, params, config),
    patchForm: (url: string) =>
      <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => request.patchForm<Res>(url, params, config),
  }
}
