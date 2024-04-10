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
    expect(typeof request.editUser).toBe('function')

    expect(request.postFormUser).toBeDefined()
    expect(typeof request.postFormUser).toBe('function')

    expect(request.custom).toBeDefined()
    expect(typeof request.custom).toBe('function')
    expect(request.custom()).toBe(1)
  })

  it('should work with generic', () => {
    const obj = {
      getUser: '/user/list',
      editUser: '/user/edit',
    }
    const request = defineRequest<typeof obj, {
      getUser: { params: { id: string }, return: { name: string } }
    }>(obj)

    expectTypeOf(request.getUser).parameter(0).toEqualTypeOf<{ id: string }>()
    expectTypeOf(request.getUser).returns.toEqualTypeOf<Promise<AxiosResponse<{ name: string }, any>>>()
  })
})
