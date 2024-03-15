import { describe, expect, expectTypeOf, it } from 'vitest'
import axios, { type AxiosResponse } from 'axios'

import { defineRequestAxiosFactory } from './axiosFactory'

const defineRequest = defineRequestAxiosFactory(axios)

describe('defineRequestAxiosFactory', () => {
  it('should work', () => {
    const request = defineRequest({
      editUser: '/user/edit',
      postFormUser: ['/user/postForm', 'postForm'],
      custom: () => 1,
    })

    expect(request.editUser).toBeDefined()
    expect(typeof request.editUser).toBe('function')
    expectTypeOf(request.editUser).returns.toEqualTypeOf<Promise<AxiosResponse<any, any>>>()

    expect(request.postFormUser).toBeDefined()
    expect(typeof request.postFormUser).toBe('function')
    expectTypeOf(request.postFormUser).returns.toEqualTypeOf<Promise<AxiosResponse<any, any>>>()

    expect(request.custom).toBeDefined()
    expect(typeof request.custom).toBe('function')
    expect(request.custom()).toBe(1)
  })
})
