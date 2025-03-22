import React from 'react'

function SearchBar() {
    return (
            <div className="search-wrapper w-full hidden lg:flex flex-1  mx-auto bg-white pr- 2 pl-4 py-1 border rounded-full shadow sm:shadow-none">
                <form method="get" action="/jobs/" className="flex flex-1 mx-4">
                    <input className="flex-1  p-2 focus:outline-none overflow-hidden text-ellipsis" type="text" name="search_query" id="search" placeholder="Search jobs, companies, or keywords" />
                        <div className="border-l border-gray-300 mx-2 hidden lg:block"></div>
                        <div className="button-wrap">
                            <button type="submit" className="text-white bg-brand font-semibold rounded-full py-2 px-4">
                                Search
                            </button>
                        </div>
                </form>
            </div>
    )
}

export default SearchBar
