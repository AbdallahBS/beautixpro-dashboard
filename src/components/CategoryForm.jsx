import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import '../styles/CategoryForm.css';

const API_URL = 'http://localhost:5000/api';

function CategoryForm({ category, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        image: { publicId: '', url: '' }
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (category) {
            setFormData({
                title: category.title,
                image: category.image
            });
        }
    }, [category]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await fetch(`${API_URL}/upload/single`, {
                method: 'POST',
                body: formDataUpload,
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    image: data.data
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (category) {
                await categoriesAPI.update(category._id, formData);
            } else {
                await categoriesAPI.create(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>{category ? 'Modifier Catégorie' : 'Nouvelle Catégorie'}</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titre *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Image *</label>
                    <div className="image-upload">
                        {formData.image.url && (
                            <img src={formData.image.url} alt="Preview" className="image-preview" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="category-image"
                            disabled={uploading}
                        />
                        <label htmlFor="category-image" className="btn-upload">
                            {uploading ? 'Téléchargement...' : formData.image.url ? 'Changer Image' : 'Sélectionner Image'}
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
                        {loading ? 'En cours...' : category ? 'Modifier' : 'Créer'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CategoryForm;
