import React, { useRef, useEffect, useState } from "react";
import "./Reviews.css";

const reviews = [
    {
        id: 1,
        title: "The best booking system",
        content:
            "Great experience, easy to book. Paying for treatments is so convenient — no cash or cards needed!",
        reviewer: "Lucy",
        location: "London, UK",
        image: "https://via.placeholder.com/50", // Replace with actual image URLs
        rating: 5,
    },
    {
        id: 2,
        title: "Easy to use & explore",
        content:
            "Fresha’s reminders make life so much easier. I also found a few good barbershops that I didn’t know existed.",
        reviewer: "Dan",
        location: "New York, USA",
        image: "https://via.placeholder.com/50",
        rating: 5,
    },
    {
        id: 3,
        title: "Great for finding barbers",
        content:
            "I’ve been using Fresha for two years, and it’s by far the best booking platform I’ve used. Highly recommend it!",
        reviewer: "Dale",
        location: "Sydney, Australia",
        image: "https://via.placeholder.com/50",
        rating: 5,
    },
    {
        id: 4,
        title: "Convenient and Reliable",
        content: "Fresha is easy to use, and I love the convenience it offers!",
        reviewer: "Emma",
        location: "Toronto, Canada",
        image: "https://via.placeholder.com/50",
        rating: 5,
    },
    {
        id: 5,
        title: "A must-have platform",
        content: "I’ve recommended Fresha to all my friends, and they love it too!",
        reviewer: "Mike",
        location: "San Francisco, USA",
        image: "https://via.placeholder.com/50",
        rating: 5,
    },
];

const Reviews = () => {
    const carouselRef = useRef(null);
    const [clonedReviews, setClonedReviews] = useState([]);

    useEffect(() => {
        // Clone the reviews array to enable seamless looping
        setClonedReviews([...reviews, ...reviews]);
    }, []);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });

            // Check if it's at the beginning
            if (carouselRef.current.scrollLeft === 0) {
                carouselRef.current.scrollLeft =
                    carouselRef.current.scrollWidth / 2;
            }
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });

            // Check if it's at the end
            if (
                carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >=
                carouselRef.current.scrollWidth
            ) {
                carouselRef.current.scrollLeft =
                    carouselRef.current.scrollWidth / 2 - carouselRef.current.offsetWidth;
            }
        }
    };

    return (
        <section className="reviews">
            <h2>Reviews</h2>
            <div className="carousel-container">
                <button className="scroll-button left" onClick={scrollLeft}>
                    &#8249;
                </button>
                <div className="carousel" ref={carouselRef}>
                    {clonedReviews.map((review, index) => (
                        <div className="review-card" key={`${review.id}-${index}`}>
                            <div className="review-stars">
                                {"⭐".repeat(review.rating)}
                            </div>
                            <h3 className="review-title">{review.title}</h3>
                            <p className="review-content">{review.content}</p>
                            <div className="review-footer">
                                <img
                                    src={review.image}
                                    alt={review.reviewer}
                                    className="reviewer-image"
                                />
                                <div>
                                    <p className="reviewer-name">
                                        {review.reviewer}
                                    </p>
                                    <p className="reviewer-location">
                                        {review.location}
                                    </p>
                                </div>
                            </div>
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

export default Reviews;
