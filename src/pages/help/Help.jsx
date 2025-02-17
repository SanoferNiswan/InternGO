import React from 'react'
import { useSelector } from 'react-redux'
import PendingTickets from '../../components/admin/help/PendingTickets';
import UserHelp from '../../components/users/Help';

const Help = () => {
    const {role} = useSelector((state)=>state.auth);
  return (
    <>
      {(role=="Admins" || role=="Mentors")? <PendingTickets /> : <UserHelp />}
    </>
  )
}

export default Help;
