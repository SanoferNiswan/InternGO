import React from 'react'
import Profile from './Profile';
import { useSelector } from 'react-redux';
import { decodeToken } from '../../utils/auth';

const MyProfile = () => {
  const { token } = useSelector((state) => state.auth);
  const {userId} = decodeToken(token);
  return (
    <div>
      <Profile userId={userId} token={token}/>
    </div>
  )
}

export default MyProfile
 