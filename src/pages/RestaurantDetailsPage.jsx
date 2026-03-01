import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  APP_SYNC_EVENT,
  addCartItem,
  getCartCount,
  getCartItems,
  isFavoriteRestaurant,
  toggleFavoriteRestaurant,
} from "../config/api";
import { getRestaurantById } from "../data/restaurants";
import "./RestaurantDetailsPage.css";

const INITIAL_BOOKING_FORM = {
  name: "",
  date: "",
  time: "",
  guests: "2",
  phone: "",
};

const FEATURED_RESTAURANTS = {
  "spice-symphony": {
    name: "Spice Symphony",
    rating: 4.8,
    tagline:
      "Fine Indian dining with royal spice blends, live grills, and elegant table service.",
    heroImage: "/images/Biryani.jpg",
    phone: "+91 98765 41001",
    about: {
      description:
        "Spice Symphony brings together Awadhi and Mughlai flavors with a modern plating style. The chefs use slow-cooked gravies, house-ground spices, and tandoor-finished dishes that balance richness with freshness.",
      cuisineType: "North Indian, Mughlai, Tandoor",
      openingHours: "11:00 AM - 11:30 PM",
      priceRange: "₹₹₹ (₹1,200 for two)",
    },
    location: {
      address: "12 City Center Boulevard, Nagpur, Maharashtra 440010",
      mapEmbed:
        "https://maps.google.com/maps?q=City%20Center%20Boulevard%20Nagpur&t=&z=14&ie=UTF8&iwloc=&output=embed",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=City+Center+Boulevard+Nagpur",
    },
    specialities: [
      {
        name: "Royal Dum Biryani",
        category: "Main Course",
        description: "Saffron rice, slow-cooked vegetables, caramelized onion.",
        price: "₹420",
        image: "/images/my-biryani-1.jpg",
      },
      {
        name: "Tandoori Paneer Reserve",
        category: "Starters",
        description: "Charcoal-grilled cottage cheese with mint labneh.",
        price: "₹340",
        image: "/images/kebabs.jpg",
      },
      {
        name: "Nawabi Dal Symphony",
        category: "Main Course",
        description: "Black lentils simmered overnight with butter and cream.",
        price: "₹290",
        image: "/images/khichdi.jpg",
      },
      {
        name: "Kulfi Pistachio Slice",
        category: "Desserts",
        description: "Classic kulfi with pistachio crumble and rose reduction.",
        price: "₹180",
        image: "/images/ice-cream.jpg",
      },
    ],
    reviews: [
      {
        name: "Priya Mehta",
        rating: 5,
        text: "Beautiful ambience and one of the best biryanis in town.",
      },
      {
        name: "Rohan Verma",
        rating: 4.7,
        text: "Great service, balanced spice levels, and premium presentation.",
      },
      {
        name: "Ananya Shah",
        rating: 4.8,
        text: "Perfect for date nights and family dinners.",
      },
    ],
    gallery: [
      "/images/my-biryani-2.jpg",
      "/images/my-biryani-7.jpg",
      "/images/my-biryani-10.jpg",
      "/images/kebabs.jpg",
      "/images/my-biryani-11.jpg",
      "/images/my-biryani-6.jpg",
    ],
  },
  "urban-tandoor": {
    name: "Urban Tandoor",
    rating: 4.6,
    tagline:
      "A contemporary grill house serving smoky tandoor classics with city-style flair.",
    heroImage: "/images/kebabs.jpg",
    phone: "+91 98765 41002",
    about: {
      description:
        "Urban Tandoor is built for guests who love bold grill flavors and handcrafted marinades. The kitchen focuses on skewers, breads, and fusion platters in a vibrant dining environment.",
      cuisineType: "Tandoori, Indian Fusion, Grill",
      openingHours: "12:00 PM - 12:00 AM",
      priceRange: "₹₹₹ (₹1,050 for two)",
    },
    location: {
      address: "4 Station Road Plaza, Nagpur, Maharashtra 440008",
      mapEmbed:
        "https://maps.google.com/maps?q=Station%20Road%20Plaza%20Nagpur&t=&z=14&ie=UTF8&iwloc=&output=embed",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=Station+Road+Plaza+Nagpur",
    },
    specialities: [
      {
        name: "Smoked Malai Broccoli",
        category: "Starters",
        description: "Creamy charred broccoli with roasted garlic dip.",
        price: "₹290",
        image: "/images/Pureveg.jpg",
      },
      {
        name: "Urban Tandoori Platter",
        category: "Chef Specials",
        description: "Assorted kebabs and breads finished in live tandoor.",
        price: "₹520",
        image: "/images/kebabs.jpg",
      },
      {
        name: "Laccha Parantha Basket",
        category: "Breads",
        description: "Flaky layered breads with butter and herb oil.",
        price: "₹160",
        image: "/images/paratha.jpg",
      },
      {
        name: "Saffron Firni Jar",
        category: "Desserts",
        description: "Chilled rice pudding with saffron and crushed almonds.",
        price: "₹170",
        image: "/images/Desserts.jpg",
      },
    ],
    reviews: [
      {
        name: "Kunal Sinha",
        rating: 4.6,
        text: "Live grill section is excellent and portions are solid.",
      },
      {
        name: "Mitali Jain",
        rating: 4.5,
        text: "Loved the kebab platter and warm hospitality.",
      },
      {
        name: "Aarav Nair",
        rating: 4.7,
        text: "Perfect mix of casual vibe and premium food quality.",
      },
    ],
    gallery: [
      "/images/kebabs.jpg",
      "/images/paratha.jpg",
      "/images/Pureveg.jpg",
      "/images/Chinese.jpg",
      "/images/my-biryani-4.jpg",
      "/images/my-biryani-8.jpg",
    ],
  },
  "royal-rasoi": {
    name: "Royal Rasoi",
    rating: 4.7,
    tagline:
      "Traditional thali experiences with rich curries, handcrafted breads, and festive sweets.",
    heroImage: "/images/Pureveg.jpg",
    phone: "+91 98765 41003",
    about: {
      description:
        "Royal Rasoi celebrates heritage Indian meals inspired by palace kitchens. Every thali is plated with rotating regional curries, seasonal vegetables, and premium dessert pairings.",
      cuisineType: "Royal Thali, Gujarati, Rajasthani",
      openingHours: "10:30 AM - 11:00 PM",
      priceRange: "₹₹ (₹850 for two)",
    },
    location: {
      address: "88 Nehru Chowk, Nagpur, Maharashtra 440012",
      mapEmbed:
        "https://maps.google.com/maps?q=Nehru%20Chowk%20Nagpur&t=&z=14&ie=UTF8&iwloc=&output=embed",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=Nehru+Chowk+Nagpur",
    },
    specialities: [
      {
        name: "Maharaja Veg Thali",
        category: "Main Course",
        description: "Six curries, two breads, pulao, chutneys, and dessert.",
        price: "₹490",
        image: "/images/Pureveg.jpg",
      },
      {
        name: "Dal Baati Churma",
        category: "Regional",
        description: "Rajasthani specialty with clarified butter and spices.",
        price: "₹350",
        image: "/images/khichdi.jpg",
      },
      {
        name: "Kesar Lassi",
        category: "Beverages",
        description: "Saffron yogurt blend with pistachio and rose petals.",
        price: "₹140",
        image: "/images/shake.jpg",
      },
      {
        name: "Rasgulla Royale",
        category: "Desserts",
        description: "Soft cottage cheese dumplings in cardamom syrup.",
        price: "₹130",
        image: "/images/rasgulla.jpg",
      },
    ],
    reviews: [
      {
        name: "Sneha Kulkarni",
        rating: 4.9,
        text: "Authentic thali and amazing service pace.",
      },
      {
        name: "Ritvik Das",
        rating: 4.6,
        text: "Great family restaurant with consistent quality.",
      },
      {
        name: "Harshita Rao",
        rating: 4.7,
        text: "Loved the dessert selection and neat presentation.",
      },
    ],
    gallery: [
      "/images/Pureveg.jpg",
      "/images/paratha.jpg",
      "/images/khichdi.jpg",
      "/images/rasgulla.jpg",
      "/images/Desserts.jpg",
      "/images/south-indian.jpg",
    ],
  },
  "hungry-haveli": {
    name: "The Hungry Haveli",
    rating: 4.6,
    tagline:
      "A heritage haveli-style restaurant known for rich curries and comfort meals.",
    heroImage: "/images/paratha.jpg",
    phone: "+91 98765 41004",
    about: {
      description:
        "The Hungry Haveli offers a warm old-city dining feel with brick interiors and copper-serve cuisine. Signature gravies and slow-cooked specials are the core of its menu.",
      cuisineType: "Awadhi, Punjabi, Home-Style",
      openingHours: "11:30 AM - 11:00 PM",
      priceRange: "₹₹ (₹900 for two)",
    },
    location: {
      address: "35 Main Market Lane, Nagpur, Maharashtra 440018",
      mapEmbed:
        "https://maps.google.com/maps?q=Main%20Market%20Lane%20Nagpur&t=&z=14&ie=UTF8&iwloc=&output=embed",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=Main+Market+Lane+Nagpur",
    },
    specialities: [
      {
        name: "Haveli Butter Chicken",
        category: "Main Course",
        description: "Slow simmered tomato gravy with grilled chicken chunks.",
        price: "₹420",
        image: "/images/Shawarma.jpg",
      },
      {
        name: "Smoked Paneer Lababdar",
        category: "Main Course",
        description: "Rich cashew gravy with charred paneer cubes.",
        price: "₹340",
        image: "/images/Pureveg.jpg",
      },
      {
        name: "Tawa Paratha Duo",
        category: "Breads",
        description: "Flaky parathas with garlic butter glaze.",
        price: "₹180",
        image: "/images/paratha.jpg",
      },
      {
        name: "Matka Kulfi",
        category: "Desserts",
        description: "Traditional kulfi served in clay pot with nuts.",
        price: "₹160",
        image: "/images/ice-cream.jpg",
      },
    ],
    reviews: [
      {
        name: "Neha Purohit",
        rating: 4.7,
        text: "The gravies are rich and truly comforting.",
      },
      {
        name: "Arpit Bansal",
        rating: 4.5,
        text: "Excellent place for family dinners and group bookings.",
      },
      {
        name: "Fahad Khan",
        rating: 4.6,
        text: "Good value and authentic North Indian taste.",
      },
    ],
    gallery: [
      "/images/paratha.jpg",
      "/images/Shawarma.jpg",
      "/images/Pureveg.jpg",
      "/images/khichdi.jpg",
      "/images/ice-cream.jpg",
      "/images/my-biryani-15.jpg",
    ],
  },
  "flame-and-feast": {
    name: "Flame & Feast",
    rating: 4.7,
    tagline:
      "High-energy grill lounge with flame-finished platters and signature chef specials.",
    heroImage: "/images/Chinese.jpg",
    phone: "+91 98765 41005",
    about: {
      description:
        "Flame & Feast is a modern social dining space offering live-fire cooking and curated tasting platters. It is ideal for celebrations, team dinners, and evening gatherings.",
      cuisineType: "Grill, Continental, Pan Asian",
      openingHours: "12:00 PM - 12:30 AM",
      priceRange: "₹₹₹ (₹1,350 for two)",
    },
    location: {
      address: "21 Old City Ring Road, Nagpur, Maharashtra 440024",
      mapEmbed:
        "https://maps.google.com/maps?q=Old%20City%20Ring%20Road%20Nagpur&t=&z=14&ie=UTF8&iwloc=&output=embed",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=Old+City+Ring+Road+Nagpur",
    },
    specialities: [
      {
        name: "Flame Grilled Sizzler",
        category: "Chef Specials",
        description: "Charred vegetables and protein with pepper sauce.",
        price: "₹520",
        image: "/images/Chinese.jpg",
      },
      {
        name: "Smoky Noodles Bowl",
        category: "Main Course",
        description: "Wok tossed noodles with sesame and herbs.",
        price: "₹310",
        image: "/images/Noodles.jpg",
      },
      {
        name: "Crispy Chilli Starter",
        category: "Starters",
        description: "Crisp bite-sized starters in house chilli glaze.",
        price: "₹280",
        image: "/images/Rolls.jpg",
      },
      {
        name: "Hot Chocolate Volcano",
        category: "Desserts",
        description: "Molten dessert with vanilla scoop and nuts.",
        price: "₹240",
        image: "/images/Cakes.jpg",
      },
    ],
    reviews: [
      {
        name: "Rahul Iyer",
        rating: 4.8,
        text: "Excellent ambience and very fresh plating.",
      },
      {
        name: "Megha Saxena",
        rating: 4.7,
        text: "Loved the grill platters and quick service.",
      },
      {
        name: "Kriti Arora",
        rating: 4.6,
        text: "Great party spot with premium menu options.",
      },
    ],
    gallery: [
      "/images/Chinese.jpg",
      "/images/Noodles.jpg",
      "/images/Rolls.jpg",
      "/images/Cakes.jpg",
      "/images/kebabs.jpg",
      "/images/pasta.jpg",
    ],
  },
  "saffron-stories": {
    name: "Saffron Stories",
    rating: 4.8,
    tagline:
      "A premium bistro experience blending modern plates, artisanal desserts, and warm hospitality.",
    heroImage: "/images/Desserts.jpg",
    phone: "+91 98765 41006",
    about: {
      description:
        "Saffron Stories is curated for relaxed fine dining, featuring balanced flavor profiles, fresh ingredients, and elegant plating. It is known for chef tasting menus and seasonal desserts.",
      cuisineType: "Mediterranean, Indian Contemporary, Desserts",
      openingHours: "11:00 AM - 12:00 AM",
      priceRange: "₹₹₹ (₹1,250 for two)",
    },
    location: {
      address: "9 Town Hall Avenue, Nagpur, Maharashtra 440001",
      mapEmbed:
        "https://maps.google.com/maps?q=Town%20Hall%20Avenue%20Nagpur&t=&z=14&ie=UTF8&iwloc=&output=embed",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=Town+Hall+Avenue+Nagpur",
    },
    specialities: [
      {
        name: "Saffron Infused Risotto",
        category: "Main Course",
        description: "Creamy risotto with roasted vegetables and saffron.",
        price: "₹430",
        image: "/images/pasta.jpg",
      },
      {
        name: "Mediterranean Mezze Plate",
        category: "Starters",
        description: "Hummus, pita, grilled vegetables, and olives.",
        price: "₹360",
        image: "/images/Fruits.jpg",
      },
      {
        name: "Cold Brew Tiramisu",
        category: "Desserts",
        description: "Coffee layered tiramisu with cocoa dust finish.",
        price: "₹240",
        image: "/images/Coffee.jpg",
      },
      {
        name: "Rose Pistachio Cake",
        category: "Desserts",
        description: "Soft sponge cake with rose cream and nuts.",
        price: "₹220",
        image: "/images/Cakes.jpg",
      },
    ],
    reviews: [
      {
        name: "Isha Sethi",
        rating: 4.9,
        text: "Refined taste, excellent plating, and cozy interiors.",
      },
      {
        name: "Manav Agrawal",
        rating: 4.8,
        text: "Great desserts and a calm premium atmosphere.",
      },
      {
        name: "Nidhi Batra",
        rating: 4.7,
        text: "Service was on point and menu quality is top tier.",
      },
    ],
    gallery: [
      "/images/Desserts.jpg",
      "/images/Cakes.jpg",
      "/images/Coffee.jpg",
      "/images/Fruits.jpg",
      "/images/pasta.jpg",
      "/images/ice-cream.jpg",
    ],
  },
};

function getReviewStars(value) {
  const rating = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
}

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const featuredRestaurant = FEATURED_RESTAURANTS[id] || null;
  const restaurant = featuredRestaurant ? null : getRestaurantById(id);

  const [cartCount, setCartCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);
  const [bookingStatus, setBookingStatus] = useState("");

  const featuredCategories = useMemo(() => {
    if (!featuredRestaurant) return [];
    return Array.from(new Set(featuredRestaurant.specialities.map((item) => item.category)));
  }, [featuredRestaurant]);

  const formatRating = (value) =>
    typeof value === "number" ? value.toFixed(1) : value;
  const isImageHighlights = (items) =>
    Array.isArray(items) && items.length > 0 && typeof items[0] === "object";
  const isFavorite = restaurant ? isFavoriteRestaurant(restaurant.id) : false;

  useEffect(() => {
    if (featuredRestaurant) return undefined;

    const syncCartCount = () => {
      setCartCount(getCartCount(getCartItems()));
    };

    syncCartCount();
    window.addEventListener(APP_SYNC_EVENT, syncCartCount);
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener(APP_SYNC_EVENT, syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, [featuredRestaurant]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = setTimeout(() => setFeedback(""), 1800);
    return () => clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    setBookingForm(INITIAL_BOOKING_FORM);
    setBookingStatus("");
  }, [id]);

  const extractPriceFromText = (text) => {
    if (!text) return null;
    const match = String(text).match(/₹\s?(\d+)/);
    return match ? Number(match[1]) : null;
  };

  const normalizeItem = (item) => {
    if (typeof item === "string") {
      return {
        name: item,
        image: restaurant.image,
        offer: restaurant.offer,
        rating: restaurant.rating,
        eta: `${restaurant.etaMin}-${restaurant.etaMax} mins`,
        cuisines: restaurant.cuisines.join(", "),
        area: restaurant.area,
        price: Math.round(restaurant.priceForTwo / 2),
      };
    }

    const fallbackPrice = Math.round(restaurant.priceForTwo / 2);
    const parsedPrice = extractPriceFromText(item?.offer);
    return {
      name: item?.name || "Popular item",
      image: item?.image || restaurant.image,
      offer: item?.offer || "ITEMS AT ₹99",
      rating: item?.rating ?? restaurant.rating,
      eta: item?.eta || `${restaurant.etaMin}-${restaurant.etaMax} mins`,
      cuisines: item?.cuisines || restaurant.cuisines.join(", "),
      area: item?.area || restaurant.area,
      price: item?.price ?? parsedPrice ?? fallbackPrice,
    };
  };

  const addItemToCart = (item, { goToCheckout = false } = {}) => {
    if (!restaurant) return;
    const normalizedItem = normalizeItem(item);
    addCartItem({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      item: normalizedItem,
      quantity: 1,
    });
    setFeedback(`${normalizedItem.name} added to cart`);
    if (goToCheckout) navigate("/cart");
  };

  const handleFavoriteToggle = () => {
    if (!restaurant) return;
    const ids = toggleFavoriteRestaurant(restaurant.id);
    const next = ids.includes(restaurant.id);
    setFeedback(next ? `${restaurant.name} saved` : `${restaurant.name} removed from saved`);
  };

  const handleBookingFieldChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToBooking = () => {
    const form = document.getElementById("table-booking-form");
    if (!form) return;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    const firstInput = form.querySelector("input");
    if (firstInput && typeof firstInput.focus === "function") {
      firstInput.focus({ preventScroll: true });
    }
  };

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/#restaurants");
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    if (!featuredRestaurant) return;

    const guestCount = bookingForm.guests || "2";
    const customerName = bookingForm.name.trim();

    if (!customerName || !bookingForm.date || !bookingForm.time || !bookingForm.phone.trim()) {
      setBookingStatus("Please complete all booking fields.");
      return;
    }

    setBookingStatus(
      `Table request sent for ${customerName} (${guestCount} guests) on ${bookingForm.date} at ${bookingForm.time}.`
    );
    setBookingForm({ ...INITIAL_BOOKING_FORM, guests: guestCount });
  };

  const renderHighlights = (items) => {
    if (!Array.isArray(items) || items.length === 0) return null;

    if (isImageHighlights(items)) {
      return (
        <div className="restaurant-highlights-grid">
          {items.map((item, index) => {
            const normalizedItem = normalizeItem(item);
            const itemName = normalizedItem.name;
            const itemImage = normalizedItem.image;
            const itemOffer = normalizedItem.offer;
            const itemRating = formatRating(normalizedItem.rating);
            const itemEta = normalizedItem.eta;
            const itemCuisines = normalizedItem.cuisines;
            const itemArea = normalizedItem.area;

            return (
              <button
                type="button"
                className="restaurant-highlight-card"
                key={`${itemName}-${index}`}
                onClick={() => addItemToCart(normalizedItem, { goToCheckout: true })}
                aria-label={`Order ${itemName} from ${restaurant.name}`}
              >
                <div className="restaurant-highlight-media">
                  <img
                    src={itemImage}
                    alt={itemName}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    onError={(event) => {
                      const image = event.currentTarget;
                      if (image.src === window.location.origin + restaurant.image) return;
                      image.src = restaurant.image;
                    }}
                  />
                  <p className="restaurant-highlight-offer">{itemOffer}</p>
                </div>

                <div className="restaurant-highlight-content">
                  <h3>{itemName}</h3>
                  <p className="restaurant-highlight-meta">
                    <span className="restaurant-highlight-rating">
                      <span className="restaurant-highlight-rating-icon" aria-hidden="true">
                        ★
                      </span>
                      <span>{itemRating}</span>
                    </span>
                    <span className="restaurant-highlight-meta-dot" aria-hidden="true">
                      •
                    </span>
                    <span>{itemEta}</span>
                  </p>
                  <p className="restaurant-highlight-cuisines">{itemCuisines}</p>
                  <p className="restaurant-highlight-area">{itemArea}</p>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <ul className="restaurant-highlights-list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            <button
              type="button"
              className="restaurant-highlight-list-btn"
              onClick={() => addItemToCart(item, { goToCheckout: true })}
            >
              <span>{item}</span>
              <span className="restaurant-highlight-list-cta">Add</span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  if (featuredRestaurant) {
    return (
      <section className="pro-restaurant-page">
        <div className="pro-restaurant-shell container">
          <header className="pro-restaurant-hero">
            <img
              src={featuredRestaurant.heroImage}
              alt={featuredRestaurant.name}
              className="pro-restaurant-hero-image"
              decoding="async"
              fetchPriority="high"
              width="1280"
              height="720"
            />

            <div className="pro-restaurant-hero-overlay">
              <p className="pro-restaurant-kicker">Restaurant Details</p>
              <h1>{featuredRestaurant.name}</h1>
              <p className="pro-restaurant-tagline">{featuredRestaurant.tagline}</p>

              <div className="pro-restaurant-meta">
                <span>⭐ {featuredRestaurant.rating.toFixed(1)}</span>
                <span>{featuredRestaurant.about.cuisineType}</span>
                <span>{featuredRestaurant.about.priceRange}</span>
              </div>

              {feedback ? (
                <p className="pro-restaurant-feedback" role="status" aria-live="polite">
                  {feedback}
                </p>
              ) : null}

              <div className="pro-restaurant-actions">
                <button
                  type="button"
                  className="pro-action-btn pro-action-btn-primary"
                  onClick={scrollToBooking}
                >
                  Book Table
                </button>
                <a
                  href="#restaurant-location"
                  className="pro-action-btn pro-action-btn-secondary"
                >
                  View Location
                </a>
                <a
                  href={`tel:${featuredRestaurant.phone.replace(/\s+/g, "")}`}
                  className="pro-action-btn pro-action-btn-secondary"
                >
                  Call Now
                </a>
              </div>
            </div>
          </header>

          <section className="pro-section" id="restaurant-about">
            <h2>About the Restaurant</h2>
            <p className="pro-section-copy">{featuredRestaurant.about.description}</p>
            <div className="pro-about-grid">
              <article className="pro-about-card">
                <h3>Cuisine Type</h3>
                <p>{featuredRestaurant.about.cuisineType}</p>
              </article>
              <article className="pro-about-card">
                <h3>Opening Hours</h3>
                <p>{featuredRestaurant.about.openingHours}</p>
              </article>
              <article className="pro-about-card">
                <h3>Price Range</h3>
                <p>{featuredRestaurant.about.priceRange}</p>
              </article>
              <article className="pro-about-card">
                <h3>Contact</h3>
                <p>{featuredRestaurant.phone}</p>
              </article>
            </div>
          </section>

          <section className="pro-section" id="restaurant-location">
            <h2>Location</h2>
            <div className="pro-location-grid">
              <div className="pro-location-map-wrap">
                <iframe
                  title={`${featuredRestaurant.name} location map`}
                  src={featuredRestaurant.location.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <article className="pro-location-card">
                <h3>Address</h3>
                <p>{featuredRestaurant.location.address}</p>
                <a
                  href={featuredRestaurant.location.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="pro-open-map-link"
                >
                  Open in Google Maps
                </a>
              </article>
            </div>
          </section>

          <section className="pro-section" id="restaurant-menu">
            <h2>Menu and Specialities</h2>
            <div className="pro-category-row" aria-label="Menu categories">
              {featuredCategories.map((category) => (
                <span className="pro-category-chip" key={category}>
                  {category}
                </span>
              ))}
            </div>

            <div className="pro-menu-grid">
              {featuredRestaurant.specialities.map((item) => {
                const priceValue = extractPriceFromText(item.price) || 299;
                return (
                  <article className="pro-menu-card" key={item.name}>
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width="640"
                      height="400"
                    />
                    <div className="pro-menu-card-body">
                      <p className="pro-menu-item-category">{item.category}</p>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="pro-menu-card-footer">
                        <strong>{item.price}</strong>
                        <button
                          type="button"
                          className="pro-order-now-btn"
                          onClick={() => {
                            const orderItem = {
                              name: item.name,
                              image: item.image,
                              offer: `${item.category} Special`,
                              rating: featuredRestaurant.rating,
                              eta: featuredRestaurant.about.openingHours,
                              cuisines: featuredRestaurant.about.cuisineType,
                              area: featuredRestaurant.location.address.split(',')[0],
                              price: priceValue,
                            };
                            addCartItem({
                              restaurantId: id,
                              restaurantName: featuredRestaurant.name,
                              item: orderItem,
                              quantity: 1,
                            });
                            setFeedback(`${item.name} added to cart`);
                            setTimeout(() => {
                              navigate('/cart');
                            }, 500);
                          }}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pro-section" id="restaurant-booking">
            <h2>Table Booking</h2>
            <form
              id="table-booking-form"
              className="pro-booking-form"
              onSubmit={handleBookingSubmit}
            >
              <label className="pro-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={bookingForm.name}
                  onChange={handleBookingFieldChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s'.-]/g, '').replace(/\s{2,}/g, ' ');
                  }}
                  placeholder="Enter your name"
                  pattern="[A-Za-z][A-Za-z\s'.-]*"
                  title="Use letters and spaces only"
                  required
                />
              </label>

              <label className="pro-field">
                <span>Date</span>
                <input
                  type="date"
                  name="date"
                  value={bookingForm.date}
                  onChange={handleBookingFieldChange}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                />
              </label>

              <label className="pro-field">
                <span>Time</span>
                <input
                  type="time"
                  name="time"
                  value={bookingForm.time}
                  onChange={handleBookingFieldChange}
                  required
                />
              </label>

              <label className="pro-field">
                <span>Guests</span>
                <select
                  name="guests"
                  value={bookingForm.guests}
                  onChange={handleBookingFieldChange}
                  required
                >
                  {Array.from({ length: 12 }).map((_, index) => {
                    const value = String(index + 1);
                    return (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className="pro-field pro-field-full">
                <span>Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleBookingFieldChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  }}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  inputMode="numeric"
                  required
                />
              </label>

              <button type="submit" className="pro-booking-submit">
                Confirm Booking Request
              </button>
            </form>
            {bookingStatus ? (
              <p className="pro-booking-status" role="status" aria-live="polite">
                {bookingStatus}
              </p>
            ) : null}
          </section>

          <section className="pro-section" id="restaurant-reviews">
            <h2>Customer Reviews</h2>
            <div className="pro-review-grid">
              {featuredRestaurant.reviews.map((review) => (
                <article className="pro-review-card" key={review.name}>
                  <div className="pro-review-head">
                    <h3>{review.name}</h3>
                    <span>{review.rating.toFixed(1)}</span>
                  </div>
                  <p className="pro-review-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {getReviewStars(review.rating)}
                  </p>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pro-section" id="restaurant-gallery">
            <h2>Gallery</h2>
            <div className="pro-gallery-grid">
              {featuredRestaurant.gallery.map((image, index) => (
                <img
                  key={`${featuredRestaurant.name}-gallery-${index}`}
                  src={image}
                  alt={`${featuredRestaurant.name} gallery ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  width="540"
                  height="400"
                />
              ))}
            </div>
          </section>

          <div className="pro-footer-actions">
            <button
              type="button"
              className="pro-action-btn pro-action-btn-secondary"
              onClick={handleBackNavigation}
            >
              Back to Restaurants
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!restaurant) {
    return (
      <section className="restaurant-details-page">
        <div className="restaurant-details-shell container">
          <h1>Restaurant not found</h1>
          <p>This restaurant may have been removed or renamed.</p>
          <button
            type="button"
            className="restaurant-back-link"
            onClick={handleBackNavigation}
          >
            Back to home
          </button>
        </div>
      </section>
    );
  }

  const quickPicks = restaurant.highlights
    .slice(0, 4)
    .map((item) => normalizeItem(item));
  const startingFrom = quickPicks[0]?.price || Math.round(restaurant.priceForTwo / 2);
  const estimatedPrepMin = Math.max(10, restaurant.etaMin - 8);
  const estimatedPrepMax = Math.max(estimatedPrepMin + 6, restaurant.etaMax - 5);

  return (
    <section className="restaurant-details-page">
      <div className="restaurant-details-shell container">
        <header className="restaurant-details-hero">
          <img src={restaurant.image} alt={restaurant.name} decoding="async" fetchPriority="high" />
          <div className="restaurant-details-content">
            <p className="restaurant-details-kicker">Online Delivery Partner</p>
            <div className="restaurant-top-actions">
              <button
                type="button"
                className={`restaurant-favorite-btn${isFavorite ? " active" : ""}`}
                onClick={handleFavoriteToggle}
                aria-label={isFavorite ? "Remove from saved restaurants" : "Save restaurant"}
              >
                {isFavorite ? "♥ Saved" : "♡ Save"}
              </button>
              <Link to="/cart" className="restaurant-cart-link">
                Cart ({cartCount})
              </Link>
            </div>
            <h1>{restaurant.name}</h1>
            <p className="restaurant-details-copy">{restaurant.description}</p>
            {feedback ? <p className="restaurant-feedback">{feedback}</p> : null}

            <div className="restaurant-details-pills">
              <span>⭐ {restaurant.rating.toFixed(1)}</span>
              <span>
                {restaurant.etaMin}-{restaurant.etaMax} min
              </span>
              <span>₹{restaurant.priceForTwo} for two</span>
            </div>

            <p className="restaurant-details-cuisines">{restaurant.cuisines.join(" • ")}</p>
            <p className="restaurant-details-area">{restaurant.area}</p>
            <p className="restaurant-details-offer">{restaurant.offer}</p>

            <div className="restaurant-details-insights">
              <article className="restaurant-insight-card">
                <p>Delivery window</p>
                <strong>
                  {restaurant.etaMin}-{restaurant.etaMax} mins
                </strong>
                <span>Live tracking available</span>
              </article>
              <article className="restaurant-insight-card">
                <p>Prep time</p>
                <strong>
                  {estimatedPrepMin}-{estimatedPrepMax} mins
                </strong>
                <span>Freshly prepared after order</span>
              </article>
              <article className="restaurant-insight-card">
                <p>Starting at</p>
                <strong>₹{startingFrom}</strong>
                <span>Best value dishes</span>
              </article>
            </div>

            <section className="restaurant-quick-picks" aria-label="Quick picks">
              <div className="restaurant-quick-picks-head">
                <h3>Quick picks</h3>
                <p>Tap to add instantly</p>
              </div>
              <div className="restaurant-quick-picks-list">
                {quickPicks.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className="restaurant-quick-pick-btn"
                    onClick={() => addItemToCart(item)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="restaurant-details-actions">
              <button
                type="button"
                className="restaurant-back-link"
                onClick={handleBackNavigation}
              >
                Back to Restaurants
              </button>
              <button
                type="button"
                className="restaurant-order-btn"
                onClick={() =>
                  addItemToCart(restaurant.highlights?.[0] || restaurant.name, {
                    goToCheckout: true,
                  })
                }
              >
                Order now
              </button>
            </div>
          </div>
        </header>

        <section className="restaurant-highlights">
          <h2>Popular picks</h2>
          {renderHighlights(restaurant.highlights)}
        </section>

        {Array.isArray(restaurant.nonVegHighlights) &&
          restaurant.nonVegHighlights.length > 0 && (
            <section className="restaurant-highlights restaurant-highlights--nonveg">
              <h2>Non-veg picks</h2>
              {renderHighlights(restaurant.nonVegHighlights)}
            </section>
          )}
      </div>
    </section>
  );
}
