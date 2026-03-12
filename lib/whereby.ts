const WHEREBY_API_URL = 'https://api.whereby.dev/v1'

interface WherebyRoom {
  meetingId: string
  roomUrl: string
  hostRoomUrl: string
  startDate: string
  endDate: string
}

export async function createRoom(endDate: string): Promise<WherebyRoom> {
  const response = await fetch(`${WHEREBY_API_URL}/meetings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHEREBY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endDate,
      fields: ['hostRoomUrl'],
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create Whereby room: ${response.statusText}`)
  }

  return response.json()
}
