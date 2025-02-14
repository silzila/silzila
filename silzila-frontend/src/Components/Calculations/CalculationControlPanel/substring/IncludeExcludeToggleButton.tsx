import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React from "react";

export default function IncludeExcludeToggleButton({
    includeOrExclude,
    setIncludeOrExclude
}: {
    includeOrExclude: string,
    setIncludeOrExclude: any
}) {

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        if (newAlignment === null) return;
        setIncludeOrExclude(newAlignment);
    };

    return (
        <ToggleButtonGroup
            style={{ marginTop: "10px", marginLeft: "4px", marginRight: "4px", width: "100%" }}
            value={includeOrExclude}
            exclusive
            onChange={handleAlignment}
            aria-label="include or exclude"
            size='small'
        >
            <ToggleButton style={{
                padding: '4px 8px',
                width: '48%',
                textTransform: 'none'
            }} value="include" aria-label="left aligned">
                Include
            </ToggleButton>
            <ToggleButton style={{
                padding: '4px 8px',
                width: '48%',
                textTransform: 'none'
            }} value="exclude" aria-label="exclude">
                Exclude
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
