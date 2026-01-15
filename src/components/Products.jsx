import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductForm from './ProductForm';

function Products() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
            try {
                await productsAPI.delete(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingProduct(null); fetchProducts();
    };

    if (showForm) {
        return (
            <ProductForm
                product={editingProduct}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                }}
            />
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Produits</h2>
                <button className="btn" onClick={() => setShowForm(true)}>+ Nouveau Produit</button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Nom</th>
                                <th>Catégorie</th>
                                <th>Prix</th>
                                <th>Stock</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        {product.images[0] && (
                                            <img
                                                src={product.images[0].url}
                                                alt={product.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category?.title}</td>
                                    <td>
                                        {product.prixApresRemise ? (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: 'var(--text-gray)', marginRight: '0.5rem' }}>
                                                    {product.prixAvantRemise}€
                                                </span>
                                                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                                    {product.prixApresRemise}€
                                                </span>
                                            </>
                                        ) : (
                                            <span>{product.prixAvantRemise}€</span>
                                        )}
                                    </td>
                                    <td>
                                        <span style={{
                                            color: product.stock < 10 ? '#ff9800' : '#4caf50',
                                            fontWeight: 'bold'
                                        }}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${product.status === 'visible' ? 'status-completed' : 'status-pending'}`}>
                                            {product.status === 'visible' ? 'Visible' : 'Caché'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setEditingProduct(product);
                                                setShowForm(true);
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-light)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                marginRight: '0.5rem'
                                            }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            style={{
                                                background: 'rgba(244, 67, 54, 0.2)',
                                                border: '1px solid #f44336',
                                                color: '#f44336',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Products;
