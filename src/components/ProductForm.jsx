import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import '../styles/CategoryForm.css';

const API_URL = 'http://localhost:5000/api';

function ProductForm({ product, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        prixAvantRemise: '',
        prixApresRemise: '',
        fraisLivraison: 0,
        stock: 0,
        status: 'visible',
        featured: false,
        images: []
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
        fetchCategories();
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                category: product.category._id || product.category,
                prixAvantRemise: product.prixAvantRemise,
                prixApresRemise: product.prixApresRemise || '',
                fraisLivraison: product.fraisLivraison,
                stock: product.stock,
                status: product.status,
                featured: product.featured,
                images: product.images
            });
        }
    }, [product]);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError('');

        try {
            const formDataUpload = new FormData();
            Array.from(files).forEach(file => {
                formDataUpload.append('images', file);
            });

            const response = await fetch(`${API_URL}/upload/multiple`, {
                method: 'POST',
                body: formDataUpload,
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...data.data]
                }));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Erreur lors du téléchargement');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const moveImage = (fromIndex, toIndex) => {
        const newImages = [...formData.images];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        moveImage(draggedIndex, index);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submitData = {
                ...formData,
                prixApresRemise: formData.prixApresRemise || null
            };

            if (product) {
                await productsAPI.update(product._id, submitData);
            } else {
                await productsAPI.create(submitData);
            }
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="form-container">
            <h2>{product ? 'Modifier Produit' : 'Nouveau Produit'}</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom du produit *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Catégorie *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Prix avant remise (€) *</label>
                        <input
                            type="number"
                            name="prixAvantRemise"
                            value={formData.prixAvantRemise}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Prix après remise (€)</label>
                        <input
                            type="number"
                            name="prixApresRemise"
                            value={formData.prixApresRemise}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label>Frais de livraison (€)</label>
                        <input
                            type="number"
                            name="fraisLivraison"
                            value={formData.fraisLivraison}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Statut</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="visible">Visible</option>
                            <option value="hidden">Caché</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                style={{ width: 'auto', marginRight: '0.5rem' }}
                            />
                            Produit en vedette
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Images * (La première image sera l'image principale)</label>
                    <div className="image-upload">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="product-images"
                            disabled={uploading}
                        />
                        <label htmlFor="product-images" className="btn-upload">
                            {uploading ? 'Téléchargement...' : '+ Ajouter des images'}
                        </label>

                        {formData.images.length > 0 && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-gray-50)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-gray)' }}>
                                💡 Glissez-déposez les images pour changer l'ordre. Image #1 = Image principale frontend
                            </div>
                        )}

                        {formData.images.length > 0 && (
                            <div className="images-grid">
                                {formData.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`image-item ${draggedIndex === index ? 'dragging' : ''}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <img src={image.url} alt={`Product ${index + 1}`} />
                                        <div className="image-controls">
                                            <span className="image-order">{index + 1}</span>
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeImage(index)}
                                                title="Supprimer"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="move-buttons">
                                            <button
                                                type="button"
                                                className="move-btn"
                                                onClick={() => moveImage(index, index - 1)}
                                                disabled={index === 0}
                                                title="Déplacer à gauche"
                                            >
                                                ←
                                            </button>
                                            <button
                                                type="button"
                                                className="move-btn"
                                                onClick={() => moveImage(index, index + 1)}
                                                disabled={index === formData.images.length - 1}
                                                title="Déplacer à droite"
                                            >
                                                →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
                        {loading ? 'En cours...' : product ? 'Modifier' : 'Créer'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;
