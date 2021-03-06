# 学习笔记

组件化就是怎么样去扩展 HTML 标签，从这样引申出来的前端架构体系。主要目标就是复用。

架构就是 MVC、MVVM，它关心的就是前端和数据逻辑层之间的交互。

组件化比 MVC 的架构模式更重要一些，它决定了团队的组件复用率。

## 组件基本概念以及组成部分

### 对象与组件

#### 对象三大要素

- Properties
- Methods
- Inherit

> JavaScript 进行时，默认的是原型继承


#### 组件

一般认为组件是跟　UI 强相关的一种东西，某种意义上可以认为它是一种特殊的模块，或者是特殊的对象。它的特点就是可以以树形结构来进行组合，并且模板化的配置的能力。这就是组件的基本概念。

> 组件即是模块又是对象

- Properties
- Methods
- Inherit
- Attribute：有时翻译也叫**特性**
- Config & State
- Event：向外传递东西
- Lifecycle
- Children：形成树形结构

attribute 往往是用　markup language　这种声明式的语言。

## 6. 轮播组件 | 轮播组件（三）

鼠标事件中的 `clientX` 与 `clientY` ，它表示相对于整个浏览器中可渲染区域的一个坐标。它不受任何因素的影响。比如一个组件在一个可滚动容器内，容器滚动后，`clientX` 与 `clientY` 仍然不变。

## 7. 轮播组件 | 轮播组件（四）

在本例中，一次最多显示两张图片，所以只需要移动两张图片即可。但为了方便，可以将当前图片的前后两张都做处理。