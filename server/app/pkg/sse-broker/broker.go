package ssebroker

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/zhulik/pal"
)

type IBroker interface {
	Notify(id string, event string, data any) error
	HandleConnect(w http.ResponseWriter, r *http.Request)
}

type Broker struct {
	clients map[string]chan string
	mu      sync.Mutex
}

func (b *Broker) Init(_ context.Context) error {
	b.clients = make(map[string]chan string)
	return nil
}

func (b *Broker) RegisterClient(id string) chan string {
	ch := make(chan string)
	b.mu.Lock()
	defer b.mu.Unlock()
	b.clients[id] = ch
	return ch
}

func (b *Broker) UnregisterClient(id string) {
	b.mu.Lock()
	defer b.mu.Unlock()
	ch, ok := b.clients[id]
	if ok {
		delete(b.clients, id)
		close(ch)
	}
}

func (b *Broker) HandleConnect(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing id", http.StatusBadRequest)
		return
	}
	f, ok := w.(http.Flusher)
	if !ok {
		log.Println("http.Flusher is not supported")
		http.Error(w, "Internal error", http.StatusBadRequest)
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Transfer-Encoding", "chunked")
	w.WriteHeader(200)

	if _, ok = b.clients[id]; ok {
		b.UnregisterClient(id)
	}
	ch := b.RegisterClient(id)
	defer b.UnregisterClient(id)
	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-r.Context().Done():
			return
		case <-ticker.C:
			{
				if _, err := w.Write([]byte(":\n\n")); err != nil {
					fmt.Println(err)
					return
				}
				f.Flush()
			}
		case message, ok := <-ch:
			{
				if !ok {
					return
				}
				if _, err := w.Write([]byte(message)); err != nil {
					fmt.Println(err)
					return
				}
				f.Flush()
			}
		}
	}
}

func (b *Broker) Notify(id string, event string, data any) error {
	data, err := json.Marshal(data)
	if err != nil {
		return errors.New("failed to marshal data")
	}
	b.mu.Lock()
	ch, ok := b.clients[id]
	b.mu.Unlock()
	if ok {
		ch <- fmt.Sprintf("event: %s\ndata: %s\n\n", event, data)
	}

	return nil
}

func Broadcast() {}

func Provide() pal.ServiceDef {
	return pal.Provide[IBroker](&Broker{})
}
