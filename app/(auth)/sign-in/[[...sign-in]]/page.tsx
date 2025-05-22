import { SignIn } from '@clerk/nextjs'

import React from 'react'

function page() {

    return (

        <div className='flex flex-col items-center justify-center h-screen bg-gray-700'>
            <SignIn />
        </div>

    )

}

export default page