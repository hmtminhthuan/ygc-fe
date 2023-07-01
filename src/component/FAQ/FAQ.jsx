import React from "react";
import "./FAQ.scss";

export default function FAQ() {
  return (
    <section
      className="
      // bg-light
       w-100 p-0 m-0"
      style={{ backgroundColor: "#fbe7f7", width: "100%" }}
    >
      <div
        className="flex justify-content-center p-0 m-0 w-100 py-5"
        style={{ backgroundColor: "#fbe7f7", width: "100%" }}
      >
        <div className="row justify-content-center py-5">
          <div className="col-lg-10">
            <div className="card card-style1 border-0">
              <div className="card-body p-4 p-md-5 p-xl-6">
                <div className="text-center mb-2-3 mb-lg-6">
                  <h2 className="h1 mb-0 text-secondary">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div id="accordion" className="accordion-style">
                  <div className="card mb-3">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <span className="text-theme-secondary me-2">Q.</span>{" "}
                          Do I need to have prior experience to join a yoga
                          center?
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseOne"
                      className="collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordion"
                    >
                      <div className="card-body">
                        No, our yoga center welcomes individuals of all
                        experience levels, from beginners to experienced. We
                        have beginner yoga classes that focus on the basics of
                        yoga, putting beginners at ease and learning at their
                        own pace.
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-header" id="headingThree">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          <span className="text-theme-secondary me-2">Q.</span>{" "}
                          What should I bring to a yoga class?
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseTwo"
                      className="collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordion"
                    >
                      <div className="card-body">
                        It's recommended to bring a yoga mat (although our
                        center provide them), a water bottle, and a towel. Wear
                        comfortable clothing for easy movement like leggings or
                        shorts and a t-shirt or tank top. Some people may want
                        to bring personal yoga equipment such as yoga blocks,
                        yoga bands, or pillows, but these are usually available
                        at the center.
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-header" id="headingFour">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                          aria-expanded="false"
                          aria-controls="collapseFour"
                        >
                          <span className="text-theme-secondary me-2">Q.</span>{" "}
                          Can yoga help with specific health conditions or
                          injuries?
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseFour"
                      className="collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordion"
                    >
                      <div className="card-body">
                        Yoga can be beneficial for various health conditions and
                        injuries, but it's important to consult with a
                        healthcare professional or a qualified yoga instructor
                        for guidance. They can recommend specific modifications
                        or practices that suit individual needs and ensure safe
                        and effective practice.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="headingSix">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSix"
                          aria-expanded="false"
                          aria-controls="collapseSix"
                        >
                          <span className="text-theme-secondary me-2">Q.</span>{" "}
                          Can I practice yoga if I'm pregnant?
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseSix"
                      className="collapse"
                      aria-labelledby="headingSix"
                      data-bs-parent="#accordion"
                    >
                      <div className="card-body">
                        Yes, prenatal yoga classes are specifically designed to
                        support pregnant individuals throughout their journey.
                        Prenatal yoga helps with gentle stretching,
                        strengthening, relaxation, and breathing techniques that
                        are beneficial during pregnancy. It's essential to
                        inform the instructor about your pregnancy to ensure
                        proper guidance and modifications.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
