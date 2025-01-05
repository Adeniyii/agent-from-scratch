import type { AIMessage } from '../types.ts'
import { openai } from './ai.ts'
import { addMessages, getMessages } from './memory.ts'

export async function runLLM({userMessage}: {userMessage: string}) {
  const history = await getMessages()
  const messages: AIMessage[] = [{ role: 'user', content: userMessage }]

  const response = await openai.chat.completions.create({
    messages: [...history, ...messages],
    model: 'gpt-4o-mini',
    temperature: 0.1
  })

  if (response.choices[0].message.content) {
    messages.push({
      role: 'assistant',
      content: response.choices[0].message.content
    })
  }

  await addMessages({ messages })

  return response.choices[0].message.content
}
