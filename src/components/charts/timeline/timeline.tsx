import { useEffect, useRef, useState } from 'react';
import classes from './timeline.module.scss';
import { TimelineCategory, TimelineController, TimelineDataPoint } from './timeline.controller';



interface TimelineProps<T extends object = object> extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> {
    data: TimelineDataPoint<T>[];
    categories: TimelineCategory[];
    instanceRef?: React.MutableRefObject<TimelineController<T> | null>;
    getHoverDetails?: (item: T) => { title?: string, text?: string[], image?: string }
    onItemClick?: (item: T) => void;
}

export function Timeline<T extends object = object>({ data, className, categories, instanceRef, onItemClick, getHoverDetails, ...divProps }: TimelineProps<T>) {
    const svgRef = useRef<SVGSVGElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const [controller, setController] = useState<TimelineController<T> | null>(null)
    if (instanceRef) instanceRef.current = controller;

    useEffect(() => {
        if (!svgRef.current) return;
        const cont = new TimelineController<T>();
        cont.init(data, categories, svgRef.current, rootRef.current);
        setController(cont)
    }, [instanceRef, data, categories]);

    if (controller) {
        controller.getHoverDetails = getHoverDetails;
        controller.onItemClick = onItemClick
    }

    return <div ref={rootRef} {...divProps} className={`${classes.root}${className ? ` ${className}` : ''}`}><svg ref={svgRef} fill='none' /></div>
}