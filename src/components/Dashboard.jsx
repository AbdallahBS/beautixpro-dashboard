import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        visibleProducts: 0,
        totalCategories: 0,
        lowStock: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsAPI.getAll(),
                categoriesAPI.getAll()
            ]);

            const products = productsRes.data;
            const categories = categoriesRes.data;

            setStats({
                totalProducts: products.length,
                visibleProducts: products.filter(p => p.status === 'visible').length,
                totalCategories: categories.length,
                lowStock: products.filter(p => p.stock < 10).length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Dashboard</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Produits</div>
                    <div className="stat-value">{stats.totalProducts}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Produits Visibles</div>
                    <div className="stat-value">{stats.visibleProducts}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Catégories</div>
                    <div className="stat-value">{stats.totalCategories}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Stock Faible</div>
                    <div className="stat-value" style={{
                        background: stats.lowStock > 0 ? 'linear-gradient(135deg, #ff9800, #ff6b6b)' : undefined,
                        WebkitBackgroundClip: stats.lowStock > 0 ? 'text' : undefined,
                        WebkitTextFillColor: stats.lowStock > 0 ? 'transparent' : undefined
                    }}>
                        {stats.lowStock}
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Bienvenue sur Beautix Dashboard</h3>
                <p style={{ color: 'var(--text-gray)', lineHeight: 1.6 }}>
                    Gérez vos produits, catégories et commandes depuis cette interface d'administration.
                    Utilisez le menu de gauche pour naviguer entre les différentes sections.
                </p>
            </div>
        </div>
    );
}

export default Dashboard;
