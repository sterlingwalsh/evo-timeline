
import { useReducer, useState } from 'react'
import { LibraryItemRequest } from '../../types/app/libraryitem'

import { DatePicker } from '../controls/datepicker'
import { TextField } from '../controls/textfield'
import classes from './upload.module.scss'
import { AutocompleteChangeDetails, AutocompleteChangeReason, Button } from '@mui/material'
import { useAuth } from '../../context/auth/auth.context'
import { TagSelect } from './tagselect'
import { UploadTarget } from '../controls/upload/upload'

interface UploadFormState {
    item: { [K in keyof LibraryItemRequest]?: LibraryItemRequest[K] | null }
    errors: { [K in keyof LibraryItemRequest]?: string }
    valid?: boolean;
}



const reducer = (state: UploadFormState, update: UploadFormState['item']): UploadFormState => {
    const newState: UploadFormState = { ...state, errors: {} };
    newState.item = { ...newState.item, ...update }

    let valid = true;
    if (!newState.item.title) { newState.errors.title = 'A title is required'; valid = false };
    if (!newState.item.author) { newState.errors.author = 'An Author is required'; valid = false };
    if (!newState.item.scientificField) { newState.errors.scientificField = 'A scientific field is required'; valid = false };
    if (!newState.item.date) { newState.errors.date = 'A date is required'; valid = false };
    if (!newState.item.tags?.length) { newState.errors.tags = 'At least one tag is required'; valid = false };

    return { ...newState, valid }
}

const initialState: UploadFormState = {
    item: {
        author: '',
        date: null,
        scientificField: '',
        tags: [],
        title: '',
        file: null
    },
    errors: {}
}

export const UploadForm: React.FC = () => {
    const [{ api }] = useAuth();
    const [{ valid, errors, item }, update] = useReducer(reducer, initialState, (state) => ({ ...state, item: { ...state.item } }));
    const [showErrors, setShowErrors] = useState(false);


    const displayErrors = showErrors ? errors : {};

    const onClear = () => {
        update({ ...initialState.item })
    }

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (evt) => {
        evt.preventDefault();
        if (!valid) {
            setShowErrors(true);
            return
        };

        const res = await api.createLibraryItem(item as LibraryItemRequest);
        if (res.status === 200) {
            onClear();
        }

    }

    const onChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        update({ [evt.target.name]: evt.target.value })
    }

    const onTagChange = (evt: React.SyntheticEvent, value: string[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string> | undefined) => {
        update({ tags: value })
    }

    return <div className={classes.root}>
        <form className={classes.layout} onSubmit={onSubmit} noValidate>
            <UploadTarget className={classes.upload} multiple={false} required value={item.file} onChange={async (evt, files) => update({ file: files?.item(0) })} />
            <TextField required helperText={displayErrors.title} label='Title' name='title' value={item.title} onChange={onChange} />
            <TextField required helperText={displayErrors.author} label='Author' name='author' value={item.author} onChange={onChange} />
            <TextField required helperText={displayErrors.scientificField} label='Scientific Field' name='scientificField' value={item.scientificField} onChange={onChange} />
            <DatePicker required helperText={displayErrors.date} label='Created Date' name='date' value={item.date} onChange={(date) => update({ date })} />
            <div className={classes.tags_wrapper}>
                <TagSelect required helperText={displayErrors.tags} label='Tags' name='tags' freeSolo multiple value={item.tags ?? []} onChange={onTagChange} />
            </div>
            <div className={classes.button_row}>
                <Button variant='contained' type='reset' onClick={onClear}>clear</Button>
                <Button variant='contained' type='submit' disabled={!valid}>Submit</Button>
            </div>
        </form>
    </div>
}