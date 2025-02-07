import { useContext } from 'react';
import { ProductsContext } from '../../context/ProductsContext';

const ProductsList = (props) => {

  const { products } = useContext(ProductsContext);
  const productItems = props.products.length > 0 ? props.products : products

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
