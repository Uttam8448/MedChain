import React from 'react'
import { Navigate } from 'react-router-dom';
import { useContext } from 'react'
import { UserContext } from '../App'

const PrivateRoute = ({children}) => {

    const {token} = useContext(UserContext);

    if(token !== null)
        return children
    else
        return <Navigate to="/login" />

}

export default PrivateRoute