import AdminWrapper from '@/AdminWrapper/AdminWrapper'
import React from 'react'

const UserManagement = () => {
  return (
    <>
    <AdminWrapper>
        <h2 className='text-2xl font-bold text-center justify-between'>User Management</h2>
        <p className='text-center text-gray-500 mt-4'>This is where you can manage all the users of the admin dashboard.</p>
    </AdminWrapper>
      
    </>
  )
}

export default UserManagement
