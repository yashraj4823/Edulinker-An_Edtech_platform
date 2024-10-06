import React, { useEffect, useState } from 'react'
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'

const VideoDetailsSidebar = ({setReviewModal}) => {

    const navigate = useNavigate()
    const location = useLocation()

    const { sectionId, subSectionId } = useParams()
    const {
        courseSectionData,
        courseEntireData,
        completedLectures,
        totalNoOfLectures,
    } = useSelector((state) => state.viewCourse)

    const [activeStatus, setActiveStatus] = useState("")
    const [videoBarActive, setVideoBarActive] = useState("")

    useEffect(() => {
        ;(() => {
            if(!courseSectionData.length)
                return

            const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)

            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex((data) => data._id === subSectionId)

            const activeSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id

            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)

            setVideoBarActive(activeSubSectionId)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[courseSectionData, courseEntireData, location.pathname])

  return (
    <>
        <div className='flex md:h-[calc(100vh-3.5rem)] w-full md:w-[320px] md:max-w-[350px]  flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800'>

            {/* For buttons and headings */}
            <div className='mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25'>
                {/* For buttons */}
                <div className='flex w-full items-center justify-between'>
                    <div
                    onClick={() => navigate("/dashboard/enrolled-courses")} 
                    className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90'
                    title='back'
                    >
                        <IoIosArrowBack size={30}/>
                    </div>
                    <IconBtn 
                        text="Add Review"
                        customClasses="ml-auto"
                        onclick={() => setReviewModal(true)}
                    />
                </div>

                {/* For headings or title */}
                <div className='flex flex-col'>
                    <p className=''>{courseEntireData?.courseName}</p>
                    <p className='text-sm font-semibold text-richblack-500'>{completedLectures?.length} / {totalNoOfLectures}</p>
                </div>
            </div>

            {/* For sections and subSections */}
            <div className='h-auto md:h-[calc(100vh-5rem)] overflow-y-auto'>
                {
                    courseSectionData.map((section, index) => (
                        <div
                        onClick={() => setActiveStatus(section?._id)}
                        key={index}
                        className='mt-2 cursor-pointer text-sm text-richblack-5'
                        >
                            {/* Section */}
                            <div className='flex flex-row justify-between bg-richblack-600 px-5 py-4'>
                                <div className='w-[70%]'>
                                    {section?.sectionName}
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className={`${activeStatus === section?._id ? "rotate-180" : "rotate-0"} transition-all duration-500`}>
                                        <BsChevronDown/>
                                    </span>
                                </div>
                            </div>
                            
                            {/* subSections */}
                            {
                                activeStatus === section?._id && (
                                    <div className='transition-[height] duration-200 ease-in-out'>
                                        {
                                            section.subSection.map((topic, index) => (
                                                <div
                                                className={`flex gap-3 px-5 py-2 ${videoBarActive === topic._id ? "bg-yellow-200 font-semibold text-richblack-800" : "hover:bg-richblack-900"}`}
                                                key={index}
                                                onClick={() => {
                                                    navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic._id}`)
                                                    setVideoBarActive(topic?._id)
                                                }}
                                                >
                                                    <input 
                                                        type='checkbox'
                                                        checked={completedLectures.includes(topic?._id)}
                                                        onChange={() => {}}
                                                    />
                                                    {topic.title}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>

        </div>
    </>
  )
}

export default VideoDetailsSidebar