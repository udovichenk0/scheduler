package pkg

import (
	"database/sql"
	"time"
)

func NewNullString(value string) sql.NullString {
	if value == "" {
		return sql.NullString{}
	}
	return sql.NullString{
		String: value,
		Valid:  true,
	}
}

func NewNullInt(value int64) sql.NullInt64 {
	if value == 0 {
		return sql.NullInt64{}
	}
	return sql.NullInt64{
		Int64: value,
		Valid: true,
	}
}

func UnixToDateTime(date int64) string {
	return time.Unix(date, 0).Format(time.DateTime)
}
