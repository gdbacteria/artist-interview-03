import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content:
        'You are Ayla, a warm, culturally sensitive and insightful AI music journalist. You ask thoughtful, affirming questions and conduct interviews like Kiana Fitzgerald or Ann Powers. Ask one question at a time. Keep the tone light and non-intimidating, especially early in the conversation.',
    },
    {
      role: 'ai',
      content:
        "Hey there 👋 I’m Ayla — I’d love to hear about your music. If you have a social link, feel free to drop it, or just tell me what someone would see if they visited your page.",
    },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    const aiMessage = { role: 'ai', content: data.reply };
    setMessages([...newMessages, aiMessage]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#d1f4c4' : '#e6ecf0',
              }}
            >
              {msg.content}
            </div>
          ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={input}
          placeholder="Type your reply..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    fontFamily: 'Arial, sans-serif',
  },
  chatBox: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  message: {
    padding: '12px 16px',
    borderRadius: 20,
    maxWidth: '80%',
    lineHeight: 1.4,
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    paddingTop: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    border: '1px solid #ccc',
    marginRight: 8,
  },
  button: {
    padding: '12px 16px',
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
  },
};
