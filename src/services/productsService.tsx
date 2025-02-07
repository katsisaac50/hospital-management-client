import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export const getProducts = async () => {
  try {
  const response = await axios.get(API_URL);
  return response.data;
} catch (error) {
  console.error("Error fetching products:", error);
  return [];
}
};

export const addProduct = async (product: any) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (id: string, updatedProduct: any) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const dispenseProduct = async (productId: string, quantity: number) => {
  const response = await axios.post(`${API_URL}/dispense`, { productId, quantity });
  return response.data;
};
