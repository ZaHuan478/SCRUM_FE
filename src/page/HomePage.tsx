import { useState } from 'react'
import HomeTemplate from '../components/Templates/HomeTemplate'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    document.getElementById('featured-doctors')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <HomeTemplate onSearch={handleSearch} searchQuery={searchQuery} />
}

export default HomePage
