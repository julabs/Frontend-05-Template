# 学习笔记

## 1. 重学HTML | HTML的定义：XML与SGML

HTML 的主要源流来自于 XML 与 SGML，在某种意义上来讲，XML 与 SGML 是 HTML 的一个超集。但发展到 HTML5 的时代，HTML 与它俩的关系已经变的有些模糊了，HTML5 重新定义了与突它们的关系，HTML 变成了吸取XML 与 SGML 一些灵感的独立语言。

XML 也是 SGML 的一个子集。

当使用 `&nbsp;` 字符去连接两个词的时候，会被认为是一词，在排版时，会出现分词的问题。不推荐使用，最好使用 CSS 去实现空格的效果。

必知必会的转义：

1. quot：双引号
2. amp：& 连接符
3. lt：小于号
4. gt:大于号

写在 HTML 里面不会报错，但是写在属性里面会报销

### XML namespace

HTML5 会把 HTML 写法与 XHTML 写法作为两种不同的语法。

## 2. 重学HTML | HTML标签语义

HTML 是一个语文系统，应该首先保证它的语义表达的正确，然后再关注表现部分。

`main` 标签在整个页面只能有一个，是页面的主体部分，而无论它在页面中的顺序是如何的。

当没有合适的标签，或者并不了解合适的标签去处理某一语义的时候，可以使用　`class` 作为一个补充。

### strong 和　em 的区别

strong 表示这个词在整个文章中重要性的场景，它不改变语义，表明这个词很重要。
而　em　表示这个词在句子里面的重音是什么，em 其实是一种辅助的语气表示。

## 3. 重学HTML | HTML语法

### 合法元素

1. Element：<tagname>...</tagname>
2. Text：text
3. Comment： <!-- comments -->
4. DocumentType：<!Doctype html>。HTML5 只有一个
5. ProcessingInstruction：<?a 1?>。理论上是一种预处理的语法，一般是留出来问号后面的内容，去给一些对预处理程序去使用。
6. CDATA：<![CDATA：[]]>。也是文本节点，里面的文字不需要考虑转义。

###　字符引用

- &#161;
- &amp;
- &lt;
- &quot;

## 4. 浏览器API | DOM API

### 节点类　API

- Node
  - Element：元素型节点，跟标签相对应
    - HTMLElement：
      - HTMLAnchorElement
      - HTMLAppleElement
      - HTMLAreaElement
      - HTMLAudioElement
      - HTMLBaseElement
      - HTMLBodyElement
      - ...
    - SVGElement
      - SVGAElement
      - SVGAltGlyphElement
      - ...
  - Document：文档根节点
  - CharacterData：字符数据
    - Text：文本节点
      - CDATASection：CDATA节点
    - Comment：注释
    - ProcessingInstruction：处理信息
  - DocumentFragment：文档片段，它无法挂到　DOM 树上，但也继承了　Node 节点，也可以执行操作
  - DocumentType：文档类型


### 导航类操作

#### Node

查找 Node，可能会找到文本节点，这通常不是想要的。

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

#### Element

只查找 element，文本节点会被忽略

- parentElement
- children
- firstElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling

`parentNode` 与 `parentElement` 是重复的，因为一个非 Element 节点，是不会有子节点的。

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

之所以没有 `insertAfter`，是因为根据最小化原则，它完全可以使用 `appendChild` 和 `insertBefore` 来实现。

`replaceChild` 也完全可以使用 `removeChild` 和 `insertBefore`、`appendChild` 来实现，但也许会有减小 DOM 操作的作用，它可能会一次性替换元素。

### 高级操作

- compareDocumentPosition 是一个用于比较两个节点中关系的函数，可以得到前后的这样的关系。
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否完全相同，只要 DOM 树的结构相同，就返回 `true`。这个非常有用，在比较两个节点时，就不用序列化树形结构了。
- isSameNode 是一个废的 API，它用于检查两个节点是否是同一个节点，实际上在 JavaScript 中可以使用 `===`
- cloneNode 复制一个节点，如果传入参数 `true`，则会连同子元素做深拷贝。它的速度很快，尤其是深拷贝非常有用。在制做 HTML 模板时，可以使用 cloneNode 去大量的复制。

## 5. 浏览器API | 事件API

### Event：冒泡与捕获

冒泡与捕获过程是浏览器自己去处理事件的一套机制，无论有没有加 `addEventListener` 去监听，浏览器都会处理这个过程。

任何一个事件，都会有一个先捕获再冒泡的过程。

## 6. 浏览器API | Range API

当操作半个节点，或者操纵批量节点，就可以使用 Range API 了。

### Range API

#### 手动设置：
- var range = new Range()
- range.setStart(element, 9)
- range.setEnd(element, 4)

#### 获得

目前 selection 只支持一个 Range，所以使用 `getRangeAt(0)` 就可以选中一个 range

- var range = document.getSelection().getRangeAt(0)

可以理解为在 HTML 文档流中有起始点和一个终止点的一段范围，它是不能够跳的。可能有多个范围，但每一个 range 它一定是一个连续的范围。它不需要管层级关系，只要它的终止点在起始点之前。

起始点是由一个 element 和一个偏移值来决定的。对于 element 来说，它的偏移值就是 children，对于 text 来说偏移值就是文字的个数。

#### 便捷方式

- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents

### Range API

- var fragment = range.extractContents()
- range.insertNode(document.createTextNode('aaaa'))

这两个操作基本就完成了删和加


## 7. 浏览器API | CSSOM

### styleSheets

#### Rules

- document.styleSheets[0].cssRules
- document.styleSheets[0].insertRule("p{color:pink;}", 0)
- document.styleSheets[0].removeRule(0)


styleSheets 就代表一个样式表，它对应一个 `style` 标签，或者一个 `link` 标签，里面有若干条 rule。

#### CSS Rule

- CSSStyleRule
- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFontFaceRule
- CSSPageRule
- CSSNamespaceRule
- CSSKeyframesRule
- CSSKeyframeRule
- CSSSupportsRule
- ......

CSS 规则分成 at-rule 和普通 rule，普通 rule 就叫 CSSStyleRule。

#### CSSStyleRule

- selectorText String：选择器部分
- style K-V 结构

通过 `cssRules` 去修改样式：

```javascript
document.styleSheets[0].cssRules[0].style.color = 'lightgreen'
```

#### getComputedStyle

可以取到页面元素最終渲染时候的 CSS 的属性，同时也能够访问到元素上的样式信息。

- window.getComputedStyle(elt, pseudoElt);
  - elt 想要获取的元素
  - pseudoElt 可选，伪元素

```javascript
window.getComputedStyle(document.querySelector('a'));
window.getComputedStyle(document.querySelector('a'), '::before');
window.getComputedStyle(document.querySelector('a'), '::before').color;
```

可以获得元素的 transform 值，比如用在拖曳，最好都是使用 `getComputedStyle`。还有在 CSS 动画，它有一些中间态，我们可能想要暂停这个动画。这时没有办法使 DOM API，style 属性和 CSSRules 去判断当前播放到哪里了，因为它是个中间值。这个时候也可以使用 `getComputedStyle` 去处理这个问题。


## 8. 浏览器API | CSSOM View

在 layout 之后，实际渲染出来的东西，也会包含一部分属性。怎样获得 layout，或者 render 之后得到的一些信息。这时，就要靠 CSSOM 的 View 部分的 API。

CSSOM View 部分的 API 已经和 CSS 的语言模型已经不太一致了，它主要跟浏览器最后绘制的视图非常的相关。

### window

- window.innerHeight, window.innerWidth
- window.outerWidth, window.outerHeight
- window.devicePixelRatio
- window.screen
  - window.screen.width
  - window.screen.height
  - window.screen.availWidth
  - window.screen.availHeight

### window API

- window.open("about:blank", "_blank", "width=100,height=100,left=100,right=100")
- moveTo(x, y)
- moveBy(x, y)
- resizeTo(x, y)
- resizeBy(x, y)

### scroll

只有在有滚动条的时候，这些 API 才会生效。

- scrollTop
- scrollLeft
- scrollWidth
- scrollHeight
- scroll(x, y)
- scrollBy(x, y)
- scrollIntoView()
- window
  - scrollX
  - scrollY
  - scroll(x, y)
  - scrollBy(x, y)

### layout

- getClientRects()：获得元素生成的所有盒
- getBoundingClientRect()：获得包裹元素所有内容的方块，只能取到一个，会取出所有元素生成的盒包含的区域

伪元素中在页面中是无法被选中的，里面包含的文字也无法复制


## 9. 浏览器API | 其它API

### 标准化组织

API 主要来源于４个标准化组织

- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - CG/WG