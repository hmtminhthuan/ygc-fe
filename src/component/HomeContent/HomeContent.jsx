import React, { Fragment, useState } from "react";
import "./HomeContent.scss";
import { Modal } from "antd";
import ReactPlayer from "react-player";
import imgdemo from "../../assets/images/img-demo.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
// Import Swiper styles
import "swiper/swiper-bundle.min.css";
// swiper core styles
import "swiper/css";
import "swiper/swiper.min.css";
import Aos from "aos";

export default function HomeContent() {
  Aos.init();
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
    <div className="HomeContent">
      <div className="container">
        <div className="grid grid-cols-12 flex items-center">
          <div
            className="left col-span-6  w-5/6 px-2 px-5"
            data-aos="fade-right"
          >
            <h2 className="text-4xl font-semibold first-content-title">
              A super perfect chance of <br className="d-none d-lg-block"></br>{" "}
              health care at your fingertips
            </h2>
            <ul className="p-0  first-content-list">
              <li>
                <span>
                  <i className="fa-regular fa-circle-check"></i>
                  The best for every budget
                </span>
                <p>
                  Find high-quality yoga services at every price point. No need
                  experience, just need hard practice.
                </p>
              </li>
              <li>
                <span>
                  <i className="fa-regular fa-circle-check"></i>
                  Quality trainers from all over the world
                </span>
                <p>
                  Find the right trainers to begin join in the world of this
                  significantly effective mental therapy.
                </p>
              </li>
              <li>
                <span>
                  <i className="fa-regular fa-circle-check"></i>
                  Protected payments, every time
                </span>
                <p>
                  Always know what you'll pay upfront. Your payment isn't
                  released until you approve our services.
                </p>
              </li>
              <li>
                <span>
                  <i className="fa-regular fa-circle-check"></i>
                  24/7 support
                </span>
                <p>
                  Questions? Our round-the-clock support team is available to
                  help anytime, anywhere.
                </p>
              </li>
            </ul>
          </div>
          <div
            className="right col-span-6 d-md-none d-sm-none d-lg-block"
            data-aos="fade-left"
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/homeContentImages%2FHomeContent-1.jpg?alt=media&token=6ec2435c-b59c-4e13-ac99-89f98dca3775"
              alt="..."
              onClick={showModal}
              style={{
                cursor: "pointer",
                width: "600px",
                borderRadius: "5px",
                boxShadow: "-10px 10px 15px -2px #000",
                height: "500px",
              }}
              className="d-none d-lg-block"
            />

            <i
              className="fa-solid fa-play d-none d-lg-block"
              onClick={showModal}
            ></i>
            <Modal
              open={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              closable={handleCancel}
              afterClose={handleCancel}
              width={"680px"}
            >
              <ReactPlayer controls url="https://youtu.be/GBUUjflbuek" />
            </Modal>
          </div>
        </div>
      </div>
      <div className="bottom py-10 bg-white">
        <h3 className="text-center pt-5 slider-content-title">
          What our Trainees Say ?
        </h3>
        <div className="container my-5 mt-0" data-aos="zoom-in">
          <Fragment>
            <Swiper
              loop
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={() => {}}
              centeredSlides={true}
              onSwiper={(swiper) => {}}
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
                <div
                  className="grid grid-cols-12 w-full flex align-items-center justify-content-center px-5"
                  style={{}}
                >
                  <div className="left col-span-5">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/homeContentImages%2FHomeContent-2.jpg?alt=media&token=24a71235-8275-4193-b127-c6338039dc96"
                      className="slider-img-content  d-md-none d-sm-none d-none d-lg-block"
                      alt="..."
                    />
                  </div>
                  <div className="right col-span-7 slider-info-text px-14 px-4 mt-3">
                    <span className="text-gray-400 font-medium text-lg">
                      Hoang My Dung, Singer |{" "}
                      <span className="text-black font-bold">Hatha Yoga</span>
                    </span>
                    <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                      "My visit to the Yoga Center was a revelation in holistic
                      education. The center's knowledgeable instructors
                      seamlessly blended traditional yoga practices with mindful
                      techniques, creating an immersive learning experience..."
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div
                  className="grid grid-cols-12 w-full flex align-items-center justify-content-center px-5"
                  style={{}}
                >
                  <div className="left col-span-5">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/homeContentImages%2FHomeContent-3.jpg?alt=media&token=cb2015a5-aa7a-4ab3-97f8-5cabfa81b270"
                      className="slider-img-content  d-md-none d-sm-none d-none d-lg-block"
                      alt="..."
                    />
                  </div>
                  <div className="right col-span-7 slider-info-text px-14 px-4 ">
                    <span className="text-gray-400 font-medium text-lg">
                      Alan Roosevelt, Finance Manager at FED |{" "}
                      <span className="text-black font-bold">Yin Yoga</span>
                    </span>
                    <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                      "The center's dedication to creating a harmonious
                      environment combined with its emphasis on stress reduction
                      and mindfulness proved to be invaluable tools in my
                      financial endeavors."
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="grid grid-cols-12 w-full flex align-items-center justify-content-center px-5"
                  style={{}}
                >
                  <div className="left col-span-5">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/homeContentImages%2FHomeContent-4.jpg?alt=media&token=89b8a2dc-c29c-4042-bc02-41098deed54a"
                      className="slider-img-content  d-md-none d-sm-none d-none d-lg-block"
                      alt="..."
                    />
                  </div>
                  <div className="right col-span-7 slider-info-text px-14 px-4 ">
                    <span className="text-gray-400 font-medium text-lg">
                      Duong Thanh Tung, Artist |{" "}
                      <span className="text-black font-bold">Iyengar Yoga</span>
                    </span>
                    <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                      "Yoga Center offers a holistic approach to beauty, where
                      the mind-body connection is nurtured, resulting in a truly
                      transformative experience."{" "}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="grid grid-cols-12 w-full flex align-items-center justify-content-center px-5"
                  style={{}}
                >
                  <div className="left col-span-5">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/yogacenter-66b48.appspot.com/o/homeContentImages%2FHomeContent-5.jpg?alt=media&token=437ea9dc-918b-4fb7-bd42-fdcb022181dc"
                      className="slider-img-content  d-md-none d-sm-none d-none d-lg-block"
                      alt="..."
                    />
                  </div>
                  <div className="right col-span-7 slider-info-text px-14 px-4 ">
                    <span className="text-gray-400 font-medium text-lg">
                      Nguyen Ngoc Tam, General Practitioner |{" "}
                      <span className="text-black font-bold">Vinyasa Yoga</span>
                    </span>
                    <p className="mt-3 text-3xl text-green-900 font-semibold italic">
                      "The center's emphasis on alignment, breathwork, and
                      mindfulness techniques truly enhanced my overall wellness
                      journey. I highly recommend Yoga Center to anyone seeking
                      a nurturing and rejuvenating space to embark on their yoga
                      practice."{" "}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </Fragment>
        </div>
      </div>
    </div>
  );
}
