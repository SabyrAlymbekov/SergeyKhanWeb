#!/usr/bin/env python3
"""
Быстрый тест календаря garant-master
"""
import requests
import json
import sys
from datetime import datetime, timedelta

# Конфигурация
BASE_URL = "http://127.0.0.1:8000"
headers = {"Content-Type": "application/json"}

def test_login_and_get_token():
    """Создаем тестового мастера и получаем токен"""
    print("🔐 Тестируем авторизацию...")
    
    # Создаем тестового мастера
    user_data = {
        "email": "test_master_calendar@example.com",
        "password": "testpass123",
        "role": "master",
        "first_name": "Test",
        "last_name": "Master",
        "phone": "+77071234567"
    }
    
    try:
        # Создаем пользователя
        response = requests.post(f"{BASE_URL}/api/users/create/", json=user_data, headers=headers)
        if response.status_code in [200, 201]:
            print("✅ Тестовый мастер создан")
        else:
            print(f"⚠️ Пользователь уже существует или другая ошибка: {response.status_code}")
        
        # Авторизуемся
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        response = requests.post(f"{BASE_URL}/login/", json=login_data, headers=headers)
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user_id = data.get('user', {}).get('id')
            print(f"✅ Авторизация успешна. Token: {token[:20]}..., User ID: {user_id}")
            return token, user_id
        else:
            print(f"❌ Ошибка авторизации: {response.status_code} - {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Ошибка при авторизации: {e}")
        return None, None

def test_calendar_endpoints(token, user_id):
    """Тестируем все endpoints календаря"""
    if not token:
        print("❌ Нет токена для тестирования")
        return
    
    auth_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Token {token}"
    }
    
    print("\n📅 Тестируем календарные endpoints...")
    
    # 1. Получение собственных событий
    print("\n1️⃣ Тестируем GET /mine - получение событий мастера")
    try:
        response = requests.get(f"{BASE_URL}/mine", headers=auth_headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"✅ Получено {len(events)} событий")
        else:
            print(f"❌ Ошибка: {response.text}")
    except Exception as e:
        print(f"❌ Ошибка запроса: {e}")
    
    # 2. Создание события
    print("\n2️⃣ Тестируем POST /create/ - создание события")
    now = datetime.now()
    start_time = now + timedelta(hours=1)
    end_time = start_time + timedelta(hours=2)
    
    event_data = {
        "title": "Тестовое событие календаря",
        "start": start_time.strftime("%Y-%m-%dT%H:%M:%S"),
        "end": end_time.strftime("%Y-%m-%dT%H:%M:%S"),
        "color": "#3B82F6"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/create/", json=event_data, headers=auth_headers)
        print(f"Status: {response.status_code}")
        if response.status_code in [200, 201]:
            created_event = response.json()
            event_id = created_event.get('id')
            print(f"✅ Событие создано с ID: {event_id}")
            
            # 3. Обновление события
            if event_id:
                print(f"\n3️⃣ Тестируем PUT /update/{event_id}/ - обновление события")
                update_data = {
                    "start": (start_time + timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:%S"),
                    "end": (end_time + timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:%S")
                }
                
                try:
                    response = requests.put(f"{BASE_URL}/update/{event_id}/", json=update_data, headers=auth_headers)
                    print(f"Status: {response.status_code}")
                    if response.status_code == 200:
                        print("✅ Событие обновлено")
                    else:
                        print(f"❌ Ошибка обновления: {response.text}")
                except Exception as e:
                    print(f"❌ Ошибка запроса обновления: {e}")
                
                # 4. Удаление события
                print(f"\n4️⃣ Тестируем DELETE /delete/{event_id}/ - удаление события")
                try:
                    response = requests.delete(f"{BASE_URL}/delete/{event_id}/", headers=auth_headers)
                    print(f"Status: {response.status_code}")
                    if response.status_code == 204:
                        print("✅ Событие удалено")
                    else:
                        print(f"❌ Ошибка удаления: {response.text}")
                except Exception as e:
                    print(f"❌ Ошибка запроса удаления: {e}")
        else:
            print(f"❌ Ошибка создания события: {response.text}")
    except Exception as e:
        print(f"❌ Ошибка запроса создания: {e}")
    
    # 5. Финальная проверка - получение событий снова
    print("\n5️⃣ Финальная проверка - получение событий после тестов")
    try:
        response = requests.get(f"{BASE_URL}/mine", headers=auth_headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"✅ В календаре {len(events)} событий")
            for event in events:
                print(f"  - {event.get('title', 'Без названия')} ({event.get('start', '')})")
        else:
            print(f"❌ Ошибка: {response.text}")
    except Exception as e:
        print(f"❌ Ошибка запроса: {e}")

def main():
    print("🚀 Быстрый тест календаря garant-master")
    print("=" * 50)
    
    # Получаем токен
    token, user_id = test_login_and_get_token()
    
    # Тестируем календарные функции
    test_calendar_endpoints(token, user_id)
    
    print("\n✨ Тест завершен!")

if __name__ == "__main__":
    main()
