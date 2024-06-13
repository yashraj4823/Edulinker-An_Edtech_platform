import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import CourseCard from './CourseCard';

const CourseSlider = ({Courses}) => {

  return (
    <>
        {
            Courses?.length ? (
                <Swiper 
                slidesPerView={1}
                loop={true}
                spaceBetween={25}
                pagination={true}
                modules={[Pagination, FreeMode, Autoplay]}
                className='max-h-[30rem]'
                autoplay = {{
                    delay: 1000,
                    disableOnInteraction: false
                }}
                navigation={true}
                breakpoints={{
                    1024: {slidesPerView:3,}
                }}
                >
                    {
                        Courses.map((course, index) => (
                            <SwiperSlide key={index}>
                                <CourseCard course={course} Height={"h-[250px]"}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            ) : (
                <p className='text-xl text-richblack-5'>No Courses Found</p>
            )
        }
    </>
  )
}

export default CourseSlider