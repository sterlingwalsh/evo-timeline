import { AutocompleteProps as MuiAutocompleteProps, Autocomplete as MuiAutocomplete, TextFieldProps, Chip } from "@mui/material";
import { TextField } from "./textfield";

export type AutocompleteProps<Value, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined, ChipComponent extends React.ElementType = "div"> =
    Partial<MuiAutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>> &
    Pick<TextFieldProps, 'label' | 'name' | 'required' | 'helperText'> & {

    }

export function Autocomplete<Value, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined, ChipComponent extends React.ElementType = "div">(props: AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>) {
    const { name, label, required, helperText, ...rest } = props;
    return <MuiAutocomplete<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>

        renderTags={(value, getTagProps) =>
            value.map((option: Value, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                    <Chip variant="outlined" label={option + ''} key={key} {...tagProps} />
                );
            })
        }
        renderInput={
            params =>
                <TextField
                    {...params}
                    label={label}
                    name={name}
                    required={required}
                    helperText={helperText}
                />}
        {...rest}
        options={rest.options ?? []} />
}