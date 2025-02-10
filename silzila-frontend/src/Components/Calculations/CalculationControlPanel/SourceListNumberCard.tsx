import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDrop, DropTargetMonitor, useDrag } from 'react-dnd';
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from 'react-redux';

const SourceListNumberCard = ({

    index,
    value,
    tabTileProps,
    valueType,
    calculations,

    moveCard,
    handleSourceCardCrossButton,
    updateDecimalSourceValue,

}: {

    index: number,
    value: any,
    tabTileProps: any,
    valueType: string,
    calculations: any,

    moveCard: (dragIndex: number, hoverIndex: number) => void;
    handleSourceCardCrossButton: (sourceId: string, sourceIndex: number) => void;
    updateDecimalSourceValue: (propKey: string, sourceIndex: number, value: number) => void

}) => {

    interface DragItem {
        index: number;
        id: string;
        type: string
    }

    const propKey = useMemo(() => `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`, [tabTileProps.selectedTabId, tabTileProps.selectedTileId]);
    const [sourceCardHoverActive, setSourceCardHoverActive] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const currentCalculationSession = calculations.properties[propKey]?.currentCalculationSession;
    const activeFlow = currentCalculationSession.activeFlow
    const [inputValue, setInputValue] = useState(`${value}`);
    const ref = useRef<HTMLDivElement>(null);

    function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
        let timeout: ReturnType<typeof setTimeout>;

        return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedSetInputValue = useCallback(debounce(({
        value,
        propKey,
        sourceIndex
    }: {
        value: string,
        propKey: string,
        sourceIndex: number
    }) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            updateDecimalSourceValue(propKey, sourceIndex, numValue);
        }
    }, 200), []);

    useEffect(() => {
        debouncedSetInputValue({
            propKey,
            value: inputValue,
            sourceIndex: index
        });
    }, [inputValue]);

    useEffect(() => {
        setInputValue(`${value}`);
    }, [value]);

    const [, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
        accept: 'source-card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveCard(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
        type: 'source-card',
        item: (): DragItem => {
            return { id: value.sourceUID, index, type: 'source-card' };
        }
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ display: 'flex', flexDirection: 'column' }}
            onMouseEnter={() => setSourceCardHoverActive(true)}
            onMouseLeave={() => setSourceCardHoverActive(false)}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '97%',
                margin: '0 4px',
                padding: "0 4px",
                border: inputFocused ? '1px solid #2BB9BB' : '1px solid lightgray',
                color: 'rgb(128, 128, 128)'
            }}>
                <div>
                    <button
                        type="button"
                        className="buttonCommon columnClose"
                        title="Remove field"
                        onClick={() => handleSourceCardCrossButton(value, index)}
                        style={{ width: '13px', height: '13px',  }}
                    >
                        <CloseRoundedIcon
                            style={{ fontSize: "13px", display: sourceCardHoverActive ? 'block' : 'none' }}
                        />
                    </button>
                </div>
                {
                    valueType === 'integer' && <input
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        style={{
                            height: "1.5rem",
                            lineHeight: "1rem",
                            width: "100%",
                            paddingRight: "10px",
                            border: 'none',
                            outline: 'none',
                            color: "rgb(128, 128, 128)",
                        }}
                        type="number"
                        value={inputValue}
                        onChange={e => {
                            const newValue = e.target.value.replace(".", "");
                            if (typeof Number(newValue) === 'number' || newValue === "") {
                                setInputValue(newValue);
                            }
                        }}
                    />
                }
                {
                    valueType === 'decimal' && <input
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        style={{
                            height: "1.5rem",
                            lineHeight: "1rem",
                            width: "100%",
                            paddingRight: "10px",
                            border: 'none',
                            outline: 'none',
                            color: "rgb(128, 128, 128)",
                        }}
                        type="number"
                        step={1}
                        value={inputValue}
                        onChange={e => {
                            if (typeof Number(e.target.value) === 'number' || e.target.value === "") {
                                setInputValue(e.target.value);
                            }
                        }}
                    />
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        tabTileProps: state.tabTileProps,
        calculations: state.calculations,
    };
};

export default connect(mapStateToProps)(SourceListNumberCard);