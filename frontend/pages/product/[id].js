// frontend/pages/product/[id].js
import { useRouter } from 'next/router';
import { client } from '../../lib/sanity';
import { stripePromise } from '../../lib/stripe';

export async function getStaticProps({ params }) {
  const product = await client.fetch(
    `*[_type == "product" && _id == $id][0]`,
    { id: params.id }
  );
  return { props: { product } };
}

export async function getStaticPaths() {
  const products = await client.fetch(`*[_type == "product"]{ _id }`);
  const paths = products.map((product) => ({
    params: { id: product._id },
  }));
  return { paths, fallback: false };
}

const ProductPage = ({ product }) => {
  const router = useRouter();

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { name: product.title, price: product.price, quantity: 1 }
        ]
      }),
    });
    const { id } = await res.json();
    await stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button onClick={handleCheckout}>Buy Now</button>
    </div>
  );
};

export default ProductPage;
