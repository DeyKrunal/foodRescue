# MongoDB Setup & Deployment Guide 🍃

This guide provides instructions to set up MongoDB on your local machine or another PC to work exactly with the **Food Rescue Platform**.

## 1. Local MongoDB Installation (Windows)

### Option A: Manual Install (Standalone)
1.  **Download**: Go to the [MongoDB Community Server Download](https://www.mongodb.com/try/download/community) page.
2.  **Platform**: Select **Windows** and **MSI**.
3.  **Install**: Run the installer.
    *   Choose **Complete** installation.
    *   **IMPORTANT**: Ensure "Install MongoDB as a Service" is checked (this makes it run automatically in the background).
    *   Install **MongoDB Compass** (Graphical interface) when prompted.
4.  **Verification**:
    *   Open **MongoDB Compass**.
    *   Connect to `mongodb://localhost:27017`.
    *   Create a database named `foodrescuedb`.

### Option B: Docker (Recommended for ease)
If you have Docker installed, run:
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

---

## 2. Setting Up on a Different PC (Same Network)

If you want the backend to connect to a MongoDB instance running on **another** computer:

1.  **Find IP**: Get the IP address of the PC running MongoDB (e.g., `192.168.1.5`).
2.  **Configure MongoDB Bind IP**:
    *   On the MongoDB PC, locate `mongod.cfg` (usually in `C:\Program Files\MongoDB\Server\<version>\bin\`).
    *   Change `bindIp: 127.0.0.1` to `bindIp: 0.0.0.0` (allows connections from any IP).
    *   Restart the MongoDB Service.
3.  **Update Spring Boot Configuration**:
    *   In `backend/src/main/resources/application.properties`, update the URI:
    ```properties
    spring.data.mongodb.uri=mongodb://192.168.1.5:27017/foodrescuedb
    ```

---

## 3. Cloud Connectivity (MongoDB Atlas) - RECOMMENDED for Multi-PC
To make it work anywhere without IP configurations:
1.  Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Get your connection string: `mongodb+srv://<user>:<password>@cluster0.abc.mongodb.net/foodrescuedb`.
3.  Update `application.properties`:
    ```properties
    spring.data.mongodb.uri=mongodb+srv://admin:mypassword@cluster0.abc.mongodb.net/foodrescuedb
    ```

---

## 4. Key Differences from Hibernate (JPA)
*   **No H2 Console**: Use **MongoDB Compass** to view data instead of `/h2-console`.
*   **IDs are Strings**: The backend now uses MongoDB's default `String` BSON IDs instead of `Long` auto-increments.
*   **No Schema auto-update**: MongoDB is schema-less; Spring Data will create collections automatically when you first save data.

## 5. Running the App
```bash
# Backend
mvn clean install
mvn spring-boot:run

# Frontend
npm run dev
```
