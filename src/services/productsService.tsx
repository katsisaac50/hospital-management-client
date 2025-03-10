import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Product {
  _id?: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  batchNumber?: string; // Optional in case some products don't have i
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addProduct = async (product: Product): Promise<Product> => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (id: string, updatedProduct: Product): Promise<Product> => {
  const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const dispenseProduct = async (productId: string, quantity: number): Promise<Product> => {
  const response = await axios.post(`${API_URL}/dispense`, { productId, quantity });
  return response.data;
};
