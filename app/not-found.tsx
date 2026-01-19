import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col gap-2 justify-center  items-center h-[90vh]'>
      <h2 className='text-5xl font-bold'>404 Not Found</h2>
      <p className='text-gray-500'>Could not find requested resource</p>
      <Link href="/home" className='underline text-yellow-500'>Return Home -{'>'}</Link>
    </div>
  )
}