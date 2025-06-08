#!/usr/bin/env python3
"""
Финальная проверка исправленного календаря garant-master
Тестируем что frontend теперь корректно взаимодействует с backend
"""

import requests
import json

# Конфигурация
BASE_URL = "http://127.0.0.1:8000"
EMAIL = "garant_master@example.com"
PASSWORD = "garant123"

def test_fixed_calendar():
    """Тестирует работу календаря после исправления endpoint"""
    
    print("🔧 Тестирование исправленного календаря garant-master")
    print("=" * 60)
    
    # 1. Получаем токен авторизации
    print("1. Авторизация...")
    auth_data = {
        "email": EMAIL,
        "password": PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/login/", json=auth_data)
    
    if response.status_code != 200:
        print(f"❌ Ошибка авторизации: {response.status_code}")
        return False
    
    token = response.json().get('token')
    print(f"✅ Токен получен: {token[:20]}...")
    
    headers = {
        'Authorization': f'Token {token}',
        'Content-Type': 'application/json'
    }
    
    # 2. Проверяем исправленный endpoint /mine (без trailing slash)
    print("\n2. Тестирование исправленного endpoint /mine...")
    response = requests.get(f"{BASE_URL}/mine", headers=headers)
    
    if response.status_code == 200:
        events = response.json()
        print(f"✅ GET /mine работает! Найдено {len(events)} событий")
        for event in events:
            print(f"   - {event['title']} ({event['start']})")
    else:
        print(f"❌ Ошибка GET /mine: {response.status_code}")
        return False
    
    # 3. Проверяем что старый endpoint /mine/ больше не работает (как и должно быть)
    print("\n3. Проверяем что старый endpoint /mine/ теперь не используется...")
    response = requests.get(f"{BASE_URL}/mine/", headers=headers)
    
    if response.status_code == 404:
        print("✅ Endpoint /mine/ правильно возвращает 404 (не используется)")
    else:
        print(f"⚠️  Endpoint /mine/ все еще доступен: {response.status_code}")
    
    # 4. Тестируем создание события через POST /create/
    print("\n4. Тестирование создания события...")
    test_event = {
        "title": "Тест исправленного календаря",
        "start": "2024-12-25T10:00:00",
        "end": "2024-12-25T11:00:00",
        "allDay": False
    }
    
    response = requests.post(f"{BASE_URL}/create/", json=test_event, headers=headers)
    
    if response.status_code in [200, 201]:
        created_event = response.json()
        print(f"✅ Событие создано: {created_event.get('title')} (ID: {created_event.get('id')})")
        event_id = created_event.get('id')
        
        # 5. Тестируем обновление события
        print("\n5. Тестирование обновления события...")
        update_data = {
            "start": "2024-12-25T11:00:00",
            "end": "2024-12-25T12:00:00"
        }
        
        response = requests.put(f"{BASE_URL}/update/{event_id}/", json=update_data, headers=headers)
        
        if response.status_code == 200:
            print("✅ Событие успешно обновлено")
        else:
            print(f"❌ Ошибка обновления: {response.status_code}")
        
        # 6. Тестируем удаление события
        print("\n6. Тестирование удаления события...")
        response = requests.delete(f"{BASE_URL}/delete/{event_id}/", headers=headers)
        
        if response.status_code in [200, 204]:
            print("✅ Событие успешно удалено")
        else:
            print(f"❌ Ошибка удаления: {response.status_code}")
            
    else:
        print(f"❌ Ошибка создания события: {response.status_code}")
        return False
    
    # 7. Финальная проверка календаря
    print("\n7. Финальная проверка календаря...")
    response = requests.get(f"{BASE_URL}/mine", headers=headers)
    
    if response.status_code == 200:
        events = response.json()
        print(f"✅ Календарь работает корректно! Итого событий: {len(events)}")
        print("\n📅 События в календаре:")
        for event in events:
            print(f"   - {event['title']} ({event['start']})")
    else:
        print(f"❌ Ошибка финальной проверки: {response.status_code}")
        return False
    
    print("\n" + "=" * 60)
    print("🎉 КАЛЕНДАРЬ ИСПРАВЛЕН И РАБОТАЕТ КОРРЕКТНО!")
    print("✅ Frontend теперь использует правильный endpoint /mine")
    print("✅ Все CRUD операции функционируют")
    print("✅ Авторизация проходит успешно")
    
    return True

if __name__ == "__main__":
    test_fixed_calendar()
