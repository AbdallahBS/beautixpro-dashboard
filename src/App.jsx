import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Products from './components/Products'
import Categories from './components/Categories'

function App() {
  const [currentPage, setCurrentPage] = useState('products')

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <Products />
      case 'categories':
        return <Categories />
      default:
        return <Products />
    }
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-content">
        <header className="header">
          <h1>Beautix Dashboard</h1>
        </header>
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default App
