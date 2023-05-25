import React from 'react'
import HeaderHome from '../../component/HeaderHome/HeaderHome'
import FooterHome from '../../component/FooterHome/FooterHome'
import HomeCarousel from '../../templates/HomeTemplate/HomeCarousel/HomeCarousel'
import HomeContent from '../../component/HomeContent/HomeContent'
export default function Home() {

    return (
        <div>
            <HeaderHome />
            <HomeCarousel />
            <HomeContent />
            <FooterHome />
        </div>
    )
}
