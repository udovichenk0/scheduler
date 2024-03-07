import { deleteById } from './../lib';
import { describe, expect, test } from "vitest";

describe("test task libs", () => {
  test("should delete task by id", () => {
    const { data, expected } = testConf.deleteById
    const result = deleteById(data, '3')
    expect(result).toEqual(expected)
  })
  test("should delete task by id", () => {
    const { data, expected } = testConf.deleteById
    const result = deleteById(data, '3')
    expect(result).toEqual(expected)
  })
})

const testConf = {
  deleteById: {
    data: getTasks(),
    expected: [
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
  ]
  }
}

function getTasks(){
  return [
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
  ]
}
