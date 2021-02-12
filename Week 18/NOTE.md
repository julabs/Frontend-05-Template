# 学习笔记

## 3. 单元测试工具 | code coverage

也可以使用 `nyc npm run babeltest`，来执行 `nyc ./node_modules/.bin/mocha --require @babel/register`

## 4. 单元测试工具 | 对html-parser进行单元测试

nyc 比较重要，code coverager 非常关键，

如果在使用 babel 时，用 register ，要在 .bablerc 中将 sourceMaps 设为 inline ，否则 vs code 找不到 sourceMap 文件，不知道 sourceMap 文件会输出到哪里去。