import AdminWrapper from '@/AdminWrapper/AdminWrapper'
import React from 'react'

const ActivityLogs = () => {
  return (
    <>
    <AdminWrapper>
        <h2 className='text-2xl font-bold text-center justify-between'>Activity Logs</h2>
        <p className='text-center text-gray-500 mt-4'>This is where you can view all the activity logs of the admin dashboard.</p>
    </AdminWrapper>
      
    </>
  )
}

export default ActivityLogs
