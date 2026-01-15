const API_URL = 'https://beautix.netlify.app';

// Generic API call handler
const apiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Products API
export const productsAPI = {
    getAll: () => apiCall('/products'),
    getVisible: () => apiCall('/products/visible'),
    getById: (id) => apiCall(`/products/${id}`),
    create: (productData) => apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    }),
    update: (id, productData) => apiCall(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    }),
    delete: (id) => apiCall(`/products/${id}`, {
        method: 'DELETE',
    }),
};

// Categories API
export const categoriesAPI = {
    getAll: () => apiCall('/categories'),
    getById: (id) => apiCall(`/categories/${id}`),
    create: (categoryData) => apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
    }),
    update: (id, categoryData) => apiCall(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
    }),
    delete: (id) => apiCall(`/categories/${id}`, {
        method: 'DELETE',
    }),
};

export default { productsAPI, categoriesAPI };
