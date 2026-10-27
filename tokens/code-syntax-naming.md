# Token Code Syntax 自动命名规范

> 适用对象：Design Token 的 **Code Syntax / CSS Variable** 命名。  
> 本规范只定义代码侧变量命名方式，不分析 token value，也不改变 token 本身的语义结构。

---

## 1. 核心规则

Code Syntax 按照左侧 token group / folder 的层级顺序，从上到下、从左到右依次拼接。

```text
Folder 1 / Folder 2 / Folder 3 / Token Name
↓
var(--folder-1-folder-2-folder-3-token-name)
```

示例：

```text
Color / Text / Brand / Default
↓
var(--color-text-brand-default)
```

注意：这里的命名来自 **当前 token 自己所在的路径**，不是它引用的 value 路径。

例如：

```text
Token path: Color / Text / Brand / Default
Value:      Color / Blue / 600
Code:       var(--color-text-brand-default)
```

即使该 token 引用了 `Color/Blue/600`，它的 code syntax 仍然是：

```css
var(--color-text-brand-default)
```

---

## 2. 命名格式

所有 code syntax 统一使用 CSS variable 格式：

```css
var(--token-path-in-kebab-case)
```

具体规则：

| 规则 | 说明 | 示例 |
|---|---|---|
| 全部小写 | 避免大小写不一致 | `Brand` → `brand` |
| 使用 kebab-case | 空格、下划线、驼峰统一转成 `-` | `Cold Black` → `cold-black` |
| 保留数字层级 | 色阶、尺寸、透明度等数字不改写 | `600` → `600` |
| 保留语义词 | 不自动省略 `default`、`subtle`、`pressed` 等状态 | `Default` → `default` |
| 不使用 `/` | `/` 只存在于 token path，不进入代码变量 | `Color/Text` → `color-text` |
| 不加入 value 路径 | code syntax 只跟当前 token path 走 | 引用 `Color/Blue/600` 不等于 `--color-blue-600` |

---

## 3. 自动命名公式

### 3.1 基础公式

```text
code syntax = var(-- + normalize(token path).join('-') + )
```

### 3.2 normalize 规则

对每一层名称执行以下处理：

```text
1. 去除首尾空格
2. 驼峰拆分
3. 空格 / 下划线 / 斜杠统一替换为 hyphen：-
4. 转为小写
5. 删除不必要的特殊符号
6. 连续多个 hyphen 合并为一个
7. 去除开头和结尾的 hyphen
```

### 3.3 伪代码

```js
function toCodeSyntax(tokenPath) {
  const normalizedPath = tokenPath
    .map(segment => segment
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_\/]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
    )
    .filter(Boolean)
    .join('-');

  return `var(--${normalizedPath})`;
}
```


---

## 4. 已有 Code Syntax 的校验与覆盖规则

如果 token 中已经存在 code syntax，不能默认保留，需要先按照本规范重新计算标准命名，再与现有 code syntax 对比。

### 4.1 校验逻辑

```text
standard code syntax = toCodeSyntax(current token path)
existing code syntax = token 中已有的 code syntax
```

判断规则：

| 情况 | 处理方式 |
|---|---|
| 没有 code syntax | 新增标准 code syntax |
| 已有 code syntax，且与标准值一致 | 保留，不重复修改 |
| 已有 code syntax，但与标准值不一致 | 覆盖为标准 code syntax |
| 已有 code syntax 使用了 value 路径 | 视为错误，覆盖为当前 token path 命名 |
| 已有 code syntax 缺少层级 / 省略 Default / 大小写错误 / 非 kebab-case | 视为错误，覆盖为标准 code syntax |

示例：

```text
Token path: Color / Text / Brand / Default
Value:      Color / Blue / 600
Existing:   var(--color-blue-600)
Standard:   var(--color-text-brand-default)
Result:     覆盖为 var(--color-text-brand-default)
```

```text
Token path: Color / Text / Brand / Default
Existing:   var(--color-text-brand)
Standard:   var(--color-text-brand-default)
Result:     覆盖为 var(--color-text-brand-default)
```

```text
Token path: Color / Text / Brand / Default
Existing:   var(--color-text-brand-default)
Standard:   var(--color-text-brand-default)
Result:     保留，不修改
```

### 4.2 覆盖优先级

当现有 code syntax 与自动计算结果冲突时，以 **当前 token path 生成的标准 code syntax** 为唯一准则。

不要因为已有命名看起来更短、更像 primitive、或已经被业务使用，就跳过修正。自动命名的目标是让 code syntax 与 token 结构保持一致，避免长期维护混乱。

---

## 5. Code Syntax 平台设置

Code Syntax 统一设置为 **Web CSS**。

输出格式必须是 CSS custom property 的引用格式：

```css
var(--token-name)
```

不要生成其他平台格式，例如：

```text
Android XML: @color/color_text_brand_default
Android Compose: ColorTextBrandDefault
iOS Swift: Color.textBrandDefault
SCSS variable: $color-text-brand-default
Raw CSS custom property: --color-text-brand-default
```

本规范中的 code syntax 指的是最终可直接在 Web CSS 中使用的引用值：

```css
var(--color-text-brand-default)
```

---

## 6. Collection / Mode 处理

Collection、文件名、Mode 不进入 code syntax。

```text
Semantic / Mode 1 / Color / Text / Brand / Default
```

实际命名只从 token path 开始：

```css
var(--color-text-brand-default)
```

不写成：

```css
var(--semantic-mode-1-color-text-brand-default)
```

---

## 7. Default 不省略

`Default` 是 token 名称的一部分，必须保留。

原因：同一组下面通常会同时存在多个状态或强度，例如：

```text
Color / Text / Brand / Default
Color / Text / Brand / Heavy
Color / Text / Brand / Light
```

对应 code syntax：

```css
var(--color-text-brand-default)
var(--color-text-brand-heavy)
var(--color-text-brand-light)
```

不要为了简短写成：

```css
var(--color-text-brand)
```

否则会破坏命名结构的一致性，也会影响后续扩展。

---

## 8. Primitive / Semantic / Component 的命名方式

### 8.1 Primitive Token

Primitive token 直接按照基础属性路径命名。

```text
Color / Blue / 600
↓
var(--color-blue-600)
```

```text
Spacing / 16
↓
var(--spacing-16)
```

```text
Radius / 24
↓
var(--radius-24)
```

Primitive 负责描述基础值，不表达业务场景。

---

### 8.2 Semantic Token

Semantic token 按照语义路径命名。

```text
Color / Text / Brand / Default
↓
var(--color-text-brand-default)
```

```text
Color / Surface / Card / Brand-subtle
↓
var(--color-surface-card-brand-subtle)
```

```text
Color / Action / Bg / Primary / Pressed
↓
var(--color-action-bg-primary-pressed)
```

Semantic 负责表达使用场景，不应该暴露具体色值或具体 primitive 名称。

---

### 8.3 Component Token

Component token 保留组件名作为第一层。

```text
Tag / Color / Neutral / Bg / Default
↓
var(--tag-color-neutral-bg-default)
```

```text
Tag / Color / Brand / Text / Default
↓
var(--tag-color-brand-text-default)
```

```text
Tag / Color / Negative / Stroke / Default
↓
var(--tag-color-negative-stroke-default)
```

Component token 用于组件内部的具体样式，不建议省略组件名。

---

## 9. 常见类型示例

### Color

```text
Color / Blue / 600
→ var(--color-blue-600)

Color / Text / Primary
→ var(--color-text-primary)

Color / Text / Brand / Default
→ var(--color-text-brand-default)

Color / Icon / Positive / Heavy
→ var(--color-icon-positive-heavy)

Color / Stroke / Brand / Subtle
→ var(--color-stroke-brand-subtle)

Color / Alpha / Cold Black / 12
→ var(--color-alpha-cold-black-12)
```

### Font

```text
Font / Family / Body
→ var(--font-family-body)

Font / Size / body-md
→ var(--font-size-body-md)

Font / Weight / SemiBold
→ var(--font-weight-semi-bold)

Font / Line-height / Body / md
→ var(--font-line-height-body-md)
```

### Spacing

```text
Spacing / Gap / md
→ var(--spacing-gap-md)

Spacing / Padding / xl
→ var(--spacing-padding-xl)

Spacing / Page / bottom-lg
→ var(--spacing-page-bottom-lg)
```

### Radius / Stroke / Shadow / Blur

```text
Radius / lg
→ var(--radius-lg)

Stroke / Width / Strong
→ var(--stroke-width-strong)

Shadow / Default
→ var(--shadow-default)

Blur / Backdrop / bg
→ var(--blur-backdrop-bg)
```

### Gradient / Opacity

```text
Gradient / Top-nav-filled
→ var(--gradient-top-nav-filled)

Layer Opacity / Muted
→ var(--layer-opacity-muted)
```

---

## 10. 命名检查清单

每次生成或校验 code syntax 时，按下面顺序检查：

```text
1. 是否只根据当前 token path 命名？
2. 是否没有使用被引用的 primitive value 路径？
3. 是否保留了完整层级？
4. 是否保留了 Default / Pressed / Disabled / Subtle 等状态词？
5. 是否全部为小写？
6. 是否全部使用 kebab-case？
7. 是否没有把 Collection / Mode / 文件名写进去？
8. 是否设置在 Web CSS code syntax？
9. 是否最终格式为 var(--xxx)？
10. 如果原本已经有 code syntax，是否已与标准命名对比？
11. 如果原 code syntax 不符合规范，是否已覆盖为标准命名？
```

---

## 11. 不推荐写法

### 11.1 不要用 value 路径命名 semantic token

错误：

```text
Color / Text / Brand / Default
Value: Color / Blue / 600
```

```css
var(--color-blue-600)
```

正确：

```css
var(--color-text-brand-default)
```

---

### 11.2 不要省略 Default

错误：

```css
var(--color-text-brand)
```

正确：

```css
var(--color-text-brand-default)
```

---

### 11.3 不要混用大小写

错误：

```css
var(--Color-Text-Brand-Default)
```

正确：

```css
var(--color-text-brand-default)
```

---

### 11.4 不要把 Mode 写进变量名

错误：

```css
var(--mode-1-color-text-brand-default)
```

正确：

```css
var(--color-text-brand-default)
```

---

## 12. 推荐给 AI / 插件使用的简短指令

```text
Generate or validate Web CSS Code Syntax for each token based only on its token path.
Use CSS variable reference format: var(--path-in-kebab-case).
Keep every folder level and token name in order.
Do not use the referenced value path.
Do not include collection name, file name, or mode name.
Keep Default as part of the name.
Convert spaces, underscores, and camelCase to kebab-case.
Use lowercase only.
If a token already has code syntax, compare it with the standard syntax generated from the current token path.
If the existing code syntax is missing, add it.
If the existing code syntax is incorrect, overwrite it with the standard Web CSS syntax.
Only set Web CSS code syntax; do not generate iOS, Android, SCSS, or raw custom property formats.

Example:
Color / Text / Brand / Default → var(--color-text-brand-default)
Color / Blue / 600 → var(--color-blue-600)
Tag / Color / Neutral / Bg / Default → var(--tag-color-neutral-bg-default)
```
