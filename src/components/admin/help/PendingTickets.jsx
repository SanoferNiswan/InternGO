import React from 'react'
import { useSelector } from 'react-redux'
import UserHelp from '../../users/Help';

const PendingTickets = () => {
    const {role} = useSelector((state)=>state.auth);
  return (
    <>
    {/* {role=="Admins" && } */}
    </>
  )
}

export default PendingTickets
