import React, { Fragment, useState } from 'react'
import './HomeContent.scss'
import { Modal } from 'antd'
import ReactPlayer from 'react-player'
import imgdemo from '../../assets/images/img-demo.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/swiper-bundle.min.css";
// swiper core styles
import 'swiper/css';
import "swiper/swiper.min.css";


export default function HomeContent() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    SwiperCore.use([Autoplay, EffectFade, Navigation]);
    return (
        <div className='HomeContent'>
            <div className="container">
                <div className="grid grid-cols-12 flex items-center">
                    <div className="left col-span-6  w-5/6 px-2">
                        <h2 className='text-4xl font-semibold'>A whole world of freelance talent at your fingertips</h2>
                        <ul className='p-0'>
                            <li>
                                <span>
                                    <i className="fa-regular fa-circle-check"></i>
                                    The best for every budget
                                </span>
                                <p>Find high-quality services at every price point. No hourly rates, just project-based pricing.</p>
                            </li>
                            <li>
                                <span>
                                    <i className="fa-regular fa-circle-check"></i>
                                    Quality work done quickly
                                </span>
                                <p>Find the right freelancer to begin working on your project within minutes.</p>
                            </li>
                            <li>
                                <span>
                                    <i className="fa-regular fa-circle-check"></i>
                                    Protected payments, every time
                                </span>
                                <p>Always know what you'll pay upfront. Your payment isn't released until you approve the work.</p>
                            </li>
                            <li>
                                <span>
                                    <i className="fa-regular fa-circle-check"></i>
                                    24/7 support
                                </span>
                                <p>Questions? Our round-the-clock support team is available to help anytime, anywhere.</p>
                            </li>

                        </ul>
                    </div>
                    <div className="right col-span-6 d-md-none d-sm-none d-lg-block">
                        <img src="https://www.yogapedia.com/images/uploads/istock-825005442.jpg" alt="..." onClick={showModal}
                            style={{
                                cursor: "pointer", width: "600px", borderRadius: "5px",
                                boxShadow: "-10px 10px 15px -2px #000"
                            }} />
                        <i className="fa-solid fa-play" onClick={showModal} ></i>
                        <Modal
                            open={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            closable={handleCancel}
                            afterClose={handleCancel}
                            width={"680px"}
                        >
                            <ReactPlayer
                                controls
                                url="https://youtu.be/GBUUjflbuek"

                            />
                        </Modal>
                    </div>
                </div>
            </div>
            <div className='bottom py-10 bg-white'>
                <h3 className='text-center pt-5 slider-content-title'>What our Trainees Say ?</h3>
                <div className="container my-5 mt-0">
                    <Fragment>
                        <Swiper
                            loop
                            spaceBetween={0}
                            slidesPerView={1}
                            onSlideChange={() => { }}
                            centeredSlides={true}
                            onSwiper={(swiper) => { }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                        >
                            <SwiperSlide>
                                <div className='grid grid-cols-12 w-full flex align-items-center justify-content-center px-5' style={{}}>
                                    <div className="left col-span-5">
                                        <img src="https://www.justrunlah.com/wp-content/uploads/2016/11/sport-girl-do-yoga-in-the-park-asian-beauty-woman.jpg" className="slider-img-content" alt="..." />
                                    </div>
                                    <div className="right col-span-7 slider-info-text px-14 px-4 mt-3">
                                        <span className="text-gray-400 font-medium text-lg">
                                            Hoang My Dung, Singer |{" "}
                                            <span className="text-black font-bold">Hatha Yoga</span>
                                        </span>
                                        <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                                            "My visit to the Yoga Center was a revelation in holistic education. The center's knowledgeable instructors seamlessly blended traditional yoga practices with mindful techniques, creating an immersive learning experience..."
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='grid grid-cols-12 w-full flex align-items-center justify-content-center px-5' style={{}}>
                                    <div className="left col-span-5">
                                        <img src="http://www.yogajournal.com/wp-content/uploads/sites/17/2018/07/yin4.jpg" className="slider-img-content" alt="..." />

                                    </div>
                                    <div className="right col-span-7 slider-info-text px-14 px-4 ">
                                        <span className="text-gray-400 font-medium text-lg">
                                            Alan Roosevelt, Finance Manager at FED |{" "}
                                            <span className="text-black font-bold">Yin Yoga</span>
                                        </span>
                                        <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                                            "The center's dedication to creating a harmonious environment combined with its emphasis on stress reduction and mindfulness proved to be invaluable tools in my financial endeavors."</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='grid grid-cols-12 w-full flex align-items-center justify-content-center px-5' style={{}}>
                                    <div className="left col-span-5">
                                        <img src="https://mk0yogiapproveddv8to.kinstacdn.com/wp-content/uploads/2020/12/Crow.jpg" className="slider-img-content" alt="..." />
                                    </div>
                                    <div className="right col-span-7 slider-info-text px-14 px-4 ">
                                        <span className="text-gray-400 font-medium text-lg">
                                            Duong Thanh Tung, Artist |{" "}
                                            <span className="text-black font-bold">Iyengar Yoga</span>
                                        </span>
                                        <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                                            "Yoga Center offers a holistic approach to beauty, where the mind-body connection is nurtured, resulting in a truly transformative experience." </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='grid grid-cols-12 w-full flex align-items-center justify-content-center px-5' style={{}}>
                                    <div className="left col-span-5">
                                        <img src="https://i.pinimg.com/originals/42/e6/32/42e6320117931b984290b56812a73bba.jpg" className="slider-img-content" alt="..." />
                                    </div>
                                    <div className="right col-span-7 slider-info-text px-14 px-4 ">
                                        <span className="text-gray-400 font-medium text-lg">
                                            Nguyen Ngoc Tam, General Practitioner |{" "}
                                            <span className="text-black font-bold">Vinyasa Yoga</span>
                                        </span>
                                        <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                                            "The center's emphasis on alignment, breathwork, and mindfulness techniques truly enhanced my overall wellness journey. I highly recommend Yoga Center to anyone seeking a nurturing and rejuvenating space to embark on their yoga practice." </p>
                                    </div>
                                </div>
                            </SwiperSlide>

                        </Swiper>
                    </Fragment>
                </div>
            </div>
        </div>
    )
}
