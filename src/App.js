import React from 'react';
import './App.css';
import HeaderBar from './HeaderBar';
import VideoApp from './VideoApp';
import {BrowserRouter, Route} from 'react-router-dom';
import {Layout} from 'antd';

const App = () => {
    return (
        <Layout>
        <div className = "App" > < div className = "page" >
            < div className = "content" >
                <BrowserRouter>
                < HeaderBar />
                    < Route path = '/' exact = { true } component = { VideoApp }/>
                </BrowserRouter>
                        </div>
                            </div>
                                </div>
                                </Layout>);
};
export default App;
