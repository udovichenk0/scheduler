package sseinvitation

type IInvitation interface {
	Notify(id string, event string, data any) error
}
