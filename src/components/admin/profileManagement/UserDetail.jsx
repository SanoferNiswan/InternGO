import React from 'react';
import { useParams } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import Profile from '../../common/Profile';

const UserDetail = () => {
  const { id } = useParams();
  const {token} = useSelector((state) => state.auth);
  return (
    <div>
      <Profile userId={id} token={token} />
    </div>
  ) 
} 

export default UserDetail
