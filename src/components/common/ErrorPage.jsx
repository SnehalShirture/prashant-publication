import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'
import DangerousIcon from '@mui/icons-material/Dangerous';

const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className='main-container'>
                <div className='error-page'>
                    <DangerousIcon size={55} color="#F50000" />
                    <p> <strong>404&nbsp;</strong> || Page not found</p>
                    <button className='back-button' onClick={() => {navigate("/") }}  >
                        <ArrowBackIcon size={18} />
                        back
                    </button>
                </div>
            </div>
        </>

    )
}

export default ErrorPage