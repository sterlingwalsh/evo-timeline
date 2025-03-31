import { ButtonBase } from "@mui/material"
import classes from './page.module.scss'

interface HeaderItemProps {
    to: string
    label: string;
}

export const HeaderItem: React.FC<HeaderItemProps> = ({ to, label }) => {
    return <ButtonBase href={to} className={classes.header_item}>
        {label}
    </ButtonBase>
}