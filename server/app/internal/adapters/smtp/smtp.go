package smtp

import (
	"fmt"
	"net/smtp"

	smtpport "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
)

type Service struct {
	auth     smtp.Auth
	From     string
	Password string
	Host     string
	Port     string
}

type Opts struct {
	From     string
	Password string
	Host     string
	Port     string
}

func New(conf Opts) Service {
	auth := smtp.PlainAuth("", conf.From, conf.Password, conf.Host)
	return Service{
		auth:     auth,
		Host:     conf.Host,
		From:     conf.From,
		Password: conf.Password,
		Port:     conf.Port,
	}
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
