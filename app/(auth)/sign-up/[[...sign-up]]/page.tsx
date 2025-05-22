import { SignUp } from '@clerk/nextjs'

import React from 'react'

function page() {

    return (

        <div className='flex flex-col items-center justify-center h-screen bg-gray-700'>
            <SignUp />
        </div>

    )
}


export default page