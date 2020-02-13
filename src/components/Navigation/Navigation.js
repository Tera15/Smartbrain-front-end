import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) => {
    
        if(isSignedIn) {
    return(
                   <div>
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
{/*defined a function inside of onClick so that on route change ins only ran when we click the button*/} 
 <p onClick={ () => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>sign out</p>
            </nav> 
        </div>
    );
        } else {
            return (
                <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                {/*defined a function inside of onClick so that on route change ins only ran when we click the button*/} 
                <p onClick={ () => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>sign in</p>
                     <p onClick={ () => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>register</p>
                </nav> 
                );

        }
 
    
}

export default Navigation;