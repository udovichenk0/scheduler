package smtpserviceport

type SmtpConfig struct {
	Host     string
	Password string
	Port     string
	From     string
}

type SendInput struct {
	To      string
	Subject string
	Body    string
}

type Api interface {
	SendEmail(opts SendInput) error
}
