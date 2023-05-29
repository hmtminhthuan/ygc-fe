import React from 'react'
import HeaderAdmin from '../../../component/Admin/HeaderAdmin/HeaderAdmin'
import MeanuAdmin from '../../../component/Admin/MenuAdmin/MeanuAdmin'
import './CourseManagement.scss'
export default function CourseManagement() {
    return (
        <>
            <HeaderAdmin />
            <section className="main" id="admin-course-management-area">
                <MeanuAdmin />

            </section>
        </>
    )
}
