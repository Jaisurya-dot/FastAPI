 // src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Adjust if your FastAPI runs on a different URL or port
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', description: '', price: '', quantity: '' });
  const [message, setMessage] = useState('');

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      setMessage('Failed to fetch products');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    try {
      // Convert price and quantity to number as backend expects
      const newProduct = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      };
      await api.post('/products', newProduct);
      setMessage('Product added successfully');
      setForm({ id: '', name: '', description: '', price: '', quantity: '' });
      fetchProducts();
    } catch (error) {
      setMessage('Error adding product');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      };
      await api.put(`/products/${form.id}`, updatedProduct);
      setMessage('Product updated successfully');
      fetchProducts();
    } catch (error) {
      setMessage('Error updating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      alert('Are you sure you want to delete this product?');
      await api.delete(`/products/${id}`);
      setMessage('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      setMessage('Error deleting product');
    }
  };

  return (
    <div className="container">
      <h1>Product Inventory CRUD</h1>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleAddProduct} className="form">
        <input
          type="text"
          name="id"
          placeholder="ID for Update"
          value={form.id}
          onChange={handleInputChange}
          className="inputId"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="btn">Add Product</button>
      </form>

      <button onClick={handleUpdateProduct} className="btn updateBtn">Update Product</button>

      <h2>Products List</h2>
      <table className="productsTable">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Quantity</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => handleDeleteProduct(p.id)} className="btn deleteBtn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
