import React from 'react'

export default function Register() {
    return (
        <div>
            <form autoComplete="off" className="sign-up-form" method="post">
                <div className="logo">
                    <img src="" alt="easyclass" />
                    <h4>yogacenter</h4>
                </div>
                <div className="heading">
                    <h2>Get Started</h2>
                </div>
                <div className="actual-form">
                    <div className="input-wrap">
                        <input id="firstname" type="text" minLength="{4}" className="input-field" autoComplete="off" required />
                        <label>FirstName</label>
                    </div>
                    <div className="input-wrap">
                        <input id="lastname" type="text" minLength="{4}" className="input-field" autoComplete="off" required />
                        <label>LastName</label>
                    </div>
                    <div className="input-wrap">
                        <p>Gender</p>
                        <div className="gender">
                            <input id="gender-male" type="radio" name="gender" defaultValue="male" />
                            Male
                            <input id="gender-female" type="radio" name="gender" defaultValue="female" />
                            Female
                        </div>
                    </div>
                    <div className="input-wrap">
                        <input id="email" type="email" className="input-field" autoComplete="off" required />
                        <label>Email</label>
                    </div>
                    <div className="input-wrap">
                        <input id="phone" type="text" minLength="{10}" maxLength="{11}" className="input-field" autoComplete="off" required />
                        <label>Phone</label>
                    </div>
                    <div className="input-wrap">
                        <input id="password" type="password" minLength="{6}" className="input-field" autoComplete="off" required />
                        <label>Password</label>
                    </div>
                    <input type="button" defaultValue="Sign Up" className="sign-btn" />
                    <div className="heading">
                        <h6>Already have an account?</h6>
                        <a href="/login" className="toggle">Sign in</a>
                    </div>
                </div>
            </form>
            <div className="carousel">
                <div className="images-wrapper">
                    <img src="" className="image img-1 show" alt='' />
                    <img src="" className="image img-2" alt='' />
                    <img src="" className="image img-3" alt='' />
                </div>
                <div className="text-slider">
                    <div className="text-wrap">
                        <div className="text-group">
                            <h2>Create your own courses</h2>
                            <h2>Customize as you like</h2>
                            <h2>Invite students to your class</h2>
                        </div>
                    </div>
                    <div className="bullets">
                        <span className="active" data-value="{1}">
                            <span data-value="{2}">
                                <span data-value="{3}">
                                </span></span></span></div>
                </div>
            </div>
        </div>
    )
}
