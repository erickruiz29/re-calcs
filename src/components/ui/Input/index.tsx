import React from 'react';
import * as Styled from './styles';
import {InputGroupType} from "./styles";

interface Props {
    labelText: string
    inputRef?: React.RefObject<HTMLInputElement>
    inputGroupSize: InputGroupType
    type: string
    placeholder: string
    id: string
    onChange: () => void
}

interface WrapperProps {
    children: React.ReactNode
}

export const InputWrapper: React.FC<WrapperProps> = ({children}) => (
    <Styled.InputWrapper>
        {children}
    </Styled.InputWrapper>
)

//export const InputLabelGroup: React.FC<Props> = ({labelText, inputRef, inputGroupSize, type, placeholder, onChange }) => (
//);
