const assert = require('node:assert/strict');
const { QUESTIONS, MODE_KEYS, CONTEXTS, calcResult } = require('./questions.js');
assert.equal(QUESTIONS.length, 24);
assert.equal(new Set(QUESTIONS.map(q => q.id)).size, 24);
assert.equal(new Set(QUESTIONS.map(q => q.text)).size, 24);
for (const q of QUESTIONS) {
  assert.equal(q.options.length, 4);
  assert.deepEqual(q.options.map(o => o.key), ['A','B','C','D']);
  assert.deepEqual(q.options.map(o => o.mode).sort(), [...MODE_KEYS].sort());
  assert.ok(q.options.every(o => o.text.length > 0));
}
for (const mode of MODE_KEYS) {
  for (const key of ['A','B','C','D']) {
    assert.equal(QUESTIONS.filter(q => q.options.find(o => o.key === key).mode === mode).length, 6);
  }
  const result = calcResult(QUESTIONS.map(q => q.options.find(o => o.mode === mode).key));
  assert.deepEqual(result.leaders, [mode]);
  assert.equal(result.scores[mode], 24);
  assert.equal(result.shares[mode], 100);
  assert.ok(result.contexts.every(c => c.scores[mode] === 4));
}
for (const key of ['A','B','C','D']) {
  const balanced = calcResult(Array(24).fill(key));
  assert.equal(balanced.balanced, true);
  assert.ok(MODE_KEYS.every(k => balanced.scores[k] === 6));
}
const tied = calcResult(QUESTIONS.map((q,i) => q.options.find(o => o.mode === (i%2?'C':'A')).key));
assert.deepEqual(tied.leaders, ['C','A']);
assert.equal(tied.balanced, false);
assert.throws(() => calcResult([]));
assert.throws(() => calcResult(Array(24).fill(null)));
assert.throws(() => calcResult(Array(24).fill('E')));
assert.throws(() => calcResult(Array(25).fill('A')));
for (const key of Object.keys(CONTEXTS)) assert.equal(QUESTIONS.filter(q => q.context === key).length, 4);
// Deterministic mixed answers exercise sums and breakdowns without random flaky tests.
for (let seed=0;seed<100;seed++) {
  let state=seed+1;
  const answers=QUESTIONS.map(()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return 'ABCD'[(state>>>16)%4];});
  const result=calcResult(answers);
  assert.equal(Object.values(result.scores).reduce((a,b)=>a+b),24);
  assert.equal(result.contexts.length,6);
  for(const mode of MODE_KEYS) assert.equal(result.contexts.reduce((sum,c)=>sum+c.scores[mode],0),result.scores[mode]);
  assert.ok(Math.abs(Object.values(result.shares).reduce((a,b)=>a+b)-100)<1e-9);
}
console.log('PASS: 24 questions, 96 options, balanced positions, four dominant modes, ties, neutral answers, six contexts, invalid input and 100 mixed-answer cases.');
