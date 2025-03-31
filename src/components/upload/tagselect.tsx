
import { useState } from "react";
import { Autocomplete, AutocompleteProps } from "../controls/autocomplete";
import { AutocompleteChangeReason, AutocompleteChangeDetails } from "@mui/material";

export const TagSelect: React.FC<AutocompleteProps<string, true, false, true>> = ({ onChange, ...props }) => {
    const [options, setOptions] = useState<string[]>([])

    const handleChange = (event: React.SyntheticEvent, value: string[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string> | undefined) => {

        if (reason === 'createOption' && details?.option) {
            options.push(details.option);
            setOptions([...options])
        }
        onChange?.(event, value, reason, details);
    }

    return <Autocomplete {...props} required freeSolo multiple options={options} onChange={handleChange} />
}