import React from 'react'
import { Carousel } from 'antd';
import './HomeCarousel.scss'
import { SearchOutlined } from '@ant-design/icons'

export default function HomeCarousel() {
    return (
        <section className="hero-wrap js-fullheight">
            <div className="overlay" />
            <div className="container">
                <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-start">
                    <div className="col-md-8 ftco-animate">
                        <h1 className="typewrite mb-3" data-period={1000} data-type="[ &quot;Inspiration For Living.&quot;, &quot;Therapy Against Stress.&quot;, &quot;A Flexible Body.&quot;]">
                            <span className="wrap" />
                        </h1>
                        <h2 className="mb-5" style={{ color: 'rgba(0, 0, 0)' }}>Do Yoga today for a better tomorrow</h2>

                        <p>
                            <a href="#" className="btn btn-primary p-3 px-4">15 Day Free Trial</a>
                        </p>
                    </div>
                </div>
            </div>
        </section >

    )
}
