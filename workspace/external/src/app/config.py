import os

DB_HOST = os.getenv("DB_HOST", "mariadb")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "apiuser")
DB_PASSWORD = os.getenv("DB_PASSWORD", "apiuser")
DB_NAME = os.getenv("DB_NAME", "server_1")