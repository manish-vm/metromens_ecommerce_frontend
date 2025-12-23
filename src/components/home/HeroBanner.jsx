import React, { useEffect, useState } from 'react';
import '../../css/home.css';
import { useNavigate } from 'react-router-dom';
import { getHeroBanners } from '../../services/heroBannerService';

const AUTO_SLIDE_MS = 3000;

const HeroBanner = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const banners = await getHeroBanners();
        setSlides(banners.filter(banner => banner.isActive));
      } catch (error) {
        console.error('Failed to load hero banners:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  // Auto-play
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (index) => {
    setActiveIndex(index);
  };

  if (loading) {
    return <div className="hero-slider loading">Loading banners...</div>;
  }

  if (slides.length === 0) {
    return <div className="hero-slider no-banners">No active banners available</div>;
  }

  return (
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`hero-slide ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-overlay" />

          <div className="hero-content">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
            <div className="hero-cta">
              <button
                onClick={() => navigate(slide.ctaPrimaryLink)}
                className="btn-one"
              >
                {slide.ctaPrimaryLabel}
              </button>

              <button
                onClick={() => navigate(slide.ctaSecondaryLink)}
                className="btn-two"
              >
                {slide.ctaSecondaryLabel}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            key={slide._id}
            type="button"
            className={`hero-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
