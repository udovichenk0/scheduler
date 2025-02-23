package smtp

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

type Port interface {
	SendEmail(opts SendInput) error
}
