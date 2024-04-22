import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isArray, isFunction, isString } from '../..'

type OptionsItem =
  | string
  | ((...args: any[]) => any)
  | [url: string, method: keyof ReturnType<typeof defineMethodMap>]

export type DefineRequestOptions = Record<string, OptionsItem>

type CustomTypeItem = [any, any]

export type DefineRequestReturns<CustomType extends { [key in keyof Options]?: CustomTypeItem } = object, Options = any> = {
  [K in keyof Options]: Options[K] extends (...args: any[]) => any
    ? Options[K]
    : CustomType[K] extends CustomTypeItem
      ? (params: CustomType[K][0], config?: AxiosRequestConfig<CustomType[K][0]>) => Promise<AxiosResponse<CustomType[K][1], any>>
      : <Req = any, Res = any>(params: Req, config?: AxiosRequestConfig<Req>) => Promise<AxiosResponse<Res, any>>
}

/**
 * Define a request factory for axios.
 *
 * @example
 * ```ts
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
 *   // const resGet = await api.getUser('/1', { otherData: 2 }, { header: {} }) // To append string after url
 *   const resGet = await api.getUser({ id: 1 }, { header: {} })
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
 *
 * // For TypeScript
 * const req = {
 *   getUser: '/user/list',
 *   editUser: '/user/edit',
 * }
 * const apiTs = defineRequest<typeof req, {
 *   getUser: [
 *     // Param type,
 *     { id: number },
 *     // Response type
 *     { name: string }
 *   ],
 * }>(req)
 *
 * const useTs = async () => {
 *   // IntelliSense
 *   const resGet = await apiTs.getUser({ id: 1 })
 *   console.log(resGet.data.name)
 *
 *   // Default type is any
 *   const resEdit = await apiTs.editUser({
 *     sid: 1,
 *     name: 'newName'
 *   })
 * }
 *
 * ```
 */
export function defineRequestAxiosFactory(request: AxiosInstance) {
  const methodMap = defineMethodMap(request)

  // TODO: Switch the order.
  return <T extends DefineRequestOptions = DefineRequestOptions, CustomType extends { [key in keyof T]?: CustomTypeItem } = object>(options: T) => {
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

    return result as DefineRequestReturns<CustomType, T>
  }
}

function defineMethodMap(request: AxiosInstance) {
  function createAxiosRequest(
    url: string,
    method: keyof ReturnType<typeof defineMethodMap>,
    isParams: boolean,
  ): <Req = any, Res = any>(params: Req, config: AxiosRequestConfig<Req>) => Promise<AxiosResponse<Res>>
  function createAxiosRequest(
    url: string,
    method: keyof ReturnType<typeof defineMethodMap>,
    isParams: boolean,
  ): <Req = any, Res = any>(append: string, params: Req, config: AxiosRequestConfig<Req>) => Promise<AxiosResponse<Res>>
  function createAxiosRequest(
    url: string,
    method: keyof ReturnType<typeof defineMethodMap>,
    isParams: boolean,
  ) {
    return <Req = any, Res = any>(...args: [Req, AxiosRequestConfig<Req>] | [string, Req, AxiosRequestConfig<Req>]) => {
      const isAppend = isString(args[0])

      url = isAppend ? `${url}${args[0]}` : url
      const [params, config] = isAppend ? [args[1], args[2]] : [args[0], args[1]]

      return isParams
        ? request[method]<Res>(url, { params, ...config })
        : request[method]<Res>(url, params, config as AxiosRequestConfig<Req> | undefined)
    }
  }

  return {
    get: (url: string) => createAxiosRequest(url, 'get', true),
    put: (url: string) => createAxiosRequest(url, 'put', false),
    head: (url: string) => createAxiosRequest(url, 'head', true),
    options: (url: string) => createAxiosRequest(url, 'options', true),

    post: (url: string) => createAxiosRequest(url, 'post', false),
    patch: (url: string) => createAxiosRequest(url, 'patch', false),
    delete: (url: string) => createAxiosRequest(url, 'delete', true),

    postForm: (url: string) => createAxiosRequest(url, 'post', false),
    putForm: (url: string) => createAxiosRequest(url, 'put', false),
    patchForm: (url: string) => createAxiosRequest(url, 'patch', false),
  }
}
