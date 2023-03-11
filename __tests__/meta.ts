import { Meta, parse } from '../src/meta'

const meta = `

$分组1$



文章1-1
文章1-2
文章1-3$分组2

$分组2$

文章2-1
文章2-2

`

describe('parse', () => {

  it('normal', () => {

    expect(parse(meta)).toEqual({
      groups: [{
        name: '_DEFAULT_GROUP_',
        docs: [],
      }, {
        name: '分组1',
        docs: [{
          name: '文章1-1',
          order: 0,
        }, {
          name: '文章1-2',
          order: 1,
        }]
      }, {
        name: '分组2',
        docs: [{
          name: '文章1-3',
          order: 0,
        }, {
          name: '文章2-1',
          order: 1,
        }, {
          name: '文章2-2',
          order: 2,
        }]
      }]
    } as Meta)

  })

})
