package entity

import (
	"math/rand"
	"strconv"
	"time"

	"github.com/udovichenk0/scheduler/internal/ports/repository/verification/model"
)

type Verification struct {
	Id        string
	Code      string
	UserId    string
	ExpiresAt int64
}

const verificationDuration = time.Minute * 5

func GetVerificationExpiration() int64 {
	return time.Now().Add(verificationDuration).Unix()
}

func IsExpired(expiresAt int64) bool {
	return time.Now().After(time.Unix(expiresAt, 0))
}

func IsCodeValid(inpCode, actualCode string) bool {
	return inpCode == actualCode
}

func GenerateVerificationCode() string {
	var code string
	for i := 0; i < 6; i++ {
		code += strconv.Itoa(rand.Intn(10))
	}
	return code
}

func GetLatestVerification(verifications []model.Verification) Verification {
	latest := Verification{}

	for _, verification := range verifications {
		v := Verification{
			Id:        verification.Id,
			Code:      verification.Code,
			UserId:    verification.UserId,
			ExpiresAt: verification.ExpiresAt,
		}
		if latest.Id == "" {
			latest = v
			continue
		}
		if latest.ExpiresAt < v.ExpiresAt {
			latest = v
		}
	}
	return latest
}
