import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
const source = await readFile(new URL('../src/lib/analytics/model.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const model = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const event = { id: 'a12a2c73-fd88-43ce-bd3a-d57333bd2e6e', path: '/cabin', kind: 'view', visit: true };
test('statistics only accept public pages and predefined clicks; guest details are discarded', () => {
  assert.deepEqual(model.parseVisitEvent({...event,email:'private@example.com',ip:'192.0.2.1'}),event);
  for(const patch of [{path:'/admin'},{path:'/booking/owner'},{path:'/reset-password'},{path:'/booking?email=private@example.com'},{kind:'private-message'},{id:'invalid'},{visit:'true'}]) assert.equal(model.parseVisitEvent({...event,...patch}),null);
  assert.equal(model.parseVisitEvent({...event,kind:'phone'}).visit,false);
});
test('daily summaries use Norwegian dates, include empty days and separate visits/views/clicks', () => {
  assert.equal(model.analyticsDay(new Date('2026-11-07T23:30:00Z')),'2026-11-08');
  const row={day:'2026-11-07',path:'/cabin',views:3,visits:1,booking:2,phone:1,email:1,navigation:4};
  const result=model.summarizeStats([row,{...row,day:'2026-10-01'},{...row,path:'/admin'}],7,'2026-11-07');
  assert.equal(result.daily.length,7);assert.equal(result.daily[0].day,'2026-11-01');
  assert.equal(result.totals.views,3);assert.equal(result.totals.visits,1);assert.equal(result.totals.booking,2);
  assert.deepEqual(result.pages,[{path:'/cabin',views:3,clicks:8}]);
});
test('statistics storage deduplicates retried events without storing visitor identifiers', async () => {
  const db=new DatabaseSync(':memory:');
  try {
    db.exec(await readFile(new URL('../analytics/schema.sql',import.meta.url),'utf8'));
    const insert=db.prepare('INSERT OR IGNORE INTO analytics_events (id,day,path,kind,visit) VALUES (?,?,?,?,?)');
    insert.run(event.id,'2026-11-07',event.path,event.kind,1);insert.run(event.id,'2026-11-07',event.path,event.kind,1);
    assert.equal(db.prepare('SELECT count(*) AS count FROM analytics_events').get().count,1);
    assert.deepEqual(db.prepare('PRAGMA table_info(analytics_events)').all().map(r=>r.name),['id','day','path','kind','visit']);
  } finally { db.close(); }
});
