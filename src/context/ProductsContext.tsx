import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getProducts } from '../services/productsService';
import { Product } from './../lib/interfaces';
interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const addProduct = (product: Product) => {
    setProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const updateProduct = (id: string, updatedProduct: Product) => {
    setProducts(prev => {
      if (!prev.some(p => p.id === id)) return prev;
      return prev.map(product => (product.id === id ? updatedProduct : product));
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      if (!prev.some(p => p.id === id)) {
        console.warn(`Product with ID ${id} not found.`);
        return prev;
      }
      return prev.filter(product => product.id !== id);
    });
  };

  return (
    <ProductsContext.Provider value={{ products, setProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProductsContext must be used within a ProductsProvider");
  }
  return context;
};