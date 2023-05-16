import { FC } from 'react'
import NoResultsSearch from '../../assets/search-no-results.webp'

const NoSearchResults: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img src={NoResultsSearch} alt="search not found" className="w-[250px]" />
      <h1 className="text-[24px]">
        No results were found that matched the keyword. Please try again.
      </h1>
    </div>
  )
}

export default NoSearchResults
