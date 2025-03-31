import { UploadForm } from "../../../components/upload/uploadform"
import { Page } from "../../layout/page"

export const LibraryUpload: React.FC = () => {
    return <Page>
        <Page.Header />
        <Page.Body><UploadForm /></Page.Body>
    </Page>
}
