import React from 'react';
import * as Styled from './styles';
import {InputGroupType} from "./styles";

interface Props {
    labelText: string
    inputRef?: React.RefObject<HTMLInputElement>
    inputGroupSize: InputGroupType
    type: string
    placeholder: string
}

interface WrapperProps {
    children: React.ReactNode
}

export const InputWrapper: React.FC<WrapperProps> = ({children}) => (
    <Styled.InputWrapper>
        {children}
    </Styled.InputWrapper>
)

export const InputLabelGroup: React.FC<Props> = ({labelText, inputRef, inputGroupSize, type, placeholder }) => (
    <Styled.InputGroup inputGroupType={inputGroupSize}>
        <Styled.Label>
            {labelText}
        </Styled.Label>
        <Styled.Input type={type} ref={inputRef} placeholder={placeholder}/>
    </Styled.InputGroup>
);
