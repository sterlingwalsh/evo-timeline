import { format } from 'date-fns';
import { useTimeline } from '../../pages/timeline/timeline.context';
import classes from './timeline.module.scss';
import { Button, Tooltip } from '@mui/material';

export const TimelineDetails: React.FC = () => {
    const [{ selectedItem }] = useTimeline();

    return selectedItem ? <div className={classes.timeline_details}>
        <h2 className={classes.section_header}>{selectedItem?.title}</h2>
        <div className={classes.body}>
            <h4>{selectedItem.author}</h4>
            <div>{format(selectedItem.date, 'RRRR-MM-dd')}</div>
            <div className={classes.data_details}>
                <div>Scientific Field</div>
                <div>{selectedItem.scientificField}</div>

                <div>Tags</div>
                <div>{selectedItem.tags.join(', ')}</div>
            </div>
        </div>
        <Tooltip title={selectedItem.fileName}>
            <Button className={classes.download_button} variant='contained' href={selectedItem.IPFS_Link}>Download</Button>
        </Tooltip>

    </div> : null
}