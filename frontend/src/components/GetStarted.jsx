
const GetStarted = () => {
    return (
        <>
            <section className="cta-final">
            <style>{`
                .cta-final{
                position: relative;
                padding: 120px 20px;
                text-align: center;
                overflow: hidden;
                background: linear-gradient(135deg,#3d7a32,#6fbf5f);
                color: #fff;
                font-family: 'DM Sans', sans-serif;
                }

                .cta-final h2{
                font-size: 2.6rem;
                font-weight: 700;
                margin-bottom: 18px;
                letter-spacing: -0.02em;
                }

                .cta-final p{
                max-width: 620px;
                margin: 0 auto 40px;
                font-size: 1.05rem;
                line-height: 1.7;
                color: rgba(255,255,255,0.9);
                }

                .cta-btn{
                display: inline-block;
                background: #fff;
                color: #3d7a32;
                font-weight: 600;
                padding: 14px 32px;
                border-radius: 50px;
                text-decoration: none;
                font-size: 15px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                transition: all 0.25s ease;
                position: relative;
                overflow: hidden;
                }

                .cta-btn:hover{
                transform: translateY(-3px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.25);
                }

                /* Glow circles */
                .cta-final::before,
                .cta-final::after{
                content:"";
                position:absolute;
                width:400px;
                height:400px;
                background:rgba(255,255,255,0.15);
                filter:blur(120px);
                border-radius:50%;
                z-index:0;
                }

                .cta-final::before{
                top:-100px;
                left:-100px;
                }

                .cta-final::after{
                bottom:-120px;
                right:-100px;
                }

                .cta-content{
                position:relative;
                z-index:2;
                }

                @media(max-width:768px){
                .cta-final h2{
                    font-size:2rem;
                }
                }
            `}</style>

            <div className="cta-content">
                <h2>Ready to make a difference?</h2>

                <p>
                Join hundreds of organizations working together to reduce food waste
                and fight hunger in communities.
                </p>

                <a href="/register" className="cta-btn">
                🌱 Get Started Today
                </a>
            </div>
            </section>
        </>
    );
};

export default GetStarted;  