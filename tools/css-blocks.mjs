/**
 * CSS 块解析（review-lint 主题 token 检查专用）。
 *
 * 为什么手写而不用正则：候选正则如 `([^{}]+)\{([^{}]*)\}` 在「整段文本不含左花括号」时
 * 会从每个起点一路扫到结尾才失败，复杂度 O(n²)；而且它每次只能匹配到嵌套结构中的一层。
 * 这里用花括号栈逐字符推进，复杂度 O(n)，@media 等嵌套规则里的内层块也会逐个产出。
 *
 * 已知边界：不解析字符串和声明值里的花括号，未闭合的块不产出。tokens.css 是扁平的
 * token 声明文件，不涉及这些情况；若将来放宽到任意 CSS，请换正式解析器。
 */

/** 剥离 CSS 注释：注释里的花括号与声明不参与解析 */
export function stripCssComments(css) {
  let out = ''
  let cursor = 0
  while (cursor < css.length) {
    const start = css.indexOf('/*', cursor)
    if (start === -1) {
      out += css.slice(cursor)
      break
    }
    out += css.slice(cursor, start)
    const end = css.indexOf('*/', start + 2)
    if (end === -1)
      break
    cursor = end + 2
  }
  return out
}

/**
 * 解析出每个「选择器 { 声明 }」块。嵌套块按闭合顺序逐个产出（内层先于外层），
 * 外层 body 保留其内部的嵌套文本——主题 token 检查用正则扫 body，两层都能覆盖。
 */
export function parseCssBlocks(css) {
  const source = stripCssComments(css)
  const blocks = []
  const stack = []
  let segmentStart = 0
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (char === '{') {
      stack.push({ selector: source.slice(segmentStart, i).trim(), bodyStart: i + 1 })
      segmentStart = i + 1
    }
    else if (char === '}') {
      const open = stack.pop()
      if (!open)
        continue
      blocks.push({ selector: open.selector, body: source.slice(open.bodyStart, i) })
      segmentStart = i + 1
    }
  }
  return blocks
}
