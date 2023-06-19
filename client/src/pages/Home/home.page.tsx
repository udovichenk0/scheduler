import { Fragment } from "react"
import { MainLayout } from "@/widgets/layouts/main"
import { Task } from "@/shared/ui/task"


const items = [
  {id: 1, status: 'FINISHED' as const, title: 'sometitme', description: 'desc'},
  {id: 2, status: 'FINISHED' as const, title: 'second', description: 'desc'},
  {id: 3, status: 'INPROGRESS' as const, title: 'someshit', description: 'desc'},
  {id: 4, status: 'FINISHED' as const, title: 'asdfsdf', description: 'desc'},
  {id: 5, status: 'FINISHED' as const, title: 'sometasdfsdfasdfitme', description: 'desc'},
]

export const Home = () => {
  return (
    <MainLayout action={() => console.log('')} iconName="common/inbox" title="Home">
      <div className="">
        {items.map((item) => {
          return (
            <Fragment key={item.id}>
              <Task title={item.title} status={item.status} onChange={() => console.log('toggle')} 
                onDoubleClick={function (): void {
                  throw new Error("Function not implemented.")
                } } />
            </Fragment>
          )
        })}
      </div>
    </MainLayout>
  )
}

