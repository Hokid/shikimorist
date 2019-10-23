import React from 'react';
import './App.css';
import {Container} from 'inversify';
import {Provider as IoCProvider} from 'inversify-react';
import {MainPage} from './pages/main/Main';
import {AuthContextProvider} from './contexts/Authorization';

type Props = {
    container: Container;
}

const App: React.FC<Props> = (props) => {
    return (
        <div>
            <IoCProvider container={props.container}>
                <AuthContextProvider>
                    <MainPage/>
                </AuthContextProvider>
            </IoCProvider>
        </div>
    );
};

export default App;
