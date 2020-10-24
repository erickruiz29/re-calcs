import styled from 'styled-components';
import tw from 'tailwind.macro';

export enum InputGroupType {
  half = "md:w-1/2",
  full = "md:w-full"
}

export interface StyledProps {
  inputGroupType?: InputGroupType;
}

export const InputWrapper = styled.div`
  ${tw`md:flex md:flex-wrap md:justify-between`};
`;

export const Content = styled.div`
  ${tw`mb-8 md:w-full`};
`;

export const Input = styled.input`
  ${tw `border py-2 px-3 text-grey-darkest`};
`;

export const Label = styled.label`
  ${tw `font-bold text-lg text-grey-darkest mb-2`};
`;

export const InputGroup = styled.div<StyledProps>`
  ${tw `flex flex-col mb-4 px-2`};
  ${({ inputGroupType }) => inputGroupType && inputGroupType === InputGroupType.half ? tw`md:w-1/2` : tw`md:w-full`};
`;
