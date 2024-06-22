import React from 'react';
import {FaArrowRight} from "react-icons/fa";
import {Link} from "react-router-dom";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import "../App.css";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';

function Home() {
  return (
    <div>
        {/* Section 1 */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
            <Link to={"/signup"}>
                <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 p-[5px] transition-all duration-200 group-hover:richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>

            <div className='text-center text-4xl font-semibold mt-7 '>
                Empower Your Future with
                <HighlightText text={"Coding Skills"}/>
            </div>
            <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
            </div>

            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/signup"}>
                    Book a Demo
                </CTAButton>
            </div>

            <div className='mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
                <video
                className="shadow-[20px_20px_rgba(255,255,255)]"
                muted
                loop
                autoPlay
                >
                <source src={Banner} type='video/mp4'></source>
                </video>
            </div>

            {/*Code Section 1 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row flex-col"}
                    heading={
                        <div className='text-4xl font-semibold'>
                            Unlock your
                            <HighlightText text={"coding potential"}/>
                            with our online courses
                        </div>
                    }
                    subHeading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={
                        {
                            btntext:"Try it yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btntext:"Learn more",
                            linkto:"/signup",
                            active:false
                        }
                    }

                    codeColor={"text-yellow-25"}
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    backgroundGradient={<div className="codeblock1 absolute"></div>}
                />
            </div>

            {/*Code Section 2 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row-reverse flex-col-reverse"}
                    heading={
                        <div className='w-[100%] text-4xl font-semibold lg:w-[50%]"'>
                            Start
                            <HighlightText text={"coding in seconds"}/>
                        </div>
                    }
                    subHeading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1={
                        {
                            btntext:"Continue Lesson",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabtn2={
                        {
                            btntext:"Learn more",
                            linkto:"/signup",
                            active:false
                        }
                    }

                    codeColor={"text-yellow-25"}
                    codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                    backgroundGradient={<div className="codeblock2 absolute"></div>}
                />
            </div>

            <ExploreMore/>

        </div>
        
        {/* Section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg h-[320px]'>
                    <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8 mx-auto'>
                        <div className='lg:h-[150px]'></div>
                        <div className='flex flex-row gap-7 text-white lg:mt-8'>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className='flex items-center gap-2'>
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/login"}>
                                <div>
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8'>
                    <div className='flex lg:flex-row flex-col justify-between gap-7 mb-10 mt-[95px] lg:mt-20 lg:gap-0'>

                        <div className='text-4xl font-semibold lg:w-[45%]'>
                            Get the Skills you need for a
                            <HighlightText text={"Job that is in demand."}/>
                        </div>

                        <div className='flex flex-col gap-10 lg:w-[40%] items-start'>
                            <div className='text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div>
                                    Learn more
                                </div>
                            </CTAButton>

                        </div>

                    </div>

                    <TimelineSection/>

                    <LearningLanguageSection/>
            </div>

            

        </div>
        
        {/* Section 3 */}
        <div className='relative w-11/12 mx-auto my-16 max-w-maxContent flex flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>
            <InstructorSection/>
            <h2 className='text-center text-4xl font-semibold mt-8'>Reviews from other learners</h2>
            {/* Review Slider Here */}
            <ReviewSlider/>
        </div>


        {/* Footer */}
        <Footer/>

    </div>
  );
}

export default Home;