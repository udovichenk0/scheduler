package entity

type User struct {
	Id        string `json:"id"`
	Email     string `json:"email"`
	Hash      string `json:"hash"`
	Verified  bool   `json:"verified"`
	CreatedAt string `json:"created_at"`
}
