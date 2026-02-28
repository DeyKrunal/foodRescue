import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "List Surplus",
            description: "Donors list excess food via our platform in seconds."
        },
        {
            number: "02",
            title: "Instant Connection",
            description: "Local NGOs receive notifications and accept donations."
        },
        {
            number: "03",
            title: "Direct Pickup",
            description: "NGOs collect food directly from donors for distribution."
        }
    ];

    return (
        <section className="how-it-works">
            <div className="container">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>A simple process designed to be ethical and efficient.</p>
                </div>
                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card">
                            <div className="step-icon">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
