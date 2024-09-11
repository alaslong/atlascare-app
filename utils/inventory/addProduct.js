import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const AddToInventory = () => {
  const [productNumber, setProductNumber] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [additionalProductData, setAdditionalProductData] = useState(null);

  // Mutation to add a product to inventory
  const addInventoryMutation = useMutation(
    (data) => axios.post('/api/inventory/add', data),
    {
      onError: (error) => {
        if (error.response?.data.code === 'PRODUCT_NOT_FOUND') {
          // Show a form to request more product information
          setAdditionalProductData({
            productNumber: productNumber,
            primaryName: '',
            secondaryName: '',
            image: ''
          });
        }
      },
      onSuccess: () => {
        // Handle successful inventory addition
        alert('Product added to inventory successfully');
      }
    }
  );

  // Mutation to add a new product to the products table
  const addProductMutation = useMutation((newProduct) => axios.post('/api/products/add', newProduct), {
    onSuccess: () => {
      // After adding the product, retry the inventory addition
      addInventoryMutation.mutate({
        clientPracticeId: 1,
        productNumber,
        batchNumber,
        expiryDate
      });
    }
  });

  const handleAddInventory = () => {
    // Initial attempt to add the product to inventory
    addInventoryMutation.mutate({
      clientPracticeId: 1,
      productNumber,
      batchNumber,
      expiryDate
    });
  };

  const handleAddProduct = () => {
    // Add new product data to the products table
    addProductMutation.mutate(additionalProductData);
  };

  return (
    <div>
      <h1>Add to Inventory</h1>
      <input
        type="text"
        placeholder="Product Number"
        value={productNumber}
        onChange={(e) => setProductNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Batch Number"
        value={batchNumber}
        onChange={(e) => setBatchNumber(e.target.value)}
      />
      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />
      <button onClick={handleAddInventory}>Add to Inventory</button>

      {additionalProductData && (
        <div>
          <h2>Product Not Found, Please Provide Additional Information</h2>
          <input
            type="text"
            placeholder="Primary Name"
            value={additionalProductData.primaryName}
            onChange={(e) =>
              setAdditionalProductData({
                ...additionalProductData,
                primaryName: e.target.value
              })
            }
          />
          <input
            type="text"
            placeholder="Secondary Name"
            value={additionalProductData.secondaryName}
            onChange={(e) =>
              setAdditionalProductData({
                ...additionalProductData,
                secondaryName: e.target.value
              })
            }
          />
          <input
            type="text"
            placeholder="Image URL"
            value={additionalProductData.image}
            onChange={(e) =>
              setAdditionalProductData({
                ...additionalProductData,
                image: e.target.value
              })
            }
          />
          <button onClick={handleAddProduct}>Submit Product Data</button>
        </div>
      )}
    </div>
  );
};

export default AddToInventory;
