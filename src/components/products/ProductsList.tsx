import { useContext } from 'react';
import { ProductsContext } from '../../context/ProductsContext';

// Define the expected structure of a product
interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  batchNumber?: string; // Optional in case some products don't have it
}

// Define the type for props
interface ProductsListProps {
  products?: Product[]; // Optional because we fall back to context products
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {

  const { products: contextProducts } = useContext(ProductsContext);
  
    // Use provided products or fallback to context products
    const productItems = products && products.length > 0 ? products : contextProducts;

  return (
    <div>
      <h2>Products List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Batch No.</th>
          </tr>
        </thead>
        <tbody>
          {productItems.map((product: any) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              <td>{product.batchNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
