import React from 'react'

const MentorDashboard = () => {
  return (
    <div>
      <div className="mt-8 bg-white p-6 shadow-md rounded-lg max-h-full">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
        📢 Announcements
        </h2>
        <Announcement />
      </div>
    </div>
  )
}

export default MentorDashboard
