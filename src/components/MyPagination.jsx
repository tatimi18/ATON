import React from 'react';

const MyPagination = ({totalPages, page, changePage}) => {
    let active = page;
    let pagesCount = totalPages;

    let result = [];
    for (let i = 0; i < pagesCount; i += 1) {
        result.push(i + 1);
    }

    return (
        <div className='page__wrapper'>
            {result.map(p => 
                <span 
                    onClick={() => changePage(p)}
                    key={p} 
                    className={active === p ? 'page page__current' : 'page'}
                >
                    {p}
                </span>
            )}

		</div>
    );
};

export default MyPagination;
