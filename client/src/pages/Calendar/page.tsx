import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Layout } from "@/widgets/layout/main/ui.tsx"
import { CalendarWidget } from "@/widgets/calendar/calendar"

import { LONG_MONTHS_NAMES } from "@/shared/config/constants"
import { SDate, sdate } from "@/shared/lib/date/lib"

import {
  $$taskCreator,
  $$taskTrasher,
  $$taskUpdater,
  $unplacedTasks,
} from "./model"

const CalendarPage = () => {
  const [headerDate, setHeaderDate] = useState(() => sdate())
  const { t } = useTranslation()

  return (
    <Layout title={t("task.calendar")}>
      <Layout.Header
        iconName="common/calendar"
        title={<Title date={headerDate} />}
      />
      <Layout.Content className="flex h-full flex-col">
        <CalendarWidget
          $$taskCreator={$$taskCreator}
          $$taskRemover={$$taskTrasher}
          $$taskUpdater={$$taskUpdater}
          $tasks={$unplacedTasks}
          onChange={setHeaderDate}
        />
      </Layout.Content>
    </Layout>
  )
}
const Title = ({ date }: { date: SDate }) => {
  const { t } = useTranslation()
  const month = date.month
  const year = date.year

  return (
    <span>
      {t("task.calendar")},&nbsp;
      {t(LONG_MONTHS_NAMES[month])}&nbsp;
      {year}
    </span>
  )
}

export default CalendarPage
