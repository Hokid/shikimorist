import React from 'react';
import {resolve} from 'inversify-react';
import {TYPES} from '../../iocTypes';
import {AuthorizationApi} from '../../core/api/authorization/Auhtorization';

export interface IAuthContext {
    isAuthorized: boolean;

    signIn(): Promise<void>;

    signOut(): Promise<void>;
}

export const authContext = React.createContext<IAuthContext>({
    isAuthorized: false,
    signIn: () => Promise.reject(),
    signOut: () => Promise.reject(),
});
export const AuthContextConsumer = authContext.Consumer;

type Props = {};
type State = {
    isReady: boolean;
    isAuthorized: boolean;
};

export class AuthContextProvider extends React.Component<Props, State> {
    @resolve(TYPES.AuthorizationApi)
    auth!: AuthorizationApi;

    state: State = {
        isReady: false,
        isAuthorized: false,
    };

    async componentDidMount() {
        const isAuthorized = await this.auth.isAuthorized();
        this.setState({
            isAuthorized,
            isReady: true
        });

        this.auth.on('updateStatus', (status: boolean) => {
            this.setState({
                isAuthorized: status
            });
        });
    }

    render() {
        const {Provider} = authContext;

        if (!this.state.isReady) {
            return null;
        }

        return (
            <Provider value={this.buildValue()}>
                {this.props.children}
            </Provider>
        );
    }

    buildValue(): IAuthContext {
        return {
            isAuthorized: this.state.isAuthorized,
            signIn: () => this.auth.signIn(),
            signOut: () => this.auth.signOut()
        };
    }
}
