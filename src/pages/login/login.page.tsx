import { Page } from '../layout/page'
import classes from './login.module.scss'

export const LoginPage: React.FC = () => {
    return <Page>
        <Page.Header />
        <Page.Body>
            <div>Login</div>
        </Page.Body>
    </Page>
}