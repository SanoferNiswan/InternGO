import React, { useState } from "react";

const ResetPassword = () => {
    const [submitted,setSubmitted] = useState(false);
  return (
    <div>
      <form>
        <input type="password" placeholder="password" />
        <input type="password" placeholder="Confirm-password" />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default ResetPassword;
