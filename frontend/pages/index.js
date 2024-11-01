// frontend/pages/index.js
import { client } from '../lib/sanity';

export async function getStaticProps() {
  const products = await client.fetch(`*[_type == "product"]`);
  return { props: { products } };
}

export default function HomePage({ products }) {
  return (
    <div className="products-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <h2>{product.title}</h2>
          <p>${product.price}</p>
          <a href={`/product/${product._id}`}>View Details</a>
        </div>
      ))}
    </div>
  );
}
