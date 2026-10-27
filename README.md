# AI Web Coaching Platform — Final Frontend Demo

Based on the uploaded frontend_demo.zip. This is an interactive **frontend-only** prototype; AI responses, terminal output and learning-objective events are simulated.

## Requirements
Node.js 18+ and npm.

## Run
```bash
npm install
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

## Tests
```bash
npm test
npm run build
```

Generate json test report:

```bash
npx vitest run --reporter=json --outputFile=vitest-results.json
```

VS Code automatic format (indentation and line wrapping): Shift + Alt + F

## Demo script
1. Select Linux Skills.
2. Enter `ls -l` and observe objective 1 update.
3. Enter `chmod 600 notes.txt` and observe objective 2 update.
4. Enter `pwd` and observe objective 3 update.
5. Open AI Chat, submit a question and reveal hints sequentially.
6. Switch to Cybersecurity Fundamentals; observe objectives and progress reset.

## Limitations
No live LLM, backend API, WebSocket, authentication, or actual Linux execution. Do not describe these simulations as integrated services.
