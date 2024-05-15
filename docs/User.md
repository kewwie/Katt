### User Documentation for [Kewi App](https://github.com/kewwie/kewiapp)
___

#### Table of Contents
1. **[Installation Guide](#1-installation-guide)**
2. **[User Manual](#2-user-manual)**
3. **[FAQs and Troubleshooting](#3-faqs-and-troubleshooting)**
4. **[Contact Information](#4-contact-information)**

---

#### 1. Installation Guide
- **Install Docker Compose**: 
- **Copy example values into env**: Copy all the example values from .env.example to .env file.
- **Set env values**: You need to set all values in .env, all values are required for the applicaion to work.

---

#### 2. User Manual


- **Build the project**: Open a terminal in the main directory and run `docker compose build` and wait for it to build.
- **Start the project**: Open a terminal in the main directory and run `docker compose start -d` and it will start running the containers.
- **Stop the project**: Open a terminal in the main directory and run `docker compose stop` and it will stop all running containers.
- **Update the project**: 
    - **Windows**: 
        1. Use `docker compose stop` and stop all containers.
        2. Now you can run `git pull` and it will pull the latest version from the repository.
        3. After it have downloaded and updated all files you rebuild the project using `docker compose build` in the terminal
        4. Run `docker compose start -d` to start all the containers with the updated version.
    - **Ubuntu/Linux**: 
        You can use shell to run `update.sh` in the main directory and it will update and restart the applcation for you.


---

#### 3. FAQs and Troubleshooting
- **Q: The application won't start. What should I do?**
  - A: Ensure docker compose have been installed and is running.
- **Q: The application wont connect, How do I fix it?**
  - A: Check so all values in env are correct, if it's the wrong values you can see it in logs.
- **Q: How to see logs?**
  - A: In the main directory you need to run the terminal command `docker compose logs -t -f` and it will show all logs from all containers.

---

#### 4. Contact Information
- Email - me@kewwie.com
- X/Twitter - [@k3wwie](https://x.com/k3wwie)
- [Bug Reports](https://github.com/kewwie/kewiapp/issues)
- [Support](https://api.kewwie.com/join/kewi)

---