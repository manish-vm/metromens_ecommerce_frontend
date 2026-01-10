import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryStrip from '../components/home/CategoryStrip';
import ProductGridSection from '../components/home/ProductGridSection';
import ProductCard from '../components/product/ProductCard';
import { getCategories, getProducts } from '../services/productService';
import MarqueeStrip from "../components/home/MarqueeStrip";
import ExclusiveStrip from '../components/home/ExclusiveStrip';
import { useNavigate } from 'react-router-dom';
import "../css/home.css";

const SHIRT_SUBS = [
  'Casual Shirts',
  'Plain Shirts',
  'Flannel Shirts',
  'Checked Shirts',
  'Cotton Shirts'
];

const TSHIRT_SUBS = [
  'Plain T-Shirts',
  'Printed T-Shirts',
  'Regular Fit T-Shirts',
  'Oversized T-Shirts',
  'Polo T-Shirts',
  'Plus Size T-Shirts',
  'Full Sleeve T-Shirts'
];


const getSubCategories = (filter) => {
  switch (filter) {
    case 'shirts':
      return SHIRT_SUBS;
    case 'trousers':
      return ['Trousers'];
    case 'tshirts':
      return TSHIRT_SUBS;
    case 'polos':
      return ['Polo T-Shirts', 'Polos'];
    default:
      return [];
  }
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([])

  const [newFilter, setNewFilter] = useState('all'); // 'all' | 'shirts' | 'trousers' | 'tshirts' | 'polos'

  const navigate = useNavigate();
const allproducts=()=>{
  navigate('/products');
}
  useEffect(() => {
    const load = async () => {
      const cats = await getCategories();
      setCategories(cats);

      // Fetch best sellers from API
      const best = await getProducts({ bestseller: 'true' });
      setBestSellers(Array.isArray(best.products) ? best.products.slice(0, 8) : []);

      // Fetch trending from API
      const trend = await getProducts({ trending: 'true' });
      setTrending(Array.isArray(trend.products) ? trend.products.slice(0, 8) : []);
    };
    load();
  }, []);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const subCategories = getSubCategories(newFilter);
      const query = { new: 'true' };
      if (subCategories.length > 0) {
        query.subCategory = subCategories.join(',');
      }
      const newArr = await getProducts(query);
      setNewArrivals(Array.isArray(newArr.products) ? newArr.products.slice(0, 20) : []);
    };
    fetchNewArrivals();
  }, [newFilter]);

  // No need for client-side filtering anymore, as it's done server-side

  return (
    <div className="home-page">
      <HeroBanner />
      <CategoryStrip categories={categories} />

      <MarqueeStrip />

      <ExclusiveStrip />

      {/* 🔥 NEW ARRIVALS WITH FILTER PILLS */}
      <section className="grid-section">
        <div className="section-header new-arrivals-header">
          <h2>NEW ARRIVALS </h2>
          <p className="new-arrivals-subtitle">
            Get them before everyone else does
          </p>
        </div>

        <div className="new-arrivals-filters">
          <button
            type="button"
            className={
              'new-filter-pill' + (newFilter === 'all' ? ' active' : '')
            }
            onClick={() => setNewFilter('all')}
          >
            View All
          </button>

          <button
            type="button"
            className={
              'new-filter-pill' + (newFilter === 'shirts' ? ' active' : '')
            }
            onClick={() => setNewFilter('shirts')}
          >
            Shirts
          </button>

          <button
            type="button"
            className={
              'new-filter-pill' +
              (newFilter === 'trousers' ? ' active' : '')
            }
            onClick={() => setNewFilter('trousers')}
          >
            Trousers
          </button>

          <button
            type="button"
            className={
              'new-filter-pill' +
              (newFilter === 'tshirts' ? ' active' : '')
            }
            onClick={() => setNewFilter('tshirts')}
          >
            T-shirts
          </button>

          <button
            type="button"
            className={
              'new-filter-pill' +
              (newFilter === 'polos' ? ' active' : '')
            }
            onClick={() => setNewFilter('polos')}
          >
            Polo T-shirts
          </button>

        </div>
        <div className="section-divider" >
        {newArrivals.length > 0 ? (
          <div className="product-grid">
            {newArrivals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="no-new-arrivals">
            <img src="https://img.freepik.com/free-vector/coming-soon-promo-background-stay-tuned-new-arrival_1017-57503.jpg?semt=ais_hybrid&w=740&q=80" alt="No New Arrivals"  height="250px" width="50%"/>
            <h3>No New Arrivals Found</h3>
            <p>Check back later for the latest additions!</p>
          </div>
        )}</div>
      </section>
      <center>
        
        <h2>BEST SELLERS</h2></center>
        <ProductGridSection
        products={bestSellers}
      />

      <center>
        <h2>TRENDING</h2></center>
        <ProductGridSection
        products={trending}
      />

      <center>
        <button className="explore-more-button" onClick={allproducts}>Explore More</button>
      </center>
    </div>
  );
};

export default HomePage;
