#!/usr/bin/env python3
"""
Полный тест календаря garant-master через браузер
"""
import requests
import json
from datetime import datetime, timedelta

# Конфигурация
BASE_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:3000"

def create_garant_master_user():
    """Создаем специального пользователя для garant-master"""
    print("🔧 Создаем пользователя для garant-master...")
    
    user_data = {
        "email": "garant_master@example.com",
        "password": "garant123",
        "role": "master",
        "first_name": "Garant",
        "last_name": "Master",
        "phone": "+77071234999"
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        # Создаем пользователя
        response = requests.post(f"{BASE_URL}/api/users/create/", json=user_data, headers=headers)
        if response.status_code in [200, 201]:
            print("✅ Пользователь garant-master создан")
        else:
            print(f"⚠️ Пользователь уже существует: {response.status_code}")
        
        # Авторизуемся и получаем токен
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        response = requests.post(f"{BASE_URL}/login/", json=login_data, headers=headers)
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user_id = data.get('user', {}).get('id')
            
            print(f"✅ Авторизация успешна")
            print(f"📧 Email: {user_data['email']}")
            print(f"🔑 Password: {user_data['password']}")
            print(f"🆔 User ID: {user_id}")
            print(f"🔗 Token: {token}")
            
            # Создаем несколько тестовых событий
            create_sample_events(token)
            
            return user_id, token
        else:
            print(f"❌ Ошибка авторизации: {response.status_code}")
            return None, None
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return None, None

def create_sample_events(token):
    """Создаем несколько тестовых событий в календаре"""
    print("\n📅 Создаем тестовые события...")
    
    auth_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Token {token}"
    }
    
    # Создаем события на сегодня и завтра
    base_date = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)
    
    sample_events = [
        {
            "title": "Встреча с клиентом",
            "start": base_date.strftime("%Y-%m-%dT%H:%M:%S"),
            "end": (base_date + timedelta(hours=2)).strftime("%Y-%m-%dT%H:%M:%S"),
            "color": "#3B82F6"
        },
        {
            "title": "Планерка команды",
            "start": (base_date + timedelta(hours=3)).strftime("%Y-%m-%dT%H:%M:%S"),
            "end": (base_date + timedelta(hours=4)).strftime("%Y-%m-%dT%H:%M:%S"),
            "color": "#10B981"
        },
        {
            "title": "Работа над проектом",
            "start": (base_date + timedelta(days=1, hours=1)).strftime("%Y-%m-%dT%H:%M:%S"),
            "end": (base_date + timedelta(days=1, hours=5)).strftime("%Y-%m-%dT%H:%M:%S"),
            "color": "#F59E0B"
        }
    ]
    
    created_count = 0
    for event_data in sample_events:
        try:
            response = requests.post(f"{BASE_URL}/create/", json=event_data, headers=auth_headers)
            if response.status_code in [200, 201]:
                created_count += 1
                print(f"  ✅ Создано: {event_data['title']}")
            else:
                print(f"  ❌ Ошибка создания: {event_data['title']}")
        except Exception as e:
            print(f"  ❌ Ошибка: {e}")
    
    print(f"📊 Создано {created_count} из {len(sample_events)} событий")

def main():
    print("🚀 Полный тест календаря garant-master")
    print("=" * 50)
    
    user_id, token = create_garant_master_user()
    
    if user_id and token:
        print(f"\n🌟 Тест завершен успешно!")
        print(f"\n📋 Данные для входа в garant-master:")
        print(f"   URL: {FRONTEND_URL}")
        print(f"   Email: garant_master@example.com")
        print(f"   Password: garant123")
        print(f"   User ID: {user_id}")
        print(f"\n📅 Теперь можете открыть {FRONTEND_URL}/calendar и проверить календарь!")
    else:
        print("❌ Тест не удался")

if __name__ == "__main__":
    main()
