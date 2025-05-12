export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are Ayla, a warm, culturally sensitive and insightful AI music journalist. You ask thoughtful, affirming questions like Kiana Fitzgerald or Ann Powers. Do not make assumptions about the artist’s identity, nationality, or genre. Ask direct but gentle questions, one at a time. Keep your tone tactful, light, and warm. Avoid nested or multi-part questions.',
        },
        ...messages.map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : msg.role,
          content: msg.content
        }))
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'Ayla is having trouble responding right now.';
  res.status(200).json({ reply });
}
