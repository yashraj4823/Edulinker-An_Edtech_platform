import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText'
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div>

        <div className='text-4xl font-semibold text-center'>
            Unlock the
            <HighlightText text={"Power of code"}/>
        </div>

        <p className='text-center text-richblack-300 text-sm text-[16px] font-semibold mt-3'>
            Learn to build anything you can imagine
        </p>

        {/* Tabs Section */}
        <div className='flex flex-row gap-5 -mt-5 mx-auto w-max rounded-full bg-richblack-800 mb-5 text-richblack-200 p-1 font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
            {
                tabsName.map((element, index) => {
                    return (
                        <div
                        className={`text-[16px] flex flex-row items-center gap-2 ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                        key={index}
                        onClick={() => setMyCards(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>

        <div className='h-[150px]'></div>

        {/* Cards group */}
        <div className='absolute flex flex-row gap-10 justify-between flex-wrap w-full left-[50%] translate-x-[-50%] translate-y-[-50%] text-black '>
            {
                courses.map((element, index) => {
                    return (
                        <CourseCard
                        key={index} 
                        cardData = {element}
                        currentCard = {currentCard}
                        setCurrentCard = {setCurrentCard}
                        />
                    );
                })
            }
        </div>
    </div>
  )
}

export default ExploreMore