import { v4 } from 'uuid'
import type { AIMessage } from '../types'
import { JSONFilePreset } from 'lowdb/node'

type DBMessage = AIMessage & {
  id: string
  createdAt: string
}

type Data = {
	messages: DBMessage[]
}

const DEFAULT_DATA: Data = {
	messages: []
}

export function addMetaData({ message }: { message: AIMessage }): DBMessage {
  const dbMessage: DBMessage = {
    ...message,
    id: v4(),
    createdAt: new Date().toISOString(),
  }

  return dbMessage
}

export function removeMetadata({dbMessage}: {dbMessage: DBMessage}): AIMessage {
	const {id, createdAt, ...rest} = dbMessage
	return rest
}

export async function getDB() {
	const db = await JSONFilePreset<Data>('db.json', DEFAULT_DATA)
	return db
}

export async function addMessages({messages}: {messages: AIMessage[]}) {
	const db = await getDB()
	db.data.messages.push(...messages.map((m) => addMetaData({message: m})))
	await db.write()
}

export async function getMessages() {
	const db = await getDB()
	return db.data.messages.map(m => removeMetadata({dbMessage: m}))
}
