import { Navigate } from "react-router-dom"


function OpenRoute({ children }) {

  if (token === null) {
    return children
  } else {
    return <Navigate to="/dashboard" />
  }
}

export default OpenRoute