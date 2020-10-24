import React from 'react';
import * as Styled from './styles';
import {InputGroupType} from "./styles";

interface Props {
    labelText: string
    inputRef?: React.RefObject<HTMLInputElement>
    inputGroupSize: InputGroupType
}

interface WrapperProps {
    children: React.ReactNode
}

const InputWrapper: React.FC<WrapperProps> = ({children}) => (
    <Styled.InputWrapper>
        {children}
    </Styled.InputWrapper>
)

const TextInput: React.FC<Props> = ({labelText, inputRef, inputGroupSize }) => (
    <Styled.InputGroup inputGroupType={inputGroupSize}>
        <Styled.Label>
            {labelText}
        </Styled.Label>
        <Styled.Input type={"text"} ref={inputRef}/>
    </Styled.InputGroup>
);

export default TextInput;
