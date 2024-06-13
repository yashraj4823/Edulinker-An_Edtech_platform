import React, { useEffect, useState } from 'react'
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI'
import { useNavigate, useParams } from 'react-router-dom'
import GetAvgRating from '../utils/avgRating'
import RatingStars from '../components/common/RatingStars'
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { BiInfoCircle } from "react-icons/bi"
import { formatDate } from '../services/formatDate'
import Footer from '../components/common/Footer'
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar'
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard'
import ConfirmationModal from '../components/common/ConfirmationModal'
import { useDispatch, useSelector } from 'react-redux'
import { buyCourse } from '../services/operations/studentFeaturesAPI'
import { ACCOUNT_TYPE } from '../utils/constants'
import toast from 'react-hot-toast'
import { addToCart } from '../slices/cartSlice'
import Error from './Error'

const CourseDetails = () => {

    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { loading } = useSelector((state) => state.profile)
    const { paymentLoading } = useSelector((state) => state.course)
    const { courseId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [response, setResponse] = useState(null)
    const [avgReviewCount, setAvgReviewCount] = useState(0)
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
    const [isActive, setIsActive] = useState(Array(0))
    const [confirmationModal, setConfirmationModal] = useState(null)

    useEffect(() => {
        const getCourseDetails = async() => {
            try{
                const res = await fetchCourseDetails(courseId)
                setResponse(res)
                console.log("course details res: ", res)
            } catch(error) {
                console.log("Could not fetch Course Details")
            }
        }
        getCourseDetails()
    },[courseId])

    useEffect(() => {
        const count = GetAvgRating(response?.data?.courseDetails[0].ratingAndReviews)
        setAvgReviewCount(count)
    }, [response])

    useEffect(() => {
        let lectures = 0
        response?.data?.courseDetails[0]?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures)
    }, [response])

    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id) ? isActive.concat([id]) : isActive.filter((e) => e !== id)
        )
    }

    const handleBuyCourse = () => {

        if(token) {
            buyCourse(token, [courseId], user, navigate, dispatch)
            return;
        }

        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

    const handleAddToCart = () => {
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
          toast.error("You are an Instructor. You can't buy a course.")
          return
        }
        if(token) {
          dispatch(addToCart(response?.data?.courseDetails[0]))
          return
        }
        setConfirmationModal({
          text1: "You are not logged in!",
          text2: "Please login to add to cart",
          btn1Text: "Login",
          btn2Text: "Cancel",
          btn1Handler: () => navigate("/login"),
          btn2Handler: () => setConfirmationModal(null),
        })
      }

      if (loading || !response) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!response.success) {
        return <Error />
      }

      if (paymentLoading) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

    //console.log("res",response)

  return (
    <>
        <div className='relative w-full bg-richblack-800'>

            <div className='mx-auto box-content px-4 lg:w-[1260px] 2xl:relative'>

                <div className='mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]'>

                    <div className='relative block max-h-[30rem] lg:hidden'>

                        <div className='absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset] '>
                        </div>
                        <img 
                            src={response?.data?.courseDetails[0]?.thumbnail}
                            alt='course thumbnail'
                            className='aspect-auto w-full rounded-md'
                        />
                    </div>

                    <div className='z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5'>
                        <div>
                            <p className='text-4xl font-bold text-richblack-5 sm:text-[42px]'>
                                {response?.data?.courseDetails[0]?.courseName}
                            </p>
                        </div>
                        <p className='text-richblack-200'>
                            {response?.data?.courseDetails[0]?.courseDescription}
                        </p>
                        <div className='text-md flex flex-wrap items-center gap-2'>
                            <span className='text-yellow-25'>{avgReviewCount}</span>

                            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>

                            <span>{`${response?.data?.courseDetails[0]?.ratingAndReviews.length} Reviews`}</span>

                            <span>{`${response?.data?.courseDetails[0]?.studentEnrolled.length} Students Enrolled`}</span>
                        </div>
                        <div>
                            <p>
                                Created By {`${response?.data?.courseDetails[0]?.instructor.firstName} ${response?.data?.courseDetails[0]?.instructor.lastName}`}
                            </p>
                        </div>
                        <div className='flex flex-wrap gap-5 text-lg'>
                            <p className='flex items-center gap-2'>
                                {" "}
                                <BiInfoCircle/> Created at {formatDate(response?.data?.courseDetails[0]?.createdAt)}
                            </p>
                            <p className='flex items-center gap-2'>
                                {" "}
                                <HiOutlineGlobeAlt/> English
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                        <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                            Rs. {response?.data?.courseDetails[0]?.price}
                        </p>
                        <button className="cursor-pointer rounded-md bg-yellow-50 px-[20px] py-[8px] font-semibold text-richblack-900" onClick={handleBuyCourse}>
                            Buy Now
                        </button>
                        <button className="cursor-pointer rounded-md bg-richblack-900 px-[20px] py-[8px] font-semibold text-richblack-5"
                        onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                </div>
            
                {/* Course Card */}
                <div className='right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block'>
                    <CourseDetailsCard
                        course={response?.data?.courseDetails[0]}
                        setConfirmationModal={setConfirmationModal}
                        handleBuyCourse={handleBuyCourse}
                    />
                </div>
            </div>

        </div>

        <div className='mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]'>
            <div className='mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]'>

                <div className='my-8 border border-richblack-600 p-8'>
                    <p className='text-3xl font-semibold'>
                        What you'll learn
                    </p>
                    <div className='mt-5'>
                        {/* marked */}
                        {response?.data?.courseDetails[0]?.whatYouWillLearn}
                    </div>
                </div>

                {/* Course Content Section */}
                <div className='max-w-[830px]'>

                    <div className='flex flex-col gap-3'>
                        <p className='text-[28px]'>Course Content</p>
                        <div className='flex flex-wrap justify-between gap-2'>
                            <div>
                                <span>
                                {response?.data?.courseDetails[0]?.courseContent.length} {`Section(s) `}
                                </span>
                                {" | "}
                                
                                <span>
                                    {totalNoOfLectures} {`Lecture(s)`}
                                </span>
                                {" | "}
                                <span>
                                    {response?.data?.totalDuration} Total length
                                </span>
                            </div>
                            
                        
                            <div>
                                <button className='text-yellow-25'
                                onClick={() => setIsActive([])}
                                >
                                    Collapse all sections
                                </button>
                            </div>
                        </div>    
                    </div>

                    {/* Course Details Accordion */}
                    <div className='py-4'>
                        {
                            response?.data?.courseDetails[0]?.courseContent.map((course, index) => (
                                <CourseAccordionBar
                                    course={course}
                                    key={index}
                                    isActive={isActive}
                                    handleActive={handleActive}
                                />
                            ))
                        }
                    </div>

                    {/* Auhtor Details */}
                    <div className='mb-12 py-4'>
                        <p className='text-[28px] font-semibold'>
                            Auhtor
                        </p>
                        <div className='flex items-center gap-4 py-4'>
                            <img 
                                src={response?.data?.courseDetails[0]?.instructor.image ? response?.data?.courseDetails[0]?.instructor.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response?.data?.courseDetails[0]?.instructor.firstName} ${response?.data?.courseDetails[0]?.instructor.lastName}`}
                                alt='auhtor'
                                className='h-12 w-12 rounded-full object-cover'
                            />
                            <p className='text-lg'>
                                {`${response?.data?.courseDetails[0]?.instructor.firstName} ${response?.data?.courseDetails[0]?.instructor.lastName}`}
                            </p>
                        </div>
                        <p className='text-richblack-50'>{response?.data?.courseDetails[0]?.instructor?.additionalDetails?.about}</p>
                    </div>
                </div>

            </div>
        </div>

        <Footer/>
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
        }
    </>
  )
}

export default CourseDetails