import { useEffect, useState } from 'react';
import { getTestimonials } from '../services/api';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        getTestimonials()
            .then(res => setTestimonials(res.data))
            .catch(err => {
                console.error("Failed to fetch testimonials, using fallback.", err);
                setTestimonials([
                    { name: "Ram Shankar Yadav", role: "Restaurant Owner", message: "FoodRescue made it so easy for us to donate excess food." },
                    { name: "Vaibhav Tripathi", role: "NGO Director", message: "We've been able to reach hundreds of people thanks to this platform." }
                ]);
            });
    }, []);

    return (
        <section className="testimonials container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>What People Are Saying</h2>
            <div className="testimonial-grid">
                {Array.isArray(testimonials) && testimonials.map((t, i) => (
                    <div key={i} className="testimonial-card">
                        <p>"{t.message}"</p>
                        <h4 style={{ marginTop: '20px' }}>{t.name}</h4>
                        <small>{t.role}</small>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
