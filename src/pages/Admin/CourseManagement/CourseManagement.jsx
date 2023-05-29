import React from 'react'
import HeaderAdmin from '../../../component/Admin/HeaderAdmin/HeaderAdmin'
import MenuAdmin from '../../../component/Admin/MenuAdmin/MenuAdmin'
import './CourseManagement.scss'
export default function CourseManagement() {
    return (
        <>
            <HeaderAdmin />
            <section className="main" id="admin-course-management-area">
                <MenuAdmin />

            </section>
        </>
    )
}
