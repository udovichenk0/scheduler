import { DownloadSvg } from "./assets/inbox.svg"

const Inbox = () => {
    return (
        <div className="px-5">
            <div className="flex gap-4">
                <DownloadSvg/>
                <h1 className="text-2xl">Inbox</h1>
            </div>
        </div>
    )
}

export default Inbox