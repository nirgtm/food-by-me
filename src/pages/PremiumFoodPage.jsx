import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCartItem, notifyApp } from "../config/api";
import "./PremiumFoodPage.css";

function getRating(index) {
  return (4.2 + ((index + 2) % 4) * 0.2).toFixed(1);
}

function getEta(index) {
  const min = 12 + (index % 5) * 3;
  return `${min}-${min + 10} min`;
}

export default function PremiumFoodPage({ theme }) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBehavior = html.style.scrollBehavior;
    const prevBodyBehavior = body.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    html.scrollTop = 0;
    body.scrollTop = 0;

    html.style.scrollBehavior = prevHtmlBehavior;
    body.style.scrollBehavior = prevBodyBehavior;
  }, [theme?.slug]);

  useLayoutEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = setTimeout(() => setFeedback(""), 2000);
    return () => clearTimeout(timeoutId);
  }, [feedback]);

  const handleOrderNow = (item, price, index) => {
    const orderItem = {
      name: item.name,
      image: `/images/${item.image || theme.image}`,
      offer: `${theme.kicker} Special`,
      rating: parseFloat(getRating(index)),
      eta: getEta(index),
      cuisines: theme.subtitle,
      area: theme.title,
      price: price,
    };

    addCartItem({
      restaurantId: theme.slug,
      restaurantName: theme.title,
      item: orderItem,
      quantity: 1,
    });

    notifyApp(`${item.name} added to cart`, "success");
    setFeedback(`${item.name} added!`);
    
    // Navigate to cart after a short delay
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  if (!theme) return null;

  const {
    title,
    subtitle,
    kicker,
    image,
    items = [],
    basePrice = 99,
    priceStep = 8,
    accent = "#476184",
    accentSoft = "#d1def5",
  } = theme;

  return (
    <section
      className="premium-page"
      style={{
        "--accent": accent,
        "--accent-soft": accentSoft,
      }}
    >
      <div className="premium-bg premium-bg-one" aria-hidden="true" />
      <div className="premium-bg premium-bg-two" aria-hidden="true" />

      <div className="premium-shell">
        <div className="premium-main">
          <header className="premium-hero">
            <button className="premium-back" onClick={() => navigate(-1)}>
              Back
            </button>
            <div className="premium-kicker">{kicker}</div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
            {feedback && (
              <div className="premium-feedback" role="status" aria-live="polite">
                {feedback}
              </div>
            )}
            <div className="premium-hero-pulse" aria-hidden="true" />
          </header>

          <section className="premium-grid" aria-label={`${title} items`}>
            {items.map((item, index) => {
              const price = basePrice + index * priceStep;

              return (
                <article className="premium-card" key={item.name}>
                  <div className="premium-card-media">
                    <img
                      src={`/images/${item.image || image}`}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <span className="premium-price">INR {price}</span>
                  </div>

                  <div className="premium-card-body">
                    <h3>{item.name}</h3>
                    <p>{item.note}</p>

                    <div className="premium-meta">
                      <span>{getEta(index)}</span>
                      <span>{getRating(index)} star</span>
                    </div>

                    <button 
                      className="premium-order"
                      onClick={() => handleOrderNow(item, price, index)}
                    >
                      Order Now
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </div>
    </section>
  );
}
