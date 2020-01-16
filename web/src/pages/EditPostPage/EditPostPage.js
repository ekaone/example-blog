import { Link, routes } from '@redwoodjs/router'

import EditPostCell from 'src/components/EditPostCell'

const EditPostPage = ({ id }) => {
  return (
    <div className="bg-white font-sans">
      <header className="flex justify-between py-4 px-8">
        <h1 className="text-xl font-semibold">
          <Link
            to={routes.posts()}
            className="text-gray-700 hover:text-gray-900 hover:underline"
          >
            Posts
          </Link>
        </h1>
        <nav>
          <Link
            to={routes.newPost()}
            className="flex bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wide rounded"
          >
            <div className="text-xl leading-none">+</div>
            <div className="ml-1 leading-loose">New Post</div>
          </Link>
        </nav>
      </header>
      <main className="mx-4">
        <EditPostCell id={parseInt(id)} />
      </main>
    </div>
  )
}

export default EditPostPage