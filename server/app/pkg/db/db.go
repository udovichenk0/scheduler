package dbutils

import (
	"database/sql"
	"time"
)

func NullTimeToPtr(nulltime sql.NullTime) *time.Time {
	if nulltime.Valid && !nulltime.Time.IsZero() {
		return &nulltime.Time
	}
	return nil
}

func TimeToNullTime(t time.Time) (value sql.NullTime) {
	value.Valid = !t.IsZero()
	value.Time = t
	return value
}

// func NullStringToPtr(str sql.NullString) *string {
// 	if str.Valid && !(str.String == "") {
// 		return &str.String
// 	}
// 	return nil
// }
