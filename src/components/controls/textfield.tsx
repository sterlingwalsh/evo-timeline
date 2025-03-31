import { TextFieldProps, TextField as MuiTextField } from "@mui/material";
import classes from './textfield.module.scss';
import { clsx } from "../../helpers/clsx";

export const TextField: React.FC<TextFieldProps> = (props) => {
    return <MuiTextField variant='outlined' {...props} className={clsx(classes.override, props.className)} />
}