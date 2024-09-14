import React from 'react';

const Container = ({ children }) => {
    return (
        <div className='w-full bg-gray-50 overflow-x-auto'>
            <div className='lg:px-10 sm:px-4 px-2 w-full'> {/* max-w-[1600px] */}
                {children}
            </div>
        </div>
    );
};

export default Container;
