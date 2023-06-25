
import { Fragment } from "react"
import { MainLayout } from "@/widgets/layouts/main"
import { Task } from "@/shared/ui/task"

export const Home = () => {
  return (
    <MainLayout action={() => console.log('')} iconName="common/inbox" title="Home">
      <div className="">
        {/* {items.map((item) => {
          return (
            <Fragment key={item.id}>
              <Task 
                data={item} 
                onChange={() => console.log('toggle')} 
                onDoubleClick={function (): void {
                  throw new Error("Function not implemented.")
                } } />
            </Fragment>
          )
        })} */}
      </div>
    </MainLayout>
  )
}

