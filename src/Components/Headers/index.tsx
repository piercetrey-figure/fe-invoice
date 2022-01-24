import styled from 'styled-components';
import { Colors } from 'consts';
import { FunctionComponent } from 'react';

export const Header = styled.h1`
  font-size: 3rem;
  line-height: 3rem;
  font-weight: bold;
  letter-spacing: 0.25rem;
  margin-bottom: 40px;
  transition: 6s all;
`;
export const SubHeader = styled.h2`
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
`;

export const H3 = styled.h3`
  font-size: 1.5rem;
  line-height: 2rem;
`

export interface TitleHeaderProps {
  title: string
}

const Title = styled(H3)`
  color: ${Colors.DARK};
  margin: 0;
`

const Value = styled(Header)`
  margin-top: 10px;
  margin-bottom: 0;
`

export const TitleHeader: FunctionComponent<TitleHeaderProps> = ({ title, children }) => <div>
  <Title>{title}</Title>
  <Value>{children}</Value>
</div>