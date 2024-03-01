import { addTaskToKv, transformTasksToKv } from './../lib';
import { describe, expect, test } from "vitest";
import { removeTaskFromKv, removeTasksFromKvByFilter } from "../lib";

describe("test task libs", () => {
  test("should remove task from kv", () => {
    const { data, expected } = testConf.removeTaskFromKv
    const result = removeTaskFromKv(data, "2")
    expect(result).toEqual(expected)
  })
  test("should remove tasks from kv by filter", () => {
    const { data, expected } = testConf.removeTasksFromKvByFilter
    const result = removeTasksFromKvByFilter((task) => !task.is_deleted)(data)
    expect(result).toEqual(expected)
  })
  test("should transform tasks to kv", () => {
    const { data, expected } = testConf.transformTasksToKv
    const result = transformTasksToKv(data)
    expect(result).toEqual(expected)
  })
  test("should add task to kv", () => {
    const { data, expected } = testConf.addTaskToKv
    const result = addTaskToKv(data.kv, data.task)
    expect(result).toEqual(expected)
  })
})


const testConf = {
  removeTaskFromKv: {
    data: getTaskKv(),
    expected: {
      "1": {
        id: "1",
        title: "without date",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: true,
      },
      "3": {
        id: "3",
        title: "title 3",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: true,
      },
      "4": {
        id: "4",
        title: "title 4",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: false,
      },
    }
  },
  removeTasksFromKvByFilter: {
    data: getTaskKv(),
    expected: {
      "2": {
        id: "2",
        title: "title 2",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: false,
      },
      "4": {
        id: "4",
        title: "title 4",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: false,
      },
    }
  },
  transformTasksToKv: {
    expected: getTaskKv(),
    data: [
      {
        id: "1",
        title: "without date",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: true,
      },
      {
        id: "2",
        title: "title 2",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: false,
      },
      {
        id: "3",
        title: "title 3",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: true,
      },
      {
        id: "4",
        title: "title 4",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: false,
      },
    ],
  },
  addTaskToKv: {
    data: {
      kv: getTaskKv(),
      task: {
        id: "5",
        title: "title 5",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: false,
      }
    },
    expected: {
      ...getTaskKv(),
      "5": {
        id: "5",
        title: "title 5",
        description: "",
        type: "inbox" as const,
        status: "INPROGRESS" as const,
        start_date: null,
        user_id: "1",
        date_created: new Date("2023-12-03T11:11:51.227Z"),
        is_deleted: false,
      }
    }
  }
}

function getTaskKv(){
  const tasks = {
      "1": {
      id: "1",
      title: "without date",
      description: "",
      type: "inbox" as const,
      status: "INPROGRESS" as const,
      start_date: null,
      user_id: "1",
      date_created: new Date("2023-12-03T11:11:51.227Z"),
      is_deleted: true,
    },
    "2": {
      id: "2",
      title: "title 2",
      description: "",
      type: "inbox" as const,
      status: "INPROGRESS" as const,
      start_date: null,
      user_id: "1",
      date_created: new Date("2023-12-03T11:11:51.227Z"),
      is_deleted: false,
    },
    "3": {
      id: "3",
      title: "title 3",
      description: "",
      type: "inbox" as const,
      status: "INPROGRESS" as const,
      start_date: null,
      user_id: "1",
      date_created: new Date("2023-12-03T11:11:51.227Z"),
      is_deleted: true,
    },
    "4": {
      id: "4",
      title: "title 4",
      description: "",
      type: "inbox" as const,
      status: "INPROGRESS" as const,
      start_date: null,
      user_id: "1",
      date_created: new Date("2023-12-03T11:11:51.227Z"),
      is_deleted: false,
    },
  }
  return tasks
}
