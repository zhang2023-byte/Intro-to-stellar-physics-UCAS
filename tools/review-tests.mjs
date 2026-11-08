import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ROOT} from './build.mjs';
import {plain,prose,style} from './review.mjs';

test('可读正文用无障碍说明替换公式和图示，并展开题目',()=>{
 assert.equal(plain('a<math aria-label="E 等于 h ν"><mi>E</mi></math>b'),'a〔式：E 等于 h ν〕b');
 assert.equal(plain('<svg aria-label="示意图"><rect/></svg>'),'〔图：示意图〕');
 assert.equal(plain('x<sub>i</sub> &lt; 1<!-- 提纲 -->'),'xi < 1');
 const ids=fs.readdirSync(`${ROOT}/lessons`).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3));
 const text=prose(ids[0]);
 assert.ok(!/<math|<svg|<!--/.test(text));
 assert.match(text,/Q1 \[/);
});

test('写法信号能识别告诫堆叠、编写说明和提前给出读数',()=>{
 const src=`\`\`\`lesson\n{"id":"v2-chz","version":"1.0.0","updated":"2026-10-27","title":"t","summary":"s","scope":"x","sources":["y"]}\n\`\`\`\n\n## 甲 {#a}\n\n这里不能这样，也不等于那样。本课采用一个约定。\n\n\`\`\`activity\n{"id":"edge-lab","type":"edges"}\n\`\`\`\n\n把 n 设为 2，读数为 3.4 eV。\n\n## 习题 {#exercises}\n\n\`\`\`quiz\n[{"id":"q1","type":"truefalse","question":"q","options":[{"id":"T","text":"正确"},{"id":"F","text":"错误"}],"answer":"F","explanation":"该说法不成立。","concept":"a"}]\n\`\`\`\n`;
 const kinds=style('v2-chz',src).signals.map(s=>s[1]).join('\n');
 assert.match(kinds,/2 处告诫/);
 assert.match(kinds,/编写或勘读说明/);
 assert.match(kinds,/先预测/);
 assert.match(kinds,/解析约/);
 assert.deepEqual(style('v2-ch07').signals.filter(s=>/告诫|编写|先预测/.test(s[1])),[]);
});
