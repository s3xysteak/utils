import { describe, expect, it } from 'vitest'
import axios from 'axios'

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
})
