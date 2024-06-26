import React from 'react'

const EmptyCard = ({ message }) => {
    return (
        <div className="items-center justify-center mt-20">
            <p className="text-xl font-medium text-slate-700 text-center leading-7 mt-5">
                {message}
            </p>
        </div>
    )
}

export default EmptyCard
