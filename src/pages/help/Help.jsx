import React from 'react'
import { useSelector } from 'react-redux'
import PendingTickets from '../../components/admin/help/PendingTickets';
import UserHelp from '../../components/users/Help';
import { decodeToken } from '../../utils/auth';

const Help = () => {
    const {token} = useSelector((state)=>state.auth);
    const {role} = decodeToken(token);
  return (
    <>
      {(role=="Admins" || role=="Mentors")? <PendingTickets /> : <UserHelp />}
    </>
  )
}

export default Help;
