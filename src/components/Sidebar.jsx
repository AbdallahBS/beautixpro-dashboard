import '../styles/Sidebar.css'

function Sidebar({ currentPage, setCurrentPage }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Beautix</h2>
                <p>Admin Panel</p>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${currentPage === 'products' ? 'active' : ''}`}
                    onClick={() => setCurrentPage('products')}
                >
                    Produits
                </button>

                <button
                    className={`nav-item ${currentPage === 'categories' ? 'active' : ''}`}
                    onClick={() => setCurrentPage('categories')}
                >
                    Catégories
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar
