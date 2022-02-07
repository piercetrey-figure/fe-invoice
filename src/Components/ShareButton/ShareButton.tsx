import { FunctionComponent, useState } from 'react';
import { Button } from 'Components';
import { QRModal } from 'Components/QRModal';
import styled from 'styled-components';
import { Colors } from 'consts';

const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 18 2 A 3 3 0 0 0 15 5 A 3 3 0 0 0 15.054688 5.5605469 L 7.9394531 9.7109375 A 3 3 0 0 0 6 9 A 3 3 0 0 0 3 12 A 3 3 0 0 0 6 15 A 3 3 0 0 0 7.9355469 14.287109 L 15.054688 18.439453 A 3 3 0 0 0 15 19 A 3 3 0 0 0 18 22 A 3 3 0 0 0 21 19 A 3 3 0 0 0 18 16 A 3 3 0 0 0 16.0625 16.712891 L 8.9453125 12.560547 A 3 3 0 0 0 9 12 A 3 3 0 0 0 8.9453125 11.439453 L 16.060547 7.2890625 A 3 3 0 0 0 18 8 A 3 3 0 0 0 21 5 A 3 3 0 0 0 18 2 z"/></svg>

const StyledButton = styled(Button)`
    svg {
        fill: white;
        margin-right: 10px;
    }
`

export interface ShareButtonProps {

}

export const ShareButton: FunctionComponent<ShareButtonProps> = ({}) => {
    const [qrOpen, setQrOpen] = useState(false)

    return <>
        {qrOpen && <QRModal requestClose={() => setQrOpen(false)} />}
        <StyledButton onClick={() => setQrOpen(true)}><ShareIcon /> Share</StyledButton>
    </>
}