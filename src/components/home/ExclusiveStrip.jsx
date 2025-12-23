import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/exclusive.css';;

const ExclusiveStrip = () => {
  const navigate = useNavigate();
  const [exclusiveBanners, setExclusiveBanners] = useState([
    {
      id: 1,
      title: 'Replay & Rewind',
      subtitle: 'Throwback shirts with a modern metro fit.',
      image:
        'https://3730merch.com/cdn/shop/files/MetroClassic_FilmRetouched.jpg?v=1763501027&width=533',
      link: '/category/shirts'
    },
    {
      id: 2,
      title: 'Shirts Reimagined',
      subtitle: 'Soft fabrics, sharp structure, all-day comfort.',
      image:
        'https://green-tailor.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-04-17-at-5.06.46-PM-1.jpeg',
      link: '/category/shirts'
    },
    {
      id: 3,
      title: 'The 10X Cargos',
      subtitle: 'Built for city runs, weekend trips and everything between.',
      image:
        'https://cdn.dribbble.com/userupload/45496251/file/11103fd593542b94aab5b79315c85d22.jpg?format=webp&resize=400x300&vertical=center',
      link: '/products?subCategory=Cargo%20Pants'
    },
    {
      id: 4,
      title: 'Back To Campus',
      subtitle: 'Easy layers and bottoms for everyday college fits.',
      image:
        'https://www.shutterstock.com/image-photo/male-college-students-walking-talking-600nw-2474737307.jpg',
      link: '/products'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
 ;useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL+`/api/exclusive-banners`); 

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setExclusiveBanners(data);
      }
    } catch (err) {
      console.warn(
        'Exclusive banners API failed, using fallback banners:',
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  fetchBanners();
}, []);

  // Duplicate beginning + end for seamless infinite scroll
  const finalSlides = [...exclusiveBanners, ...exclusiveBanners, ...exclusiveBanners];

  const [index, setIndex] = useState(exclusiveBanners.length); // start in middle
  const [transition, setTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [cardWidth, setCardWidth] = useState(25); 

  // Update cardWidth based on screen size
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth <= 640) {
        setCardWidth(100); // 1 card per view on mobile
      } else if (window.innerWidth <= 1024) {
        setCardWidth(50); // 2 cards per view on tablet
      } else {
        setCardWidth(25); // 4 cards per view on desktop
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const goNext = () => {
    setIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    setIndex((prev) => prev - 1);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered) return; // Pause on hover

    const interval = setInterval(() => {
      goNext();
    }, 2000); // Auto-slide every 2 seconds

    return () => clearInterval(interval);
  }, [isHovered]);

  // Fix infinite loop instantly after reaching clone edges
  useEffect(() => {
    if (index === finalSlides.length - exclusiveBanners.length) {
      setTimeout(() => {
        setTransition(false);
        setIndex(exclusiveBanners.length);
      }, 300);
    }

    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(exclusiveBanners.length);
      }, 300);
    }

    const reEnable = setTimeout(() => setTransition(true), 310);
    return () => clearTimeout(reEnable);
  }, [index]);

  return (
    <section className="exclusive-strip">
      <div className="exclusive-header">
        <h2>Metro Exclusives</h2>
        <p>Trendy global styles for your everyday city moves</p>
      </div>

      <div
        className="exclusive-slider"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className="exclusive-arrow exclusive-arrow-left" onClick={goPrev}><img src="https://cdn-icons-png.freepik.com/256/271/271220.png?semt=ais_white_label"  height="10px" width="10px" alt="arrow"/></button>

        <div className="exclusive-viewport">
          <div
            className="exclusive-track"
            style={{
              transform: `translateX(-${index * cardWidth}%)`,
              transition: transition ? "transform 0.35s ease" : "none"
            }}
          >
            {finalSlides.map((item, idx) => (
              <div
                key={idx}
                className="exclusive-card"
                onClick={() => navigate(item.link)}
              >
                <div
                  className="exclusive-card-bg"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="exclusive-card-overlay" />
                  <div className="exclusive-card-content">
                    <h3 className="exclusive-item-title">{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="exclusive-arrow exclusive-arrow-right" onClick={goNext}><img src="https://cdn-icons-png.flaticon.com/512/32/32213.png"  height="10px" width="10px" alt="arrow"/></button>
      </div>
    </section>
  );
};

export default ExclusiveStrip;
