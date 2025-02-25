import jwtDecode from "jwt-decode"; 

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token); 
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
};
