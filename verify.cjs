const assert = require('node:assert/strict');
const { QUESTIONS, MODE_KEYS, CONTEXTS, calcResult } = require('./questions.js');
const total = QUESTIONS.length;
assert.equal(total, 14);
assert.deepEqual(QUESTIONS.map(q => q.id), Array.from({length:14}, (_,i)=>i+1));
assert.equal(new Set(QUESTIONS.map(q => q.text)).size, 14);
assert.ok(!QUESTIONS.some(q => q.text.includes('一位熟悉的朋友加入')));
for (const q of QUESTIONS) {
  assert.equal(q.options.length, 4);
  assert.deepEqual(q.options.map(o => o.key), ['A','B','C','D']);
  assert.deepEqual(q.options.map(o => o.mode).sort(), [...MODE_KEYS].sort());
  assert.ok(q.options.every(o => o.text.length > 0));
}
for (const mode of MODE_KEYS) {
  for (const key of ['A','B','C','D']) {
    const count = QUESTIONS.filter(q => q.options.find(o => o.key === key).mode === mode).length;
    assert.ok(count === 3 || count === 4);
  }
  const result = calcResult(QUESTIONS.map(q => q.options.find(o => o.mode === mode).key));
  assert.deepEqual(result.leaders, [mode]);
  assert.equal(result.scores[mode], total);
  assert.equal(result.total, total);
  assert.equal(result.shares[mode], 100);
  assert.ok(result.contexts.every(c => c.scores[mode] === c.total));
}
for (const key of ['A','B','C','D']) {
  const result = calcResult(Array(total).fill(key));
  assert.equal(result.leaders.length, 2);
  assert.ok(MODE_KEYS.every(k => [3,4].includes(result.scores[k])));
}
const tied = calcResult(QUESTIONS.map((q,i) => q.options.find(o => o.mode === (i%2?'C':'A')).key));
assert.deepEqual(tied.leaders, ['C','A']);
assert.equal(tied.scores.C, 7);
assert.equal(tied.scores.A, 7);
assert.throws(() => calcResult([]));
assert.throws(() => calcResult(Array(total).fill(null)));
assert.throws(() => calcResult(Array(total).fill('E')));
assert.throws(() => calcResult(Array(24).fill('A')));
const contextCounts={social:2,work:2,voice:2,opportunity:3,boundary:3,feedback:2};
for (const key of Object.keys(CONTEXTS)) assert.equal(QUESTIONS.filter(q => q.context === key).length, contextCounts[key]);
// Deterministic mixed answers exercise sums and breakdowns without random flaky tests.
for (let seed=0;seed<100;seed++) {
  let state=seed+1;
  const answers=QUESTIONS.map(()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return 'ABCD'[(state>>>16)%4];});
  const result=calcResult(answers);
  assert.equal(Object.values(result.scores).reduce((a,b)=>a+b),total);
  assert.equal(result.contexts.length,6);
  for (const context of result.contexts) assert.equal(context.total,contextCounts[context.key]);
  for(const mode of MODE_KEYS) assert.equal(result.contexts.reduce((sum,c)=>sum+c.scores[mode],0),result.scores[mode]);
  assert.ok(Math.abs(Object.values(result.shares).reduce((a,b)=>a+b)-100)<1e-9);
}
console.log('PASS: 14 questions, 56 options, four dominant modes, ties, six variable-size contexts, invalid input and 100 mixed-answer cases.');
