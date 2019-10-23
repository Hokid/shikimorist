import React, {Context} from 'react';

type Props = {
    contexts: {
        [key: string]: Context<any>;
    };
    to: React.ComponentType<any>;
    props: any;
}

type PropContext = {
    [key: string]: any;
};

type Builder = (context: PropContext) => React.ReactElement;

export function TakeContexts(props: Props) {
    const reducer = (prev: Builder, key: string): Builder => {
        const source = props.contexts[key];
        const Consumer = source.Consumer;
        return (context: PropContext) => (
            <Consumer>
                {
                    (data: any) => {
                        context[key] = data;
                        return prev(context);
                    }
                }
            </Consumer>
        );
    };
    const endBuilder = (context: PropContext) => {
        const To = props.to;
        return (
            <To
                {...props.props}
                {...context}
            />
        );
    };
    const build = Object.keys(props.contexts).reduce(
        reducer,
        endBuilder
    );

    return build({});
}

