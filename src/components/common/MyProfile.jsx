import React from 'react'
import Profile from './Profile';
import { useSelector } from 'react-redux';

const MyProfile = () => {
  const { userId, token } = useSelector((state) => state.auth);
  return (
    <div>
      <Profile userId={userId} token={token}/>
    </div>
  )
}

export default MyProfile
