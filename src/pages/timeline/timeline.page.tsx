import { useMemo, useRef } from "react";
import { Timeline } from "../../components/charts/timeline/timeline"
import { Page } from "../layout/page"
import { TimelineCategory, TimelineController, TimelineDataPoint } from "../../components/charts/timeline/timeline.controller";
import classes from './timeline.module.scss';
import { TimelineProvider, useTimeline } from "./timeline.context";
import { TimelineDetails } from "../../components/timeline/timelinedetails";
import { TimelineCategoryDetails } from "../../components/timeline/timelinecategorydetails";
import { LibraryItem } from "../../context/auth/api/types/libraryitem";
import { format } from "date-fns";

// const d1800 = new Date().setFullYear(1800, 0, 1);
// const today = new Date().valueOf();

// const categoryIds = new Array(10).fill(null).map((c, i) => i)

// const data = new Array(100).fill(null).map((n, i) => ({
//     title: (Math.random() + 1).toString(36).substring(10),
//     date: new Date((Math.random() * (today - d1800)) + d1800),
//     type: categoryIds[i % 10]
// }));

// data.push({
//     title: 'Min',
//     date: new Date(d1800),
//     type: categoryIds[4]
// })

// data.push({
//     title: 'Max',
//     date: new Date(today),
//     type: categoryIds[5]
// })



const colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#42d4f4', '#f032e6', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#000075', '#a9a9a9', '#ffffff', '#000000']

// const dataPoints = data.map(d => ({ data: d, x: d.date, categoryId: d.type, radius: 6 }))

// const categories = categoryIds.map((id, i) => ({
//     title: (Math.random() * 10).toString(36),
//     id: id,
//     color: colors[i],
//     y: i
// }))

const TimelinePageComponent: React.FC = () => {
    const ref = useRef<TimelineController<LibraryItem> | null>(null);
    const [{ items }, dispatch] = useTimeline();

    const { dataPoints, categories } = useMemo(() => {
        const categorySet = new Set<string>();
        const dataPoints: TimelineDataPoint<LibraryItem>[] = items?.map(item => {
            categorySet.add(item.scientificField);
            return {
                data: item,
                x: item.date,
                categoryId: item.scientificField,
                radius: 6
            }
        }) ?? [];

        const categories: TimelineCategory[] = Array.from(categorySet.values()).map((c, i) => ({
            title: c,
            id: c,
            color: colors[i],
            y: i
        }))
        return { dataPoints, categories }
    }, [items])


    return <Page>
        <Page.Header />
        <Page.Body className={classes.timeline_page}>
            <div className={`${classes.section} ${classes.timeline}`}>
                <Timeline data={dataPoints} categories={categories} instanceRef={ref} onItemClick={(item) => dispatch({ type: 'selectedItem', payload: item })} getHoverDetails={(item) => ({ title: item.title, text: [item.author, format(item.date, 'RRRR-MM-dd')] })} />
            </div>
            <div className={`${classes.section} ${classes.details}`}>
                <TimelineDetails />
            </div>
            <div className={`${classes.section} ${classes.category_details}`}>
                <TimelineCategoryDetails />
            </div>
        </Page.Body>
        <Page.Footer />
    </Page>


}

export const TimelinePage: React.FC = () => {
    return <TimelineProvider>
        <TimelinePageComponent />
    </TimelineProvider>
}