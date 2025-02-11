import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons({
    direction,
    setDirection
}: {
    direction: string,
    setDirection: any
}) {

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        if (newAlignment === null) return;
        setDirection(newAlignment);
    };

    return (
        <ToggleButtonGroup
            value={direction}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
            size='small'
            style={{

            }}
        >
            <ToggleButton style={{
                padding: '4px 8px',
                textTransform: 'none'
            }} value="left" aria-label="left aligned">
                Left
            </ToggleButton>
            <ToggleButton style={{
                padding: '4px 8px',
                textTransform: 'none'
            }} value="right" aria-label="centered">
                Right
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
