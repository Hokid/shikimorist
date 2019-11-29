import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const labels = {
    0: "Нет оценки",
    1: "Хуже некуда",
    2: "Ужасно",
    3: "Очень плохо",
    4: "Плохо",
    5: "Более-менее",
    6: "Нормально",
    7: "Хорошо",
    8: "Отлично",
    9: "Великолепно",
    10: "Эпик вин!"
};

type Props = {
    value: number;
    onChange(value: number): any;
}
type State = {
    isHover: boolean;
    hoverPointer: number;
}

export class Rate extends Component<Props, State> {
    state: State = {
        isHover: false,
        hoverPointer: 0
    };

    render() {
        const labelValue = this.state.isHover
            ? this.state.hoverPointer
            : this.props.value;
        const labelText = labels[labelValue as keyof typeof labels];

        return (
            <div
                style={{
                    display: 'inline-block',
                    width: 215,
                    verticalAlign: 'middle',
                    lineHeight: '51px',
                    textAlign: 'left'
                }}
            >
                <div
                    style={{
                        cursor: 'pointer',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        lineHeight: 'normal',
                        width: 135,
                        height: 24
                    }}
                    onClick={() => this.props.onChange(this.state.hoverPointer)}
                    onMouseEnter={() => this.setState({
                        isHover: true,
                        hoverPointer: 0
                    })}
                    onMouseLeave={() => this.setState({
                        isHover: false,
                        hoverPointer: 0
                    })}
                >
                    <div>
                        {this.renderBackground()}
                    </div>
                    <div
                        style={{
                            marginTop: -24,
                            color: this.state.isHover ? '#a1a1a1' : '#4c86c8'
                        }}
                    >
                        {this.renderSelected()}
                    </div>
                    {
                        this.state.isHover && (
                            <div
                                style={{
                                    marginTop: -24,
                                    color: '#ff9231'
                                }}
                            >
                                {this.renderHovered()}
                            </div>
                        )
                    }
                    <div
                        style={{
                            marginTop: -24,
                        }}
                    >
                        {this.renderHoverTriggers()}
                    </div>
                </div>
                <span
                    style={{
                        textAlign: 'center',
                        display: 'inline-block',
                        verticalAlign: 'top',
                        lineHeight: 'normal',
                        width: 80
                    }}
                >
                    <span
                        style={{
                            fontSize: 30
                        }}
                    >{labelValue}</span>
                    <br/>
                    <span
                        style={{
                            fontSize: 10
                        }}
                    >{labelText}</span>
                </span>
            </div>
        );
    }

    renderBackground() {
        const list = [];

        for (let i = 0; i < 5; i++) {
            list.push(
                <FontAwesomeIcon
                    key={i}
                    icon="star"
                    size="2x"
                />
            );
        }

        return list;
    }

    renderSelected() {
        const list = [];
        const starts = Math.floor(this.props.value / 2);
        const isHalf = (this.props.value % 2) !== 0;

        for (let i = 1; i <= starts; i++) {
            list.push(
                <FontAwesomeIcon
                    key={i}
                    icon="star"
                    size="2x"
                    color="inherit"
                />
            );
        }

        if (isHalf) {
            list.push(
                <FontAwesomeIcon
                    key="half"
                    icon="star-half"
                    size="2x"
                    color="inherit"
                />
            );
        }

        return list;
    }

    renderHoverTriggers() {
        const list = [
            <div
                style={{
                    height: 24,
                    width: 5,
                    display: 'inline-block',
                    verticalAlign: 'top'
                }}
                onMouseEnter={() => this.setState({
                    hoverPointer: 0
                })}
            />
        ];

        for (let i = 1; i < 11; i++) {
            list.push(
                <div
                    key={i}
                    style={{
                        height: 24,
                        width: i === 1 ? 8.5: 13.5,
                        display: 'inline-block',
                        verticalAlign: 'top'
                    }}
                    onMouseEnter={() => this.setState({
                        hoverPointer: i
                    })}
                />
            );
        }

        return list;
    }

    renderHovered() {
        const list = [];
        const starts = Math.floor(this.state.hoverPointer / 2);
        const isHalf = (this.state.hoverPointer % 2) !== 0;

        for (let i = 1; i <= starts; i++) {
            list.push(
                <FontAwesomeIcon
                    key={i}
                    icon="star"
                    size="2x"
                    color="inherit"
                />
            );
        }

        if (isHalf) {
            list.push(
                <FontAwesomeIcon
                    key="half"
                    icon="star-half"
                    size="2x"
                    color="inherit"
                />
            );
        }

        return list;
    }
}
