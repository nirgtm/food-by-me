import React from "react";
import "./whatsOnYourMind.css";
import { useNavigate } from "react-router-dom";
import { getThemeRoute } from "../pages/catalogThemes";

/**
 * CSS-only infinite scroller.
 * `speed` controls the marquee duration:
 * - higher speed => shorter duration (faster movement)
 * - lower speed => longer duration (slower movement)
 */
export default function WhatsOnYourMind({
  items = [
    { name: "Noodles", img: "/images/Noodles.jpg" },
    { name: "Chinese", img: "/images/Chinese.jpg" },
    { name: "Pure Veg", img: "/images/Pureveg.jpg" },
    { name: "Paratha", img: "/images/paratha.jpg" },
    { name: "Tea", img: "/images/Tea.png" },
    { name: "Coffee", img: "/images/Coffee.jpg" },
    { name: "Kebabs", img: "/images/kebabs.jpg" },
    { name: "Fruits", img: "/images/Fruits.jpg" },
    { name: "Biryani", img: "/images/Biryani.jpg" },
    { name: "Desserts", img: "/images/desserts.jpg" },
    { name: "Khichdi", img: "/images/khichdi.jpg" },
    { name: "Shake", img: "/images/shake.jpg" },
    { name: "Rasgulla", img: "/images/rasgulla.jpg" },
    { name: "Cakes", img: "/images/Cakes.jpg" },
  ],
  speed = 230,
  onSelect = () => {},
}) {
  const navigate = useNavigate();
  const safeSpeed = Number.isFinite(speed) ? Math.max(1, speed) : 230;
  const marqueeDuration = `${Math.min(60, Math.max(8, (25 * 230) / safeSpeed)).toFixed(2)}s`;
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = (event) => setIsMobile(event.matches);
    setIsMobile(media.matches);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const navigateToCategory = (name) => {
    onSelect(name);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    navigate(getThemeRoute(name));
  };

  return (
    <section className="mind-section">
      <div className="mind-header">
        <h2>What's on your mind?</h2>
      </div>

      <div className="mind-container">
        <div className="marquee-track" style={{ animationDuration: marqueeDuration }}>
          {(isMobile ? items : [...items, ...items]).map((it, i) => (
            <button
              className="mind-item"
              key={`${it.name}-${i}`}
              onClick={() => navigateToCategory(it.name)}
              aria-label={`Browse ${it.name}`}
            >
              <img
                src={it.img}
                alt={it.name}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
              <p>{it.name}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
