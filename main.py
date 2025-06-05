from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from typing import Optional

app = FastAPI()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="lcisp"
    )

@app.get("/login")
async def login(username: str, password: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM T_USER_INFO WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user or user['password'] != password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )
        return {
            "message": "Logged in successfully",
            "role": user['role'],
            "username": username,
        }
    finally:
        cursor.close()
        connection.close()

@app.post("/register")
async def register(username: str, password: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        # 检查用户名是否已存在
        cursor.execute("SELECT * FROM T_USER_INFO WHERE username=%s", (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
        
        # 插入新用户
        cursor.execute(
            "INSERT INTO T_USER_INFO (username, password, role) VALUES (%s, %s, %s)",
            (username, password, "user")  # 默认角色为user
        )
        connection.commit()
        
        return {
            "message": "User registered successfully",
            "username": username
        }
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        cursor.close()
        connection.close() 