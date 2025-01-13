import classes from './page.module.scss';

const PageRoot: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = (props) => {
    return <div {...props} className={`${classes.page}${props.className ? ` ${props.className}` : ''}`} />
}

const PageHeader: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = (props) => {
    return <div {...props} className={`${classes.page__header}${props.className ? ` ${props.className}` : ''}`} >
        <div className={classes.page__header_left}>
            <img height='100%' className={classes.header__logo} src={'/assets/images/logo.svg'} alt='evo-labs' />
        </div>
        <div className={classes.page__header_right}></div>
    </div>
}

const PageBody: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({ children, className, ...props }) => {
    return <div {...props} className={classes.page__body}>
        <div className={`${classes.page__body__contents}${className ? ` ${className}` : ''}`}>
            {children}
        </div>
    </div>
}

const PageFooter: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = (props) => {
    return <div {...props} className={`${classes.page__footer}${props.className ? ` ${props.className}` : ''}`} />
}



export const Page = Object.assign(PageRoot, { Header: PageHeader, Body: PageBody, Footer: PageFooter })