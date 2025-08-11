package smtp

import (
	"context"
	"fmt"
	"net/smtp"

	"github.com/udovichenk0/scheduler/config"
	smtpport "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
	"github.com/zhulik/pal"
)

type Service struct {
	Config *config.Config

	auth     smtp.Auth
	From     string
	Password string
	Host     string
	Port     string
}

func (s *Service) Init(_ context.Context) error {
	auth := smtp.PlainAuth("", s.Config.Smtp.From, s.Config.Smtp.Password, s.Config.Smtp.Host)
	s.auth = auth
	s.From = s.Config.Smtp.From
	s.Password = s.Config.Smtp.Password
	s.Host = s.Config.Smtp.Host
	s.Port = s.Config.Smtp.Port
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide(&Service{})
}

func (s Service) SendEmail(opts smtpport.SendInput) error {
	addr := fmt.Sprintf("%s:%s", s.Host, s.Port)
	msg := []byte(fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s", opts.To, opts.Subject, opts.Body))
	err := smtp.SendMail(addr, s.auth, s.From, []string{opts.To}, []byte(msg))
	if err != nil {
		return err
	}
	return nil
}
