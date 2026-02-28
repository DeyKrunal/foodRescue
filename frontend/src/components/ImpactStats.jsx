import React, { useEffect, useState } from 'react';
import { getImpactStats } from '../services/api';

const ImpactStats = () => {
    const [stats, setStats] = useState({
        mealsServed: 0,
        foodSavedKg: 0,
        partnersCount: 0
    });

    useEffect(() => {
        getImpactStats()
            .then(res => setStats(res.data))
            .catch(err => {
                console.error("Failed to fetch stats, using fallback.", err);
                setStats({
                    mealsServed: 12500,
                    foodSavedKg: 5200,
                    partnersCount: 150
                });
            });
    }, []);

    return (
        <section className="stats-grid container">
            <div className="stat-card">
                <h2>{stats.mealsServed?.toLocaleString()}+</h2>
                <p>Meals Served</p>
            </div>
            <div className="stat-card">
                <h2>{stats.foodSavedKg?.toLocaleString()} kg</h2>
                <p>Food Saved</p>
            </div>
            <div className="stat-card">
                <h2>{stats.partnersCount}+</h2>
                <p>Active Partners</p>
            </div>
        </section>
    );
};

export default ImpactStats;
