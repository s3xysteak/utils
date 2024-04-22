import { describe, expect, expectTypeOf, it } from 'vitest'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

import { defineRequestAxiosFactory } from '../..'

const defineRequest = defineRequestAxiosFactory(axios)

describe('defineRequestAxiosFactory', () => {
  it('should work', () => {
    const request = defineRequest({
      editUser: '/user/edit',
      postFormUser: ['/user/postForm', 'postForm'],
      custom: () => 1,
    })

    expect(request.editUser).toBeDefined()
    expectTypeOf(request.editUser<any, any>).returns.toEqualTypeOf<Promise<AxiosResponse<any, any>>>()

    expect(request.postFormUser).toBeDefined()
    expectTypeOf(request.postFormUser<any, any>).returns.toEqualTypeOf<Promise<AxiosResponse<any, any>>>()

    expect(request.custom).toBeDefined()
    expectTypeOf(request.custom).returns.toEqualTypeOf<number>()
    expect(request.custom()).toBe(1)
  })

  it('should work with generic', () => {
    const obj = {
      getUser: '/user/list',
      editUser: '/user/edit',
    }
    const request = defineRequest<typeof obj, {
      getUser: [{ id: string }, { name: string }]
    }>(obj)

    expectTypeOf(request.getUser).parameter(0).toEqualTypeOf<{ id: string } | string>()
    expectTypeOf(request.getUser).returns.toEqualTypeOf<Promise<AxiosResponse<{ name: string }, any>>>()
    expectTypeOf(request.editUser<any, any>).returns.toEqualTypeOf<Promise<AxiosResponse<any, any>>>()
  })
})
