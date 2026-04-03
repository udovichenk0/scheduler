package sse

import (
	"github.com/zhulik/pal"
)

type SseHandler struct {
	Invitation *Invitation
}

func Provide() pal.ServiceDef {
	return pal.ProvideList(
		pal.Provide(&Invitation{}),
		pal.Provide(&SseHandler{}),
	)
}
