package sse

import (
	"net/http"

	ssebroker "github.com/udovichenk0/scheduler/pkg/sse-broker"
)

type Invitation struct {
	Broker ssebroker.IBroker
}

func (i Invitation) HandleConnect(w http.ResponseWriter, r *http.Request) {
	i.Broker.HandleConnect(w, r)
}

func (i Invitation) Notify(id string, event string, data any) error {
	i.Broker.Notify(id, event, data)
	return nil
}
