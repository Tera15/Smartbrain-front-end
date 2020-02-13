import React from 'react';

const Rank = ({name, entries}) => {
    return (
        <div>
            <div className='white f3'>
                {`${name}, you have scanned:`}
            </div>
            <div className='white f1'>
                {`${entries} images`}
            </div>
        </div>
    );
}

export default Rank;