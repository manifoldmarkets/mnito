import { kv } from '@vercel/kv'
import { redirect } from 'next/navigation'

// Given a JSON object, return the same object with its keys sorted alphabetically
function stable(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  )
}

function Pair({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-row gap-2">
      <div
        className="w-1/2 text
      -gray-700 text-right"
      >
        {`${k}: `}
      </div>
      <div className="w-1/2 text-gray-700">{v}</div>
    </div>
  )
}

export default async function KeyValue() {
  const data = (await kv.hgetall('data')) as Record<string, string>
  console.log('data', stable(data))

  async function setData(data: FormData) {
    'use server'
    // Convert FormData to JSON
    const json = Object.fromEntries(data.entries())
    const final = { [json.shortlink as string]: json.longlink }
    console.log('final is', final)
    await kv.hset('data', final)
    // Redirect to the current page
    redirect('/kv')
  }
  return (
    <div className="p-4 max-w-sm m-auto">
      {/* <p>Hello world! data: {JSON.stringify(stable(data))}</p> */}
      {/* Render a Pair for each entry in stable(data) */}
      {Object.entries(stable(data)).map(([key, value]) => (
        <Pair key={key} k={key} v={value} />
      ))}

      <form action={setData} autoComplete="off">
        <input
          name="shortlink"
          placeholder="Key"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          name="longlink"
          placeholder="Value"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Set
        </button>
      </form>
    </div>
  )
}
