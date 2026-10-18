import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { parseCssBlocks } from './css-blocks.mjs'

test('扁平 CSS：选择器与声明正确切分', () => {
  const blocks = parseCssBlocks(':root, page {\n  --cm-a: 1px;\n}\n.wot-theme-dark {\n  --cm-a: 2px;\n}\n')
  deepStrictEqual(blocks.map(block => block.selector), [':root, page', '.wot-theme-dark'])
  deepStrictEqual(blocks.map(block => block.body.trim()), ['--cm-a: 1px;', '--cm-a: 2px;'])
})

test('注释不进入选择器', () => {
  const blocks = parseCssBlocks('/* 说明\n * 多行\n */\n:root {\n  --cm-a: 1px;\n}\n')
  deepStrictEqual(blocks.map(block => block.selector), [':root'])
})

test('@media 嵌套：内层 :root 也必须被解析出来', () => {
  const css = '@media (min-width: 600px) {\n  :root {\n    --cm-x: var(--wot-a);\n  }\n}\n'
  const blocks = parseCssBlocks(css)
  deepStrictEqual(blocks.map(block => block.selector), [':root', '@media (min-width: 600px)'])
  strictEqual(blocks.some(block => block.selector === ':root' && block.body.includes('var(--wot-a)')), true)
})

test('.wot-theme-dark 内嵌套：外层 body 保留嵌套声明', () => {
  const css = '.wot-theme-dark {\n  @media (prefers-color-scheme: dark) {\n    --cm-a: 1px;\n  }\n}\n'
  const outer = parseCssBlocks(css).find(block => block.selector === '.wot-theme-dark')
  strictEqual(outer?.body.includes('--cm-a: 1px;'), true)
})

test('未闭合块不产出', () => {
  deepStrictEqual(parseCssBlocks(':root {\n  --cm-a: 1px;\n'), [])
})

test('空输入与多余右花括号不抛错', () => {
  deepStrictEqual(parseCssBlocks(''), [])
  deepStrictEqual(parseCssBlocks('}{'), [])
})
