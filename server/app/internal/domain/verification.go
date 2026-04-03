package domain

import (
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/udovichenk0/scheduler/internal/ports/repository/verification/model"
	"github.com/udovichenk0/scheduler/pkg"
)

type Verification struct {
	Id        string
	Code      string
	UserId    string
	ExpiresAt time.Time
}

const verificationDuration = time.Minute * 5

func NewVerification(userId string) *Verification {
	return &Verification{
		Id:        pkg.NewUUID(),
		UserId:    userId,
		Code:      GenerateVerificationCode(),
		ExpiresAt: GetVerificationExpiration(),
	}
}

func GetVerificationExpiration() time.Time {
	return time.Now().Add(verificationDuration).UTC()
}

func (v Verification) IsExpired() bool {
	return time.Now().After(v.ExpiresAt)
}

func (v Verification) IsCodeValid(code string) bool {
	return v.Code == code
}

func GenerateVerificationCode() string {
	var code strings.Builder
	for range 6 {
		code.WriteString(strconv.Itoa(rand.Intn(10)))
	}
	return code.String()
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
		if latest.ExpiresAt.Before(v.ExpiresAt) {
			latest = v
		}
	}
	return latest
}
