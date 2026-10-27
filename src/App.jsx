import { useState } from 'react';
import './style.css';

// 1. Course Data
export const courses = {
    linux: {
        title: 'Linux Skills',
        subtitle: 'File permissions lab',
        objectives: [
            {
                id: 'obj-1',
                title: 'Inspect file permissions'
            },
            {
                id: 'obj-2',
                title: 'Modify file permissions'
            },
            {
                id: 'obj-3',
                title: 'Check current directory'
            }
        ]
    },

    cyber: {
        title: 'Cybersecurity Fundamentals',
        subtitle: 'Security awareness lab',
        objectives: [
            {
                id: 'obj-4',
                title: 'Identify security risks'
            },
            {
                id: 'obj-5',
                title: 'Explain access control'
            }
        ]
    }
};


// 2. Learning Objective Update Logic
export function updateCompleted(completed, event, validIds) {
    if (
        event?.type !== 'objective_completed' || !validIds.includes(event.objectiveId)
    ) {
        return completed;
    }

    return {
        ...completed,
        [event.objectiveId]: true
    };
}


// 3. Mock Terminal Logic
export function mockTerminal(command) {
    const c = command.trim();

    if (c === 'pwd') {
        return {
            output: '/home/student',
            objectiveId: 'obj-3'
        };
    }

    if (c === 'ls -l') {
        return {
            output:
                '-rw-r--r-- 1 student student 128 notes.txt\n' +
                'drwxr-xr-x 2 student student 4096 exercises',
            objectiveId: 'obj-1'
        };
    }

    if (c === 'chmod 600 notes.txt') {
        return {
            output: 'Permissions updated (simulation only).',
            objectiveId: 'obj-2'
        };
    }

    return {
        output:
            `Mock terminal: command "${c}" is not supported. ` +
            'Try pwd, ls -l or chmod 600 notes.txt.',
        objectiveId: null
    };
}


// 4. Mock AI Coaching Hints
const hints = [
    'Think about the Linux command that changes file permissions.',
    'The command begins with chmod. What permission value would allow only the owner to read and write?',
    'Try chmod 600 notes.txt, then use ls -l to inspect the result.'
];


// 5. Main React Component
export default function App() {

    // State: Course and Learning Progress
    const [courseId, setCourseId] = useState('linux');
    const [completed, setCompleted] = useState({});

    // State: AI Cha
    const [chatOpen, setChatOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [hintCount, setHintCount] = useState(0);

    // State: Terminal
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalLines, setTerminalLines] = useState(['Welcome to the simulated Linux lab. Try: ls -l']);
    
    // Derived Course Data
    const course = courses[courseId];
    const progress = course.objectives.filter((objective) => completed[objective.id]).length;

    // 6. Event Handlers

    // Switch between courses
    function switchCourse(id) {
        setCourseId(id);
        setCompleted({});
        setTerminalLines(['Course changed. Terminal output is simulated.']);
        setMessages([]);
        setHintCount(0);
    }

    // Mark a learning objective as completed
    function complete(id) {
        setCompleted((previous) =>
            updateCompleted(
                previous,
                {
                    type: 'objective_completed',
                    objectiveId: id
                },
                course.objectives.map((objective) => objective.id)
            )
        );
    }

    // Submit a question to the mock AI coach
    function sendQuestion(e) {
        e.preventDefault();

        if (!question.trim()) {
            return;
        }

        setMessages((previous) => [
            ...previous,
            {
                question: question.trim(),
                answer:
                    'Mock AI response: Start by checking what the task ' +
                    'asks you to do. Use progressive hints if you need guidance.'
            }
        ]);

        setQuestion('');
        setHintCount(0);
    }

    // Submit a simulated terminal command
    function submitTerminal(e) {
        e.preventDefault();

        if (!terminalInput.trim()) {
            return;
        }

        const command = terminalInput.trim();
        const result = mockTerminal(command);

        setTerminalLines((previous) => [
            ...previous,
            `$ ${command}`,
            result.output
        ]);

        if (courseId === 'linux' && result.objectiveId) {
            complete(result.objectiveId);
        }

        setTerminalInput('');
    }


    // 7. User Interface (JSX)
    return (
        <main className="app">

            {/* Header */}
            <header className="topbar">
                <div>
                    <div className="eyebrow">
                        STUDENT LEARNING PORTAL
                    </div>

                    <h1>AI Web Coaching Platform</h1>

                    {/* <p>
                        Interactive frontend prototype ·
                        Mock AI, terminal and progress events
                    </p> */}
                </div>

                <span className="status">● Frontend demo</span>
            </header>

            {/* Course Selection & Progress */}
            <section className="course-card">

                <div>
                    <label htmlFor="course">
                        Select course
                    </label>

                    <select
                        id="course"
                        value={courseId}
                        onChange={(e) => switchCourse(e.target.value)}
                    >
                        <option value="linux">
                            Linux Skills
                        </option>

                        <option value="cyber">
                            Cybersecurity Fundamentals
                        </option>
                    </select>

                    <h2>{course.title}</h2>
                    <p>{course.subtitle}</p>
                </div>

                <div className="progress">
                    <strong>
                        {progress} / {course.objectives.length}
                    </strong>

                    <span>objectives completed</span>

                    <div className="track">
                        <div
                            style={{width: `${(progress / course.objectives.length) * 100}%`}}
                        />
                    </div>
                </div>

            </section>

            {/* Main Dashboard Layout */}
            <div className="layout">

                {/* Terminal Interface */}
                <section
                    aria-label="Terminal interface"
                    className="panel"
                >
                    <div className="panel-head">
                        <h3>Terminal Canvas</h3>

                        <span className="tag">SIMULATED</span>
                    </div>

                    <div
                        className="terminal"
                        role="log"
                        aria-label="Terminal output"
                    >
                        {terminalLines.map((line, index) => (
                            <div key={index}>
                                {line}
                            </div>
                        ))}
                    </div>

                    <form
                        onSubmit={submitTerminal}
                        className="command-form"
                    >
                        <label htmlFor="terminal-command">
                            Terminal command
                        </label>

                        <div className="input-row">
                            <input
                                id="terminal-command"
                                // placeholder="Try ls -l"
                                value={terminalInput}
                                onChange={(e) =>
                                    setTerminalInput(e.target.value)
                                }
                            />

                            <button type="submit">
                                Run mock command
                            </button>
                        </div>
                    </form>

                    <p className="helper">
                        Try: <code>ls -l</code>,{' '}
                        <code>chmod 600 notes.txt</code>,{' '}
                        <code>pwd</code>.
                        No real shell commands are executed.
                    </p>
                </section>


                {/* Learning Objectives */}
                <aside
                    className="panel"
                    aria-label="Learning objectives"
                >
                    <div className="panel-head">
                        <h3>Learning Objectives</h3>

                        <span className="tag">
                            MOCK EVENTS
                        </span>
                    </div>

                    <p className="muted">
                        Progress is updated from simulated
                        completion events.
                    </p>

                    <ul className="objectives">
                        {course.objectives.map((item) => (
                            <li key={item.id}>
                                <input
                                    type="checkbox"
                                    aria-label={item.title}
                                    checked={!!completed[item.id]}
                                    readOnly
                                />

                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        className="secondary"
                        onClick={() => complete(course.objectives[1].id)}
                    >
                        Simulate completion of objective 2
                    </button>
                </aside>

            </div>

            {/* AI Coaching Chat Drawer */}
            <section className="panel chat">

                <div className="panel-head">
                    <div>
                        <h3>AI Coach</h3>

                        <p className="muted">
                            Progressive guidance instead of
                            giving the full answer immediately
                        </p>
                    </div>

                    <button
                        className="secondary"
                        onClick={() =>
                            setChatOpen((previous) => !previous)
                        }
                        aria-expanded={chatOpen}
                    >
                        Toggle AI Chat Drawer
                    </button>
                </div>

                {chatOpen && (
                    <div aria-label="AI chat drawer">

                        {/* Chat Input */}
                        <form onSubmit={sendQuestion}>
                            <label htmlFor="question">
                                Ask a question
                            </label>

                            <div className="input-row">
                                <input
                                    id="question"
                                    placeholder="How do I check file permissions?"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />

                                <button type="submit">
                                    Send
                                </button>
                            </div>
                        </form>

                        {/* Chat Messages */}
                        {messages.map((message, index) => (
                            <div
                                className="conversation"
                                key={index}
                            >
                                <p>You: {message.question}</p>
                                <p>{message.answer}</p>
                            </div>
                        ))}

                        {/* Progressive Hints */}
                        {messages.length > 0 && (
                            <div className="hints">

                                <h4>Progressive hints (mock)</h4>

                                {hints
                                    .slice(0, hintCount)
                                    .map((hint, index) => (
                                        <p key={index}>
                                            <strong>
                                                Hint {index + 1}:
                                            </strong>{' '}
                                            {hint}
                                        </p>
                                    ))}

                                {hintCount < hints.length && (
                                    <button
                                        className="secondary"
                                        onClick={() =>
                                            setHintCount((count) => count + 1)
                                        }
                                    >
                                        Reveal next hint
                                    </button>
                                )}

                            </div>
                        )}

                    </div>
                )}

            </section>


            {/* Footer */}
            {/* <footer>
                Assessment demonstration only.
                No live LLM API, backend WebSocket connection,
                authentication or Linux execution.
            </footer> */}

        </main>
    );
}
