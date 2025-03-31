import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers"
import classes from './textfield.module.scss';
import { TextFieldProps } from "@mui/material";

export type DatePickerProps = MuiDatePickerProps<any> & Pick<TextFieldProps, 'required' | 'helperText' | 'name'> & {
}

export const DatePicker: React.FC<DatePickerProps> = ({ required, helperText, name, ...props }) => {
    return <MuiDatePicker slotProps={{
        'textField': {
            required,
            helperText,
            name,
            className: classes.override,
            variant: 'outlined',
        },
        'openPickerButton': {
            className: classes.aware_highlight
        }
    }} {...props} />
}