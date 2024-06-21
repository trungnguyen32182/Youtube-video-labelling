import React from 'react';
import FormPage from './components/FormPage';
import BackgroundGradientAnimation from './components/BackGroundGradientAnimation';
import AppBar from './components/AppBar';
const Home = () => {
    return (
        <>
            <AppBar/>
            <BackgroundGradientAnimation />
            <div>
                <div className='container mx-auto relative flex flex-row justify-between items-center px-4 z-50'>
                    <FormPage
                        title="Welcome To Our Website"
                        desc="Let's have a good time together"
                        isHomePage={true}
                    />
                </div>
            </div>
        </>
    );
}

export default Home;