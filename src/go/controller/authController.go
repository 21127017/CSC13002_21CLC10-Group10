package controller

import (
	"InvestingHub/database"
	"InvestingHub/models"
	"fmt"
	"log"
	"regexp"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func validateEmail(email string) bool {
	emailRe := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return emailRe.MatchString(email)
}

func Register(c *fiber.Ctx) error {
	// var data map[string]interface{}
	data := models.User{}
	var userData models.User
	if err := c.BodyParser(&data); err != nil {
		fmt.Println("Unable to parse body")
	}
	fmt.Println(data)
	fmt.Println(data.Email)
	fmt.Println(string(data.Password))
	if len(string(data.Password)) <= 6 {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Password must be greater than 6 character",
		})
	}
	//Check if email is validated
	if !validateEmail(strings.TrimSpace(data.Email)) {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Invalid Email address",
		})
	}

	//Check if email already exist in DB
	database.DB.Where("email=?", strings.TrimSpace(data.Email)).First(&userData)
	if userData.ID != 0 {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Email already exist",
		})
	}
	//Save user data to BD
	// user := models.User{
	// 	FirstName: data["first_name"].(string),
	// 	LastName:  data["last_name"].(string),
	// 	Phone:     data["phone"].(string),
	// 	Email:     strings.TrimSpace(data["email"].(string)),
	// 	Role:      int(data["role"].(float64)),
	// 	Rating:    0.0,
	// 	Wallet:    0.0,
	// }
	data.Rating = 0.0
	data.Wallet = 0.0
	//data.SetPassword(string(data.Password))
	err := database.DB.Create(&data)
	if err != nil {
		log.Println(err)
	}
	c.Status(200)
	return c.JSON(fiber.Map{
		"user":    data,
		"message": "Account created successfully!!!",
	})
}
