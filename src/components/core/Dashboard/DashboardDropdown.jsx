import React, { useState } from 'react';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import { VscSignOut } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sidebarLinks } from '../../../data/dashboard-links';
import { logout } from '../../../services/operations/authAPI';
import ConfirmationModal from '../../common/ConfirmationModal';
import SidebarLink from './SidebarLink';

const DashboardDropdown = () => {

    const {user} = useSelector((state) => state.profile)
    const [confirmationModal, setConfirmationModal] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <>
            <div
                className={`md:hidden group relative flex cursor-pointer items-center justify-center text-white`}
                >
                    <IoIosArrowDropdownCircle size={24} />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[240px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg border-[1px] border-richblack-600 bg-richblack-800 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] gap-y-2 ">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded border-t-[1px] border-t-richblack-600 bg-richblack-800"></div>
                        {
                            sidebarLinks.map((link) => {
                                if(link.type && user?.accountType !== link.type) return null

                                return (
                                    <SidebarLink
                                    key={link.id} 
                                    link={link} 
                                    iconName={link.icon}
                                    />
                                )
                            })
                        }
                        <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'></div>

                        <div className='flex flex-col'>
                            <SidebarLink
                                link={{name:"Settings", path:"/dashboard/settings"}}
                                iconName="VscSettingsGear"
                            />
                            <button
                            onClick={() => setConfirmationModal({
                                text1: "Are You Sure ?",
                                text2: "You will be logged out of your Account",
                                btn1Text: "Logout",
                                btn2Text: "Cancel",
                                btn1Handler: () => dispatch(logout(navigate)),
                                btn2Handler: () => setConfirmationModal(null),
                            })}
                            className='px-8 py-2 text-sm font-medium text-richblack-300'
                            >
                                <div className='flex items-center gap-x-2'>
                                    <VscSignOut className='text-lg'/>
                                    <span>Logout</span>
                                </div>
                            </button>
                        </div>

                    </div>
                    {
                        confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
                    }
            </div>
        </>
    );
}

export default DashboardDropdown;
