import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const CustomLoader = () => {

    return (
        <div className='flex justify-center items-center h-dvh'>
            <Spinner size="lg" />
        </div>
    );
};

export default CustomLoader;
