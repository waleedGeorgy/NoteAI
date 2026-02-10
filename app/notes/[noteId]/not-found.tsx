import Link from "next/link"

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-2 space-y-2">
            <h1 className="text-4xl font-bold text-indigo-400 tracking-tight">
                404 - PAGE NOT FOUND
            </h1>
            <p className="text-lg font-semibold text-gray-100">
                Nothing to see here, the requested note does not exist
            </p>
            <Link className="mt-2 bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500 transition-colors duration-200 text-gray-100 text-sm font-semibold" href="/dashboard">
                Back to notes
            </Link>
        </div>
    )
}

export default NotFoundPage