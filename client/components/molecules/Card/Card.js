import React from 'react';

function elemMaker(children = []) {
    return(children.map(elem =>
        <div key = {elem.id} className = "child">
            {elem.title}
        </div>))
}

function Card() {
    // const mainTitle = item.title;
    // const description = item.content.description;
    // const children = item.content.children;
    
    const dummychildren = [
        {
            id : 1,
            title : "문서 제목 1"
        },
        {
            id : 2,
            title : "문서 제목 2"
        },
        {
            id : 3,
            title : "문서 제목 3"
        }
    ]
    const arrayRender = elemMaker(dummychildren);

    return(
        <div className = "card">
            <div className = "main-title">
                서랍 이름
            </div>
            <div className = "description">
                서랍 설명 Lorem ipsum 
            </div>
            <div className = "container-child">
                {arrayRender}
            </div>
            <div className = "card-footer">
                
            </div>

        </div>
    )
}

export default Card