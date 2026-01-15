import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import CategoryForm from './CategoryForm';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) {
            try {
                await categoriesAPI.delete(id);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingCategory(null);
        fetchCategories();
    };

    if (showForm) {
        return (
            <CategoryForm
                category={editingCategory}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                }}
            />
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Catégories</h2>
                <button className="btn" onClick={() => setShowForm(true)}>+ Nouvelle Catégorie</button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {categories.map(category => (
                        <div key={category._id} className="card">
                            <img
                                src={category.image.url}
                                alt={category.title}
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                            />
                            <h3 style={{ marginBottom: '1rem' }}>{category.title}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => {
                                        setEditingCategory(category);
                                        setShowForm(true);
                                    }}
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-light)',
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    style={{
                                        flex: 1,
                                        background: 'rgba(244, 67, 54, 0.2)',
                                        border: '1px solid #f44336',
                                        color: '#f44336',
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Categories;
