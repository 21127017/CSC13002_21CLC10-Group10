package models

type User struct {
	ID        int     `json: "id"`
	FirstName string  `json: "first_name"`
	LastName  string  `json: "last_name"`
	Rating    float64 `json: "rating"` // 0.0 - 5.0
	Role      string  `json: "role"`   //0: investor, 1: invesment, 2: admin
	Email     string  `json: "email"`
	Password  string  `json: "password"`
	Phone     string  `json: "phone"`
	Wallet    float64 `json: "wallet"`
}

// func (user *User) SetPassword(password string) {
// 	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
// 	user.Password = hashedPassword
// }
