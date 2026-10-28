import { createRequire } from 'node:module';
const require = createRequire('/Users/damiantarnawsky/Library/Application Support/Tarsk/data/rn-ios/');
const WS = require('ws');
const res = await fetch('http://127.0.0.1:9229/json/list');
const [target] = await res.json();
const ws = new WS(target.webSocketDebuggerUrl);
let id = 0;
const send = (method, params = {}) => new Promise((resolve) => {
  const myId = ++id;
  const onMsg = (raw) => {
    const msg = JSON.parse(raw);
    if (msg.id === myId) { ws.off('message', onMsg); resolve(msg.result); }
  };
  ws.on('message', onMsg);
  ws.send(JSON.stringify({ id: myId, method, params }));
});
ws.on('open', async () => {
  await send('Debugger.enable');
  ws.on('message', async (raw) => {
    const msg = JSON.parse(raw);
    if (msg.method === 'Debugger.paused') {
      const frames = msg.params.callFrames.slice(0, 30).map(f => `${f.functionName || '<anon>'} @ ${f.url.split('/').slice(-2).join('/')}:${f.location.lineNumber + 1}`);
      console.log(frames.join('\n'));
      process.exit(0);
    }
  });
  await send('Debugger.pause');
  setTimeout(() => { console.log('no pause event'); process.exit(1); }, 8000);
});
