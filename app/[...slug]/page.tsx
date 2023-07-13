import { KeyValue } from '../components/KeyValue'

export default async function Subpage(props: { params: { slug: string[] } }) {
  const { params } = props
  // Show the current slug on this page
  // Turn params.slug into a redis key, e.g. ['a', 'b', 'c'] => 'a:b:c'
  const redisKey = params.slug.join(':')
  return <KeyValue redisKey={redisKey} />
}
