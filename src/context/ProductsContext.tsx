import { createContext, useState, useEffect, ReactNode } from 'react';
import { getProducts } from '../services/productsService';

export const ProductsContext = createContext<any>(null);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
