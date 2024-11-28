import React, { useRef } from "react";
import "./NearbySalons.css"; // Import CSS for styling

const salons = [
    {
        id: 1,
        name: "The Good Barbers",
        rating: 5.0,
        reviews: 2227,
        address: "Alfred-Escher-Strasse 66, Zürich",
        category: "Barbershop",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Bologna - Centro Nova",
        rating: 4.8,
        reviews: 547,
        address: "Centro Commerciale Centronova",
        category: "Barbershop",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Anthea Mulier - Hair & Beauty",
        rating: 5.0,
        reviews: 973,
        address: "Via Alessandro Volta, Corsico",
        category: "Hair Salon",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 4,
        name: "Living Room",
        rating: 5.0,
        reviews: 1822,
        address: "Primorska ulica 27, Zagreb",
        category: "Hair Salon",
        image: "https://via.placeholder.com/150",
    },
    {
        id: 5,
        name: "Elegant Salon",
        rating: 4.9,
        reviews: 1234,
        address: "Main Street 123, London",
        category: "Hair Salon",
        image: "https://via.placeholder.com/150",
    },
];

const NearbySalons = () => {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
        <section className="nearby-salons">
            <h2>Nearby Salons</h2>
            <div className="carousel-container">
                <button className="scroll-button left" onClick={scrollLeft}>
                    &#8249;
                </button>
                <div className="carousel" ref={carouselRef}>
                    {salons.map((salon) => (
                        <div className="salon-card" key={salon.id}>
                            <img src={salon.image} alt={salon.name} className="salon-image" />
                            <h3>{salon.name}</h3>
                            <p className="salon-rating">
                                {salon.rating} ⭐ ({salon.reviews})
                            </p>
                            <p className="salon-address">{salon.address}</p>
                            <span className="salon-category">{salon.category}</span>
                        </div>
                    ))}
                </div>
                <button className="scroll-button right" onClick={scrollRight}>
                    &#8250;
                </button>
            </div>
        </section>
    );
};

export default NearbySalons;
