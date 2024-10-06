import React from 'react'
import DashboardDropdown from '../DashboardDropdown'
import ChangeProfilePicture from './ChangeProfilePicture'
import DeleteAccount from './DeleteAccount'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'

const Settings = () => {
  return (
    <>
        <div className='flex items-baseline gap-2'>
            <h1 className='mb-14 text-3xl font-medium text-richblack-5'>
              Edit Profile
            </h1>
            <DashboardDropdown/>
        </div>
        <ChangeProfilePicture/>
        <EditProfile/>
        <UpdatePassword/>
        <DeleteAccount/>
    </>
  )
}

export default Settings