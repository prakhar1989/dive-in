package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"

	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"
)

func main() {
	var socketPath string
	flag.StringVar(&socketPath, "socket", "/run/guest/volumes-service.sock", "Unix domain socket to listen on")
	flag.Parse()

	os.RemoveAll(socketPath)

	logrus.New().Infof("Starting listening on %s\n", socketPath)
	router := echo.New()
	router.HideBanner = true

	startURL := ""

	ln, err := listen(socketPath)
	if err != nil {
		log.Fatal(err)
	}
	router.Listener = ln

	router.GET("/checkdive", checkDive)
	router.POST("/analyze", analyzeImage)

	log.Fatal(router.Start(startURL))
}

func listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}

func analyzeImage(c echo.Context) error {
	var i Image
	if err := c.Bind(&i); err != nil {
		return err
	}
	log.Printf("Attempting to run dive for image: %s", i.Name)
	filename := fmt.Sprintf("%s.json", i.ID)

	// Check if results already exist for ID, return it
	jsonFile, err := os.Open(filename)
	if errors.Is(err, os.ErrNotExist) {
		// Run dive
		cmd := exec.Command("dive", i.Name, "--json", filename)
		if err := cmd.Run(); err != nil {
			c.Logger().Fatal(err)
			return err
		}

		// read the newly generated file
		jsonFile, err = os.Open(filename)
		if err != nil {
			c.Logger().Fatal(err)
			return err
		}
	} else {
		// File exists, just return that instead
		log.Printf("Results already exist. Not regenerating")
	}

	// return the generated file
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)

	return c.JSON(http.StatusOK, result)
}

func checkDive(c echo.Context) error {
	_, err := exec.LookPath("/usr/local/bin/dive")
	if err != nil {
		return c.JSON(http.StatusNotFound, HTTPMessageBody{Message: "Dive is not found"})
	}
	return c.JSON(http.StatusOK, HTTPMessageBody{Message: "Dive is installed"})
}

type HTTPMessageBody struct {
	Message string
}

type Image struct {
	Name string `json:"Name"`
	ID   string `json:"id"`
}
